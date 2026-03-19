mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode:            true,
    background:          '#111318',
    mainBkg:             '#1a1d25',
    nodeBorder:          '#252933',
    clusterBkg:          '#1a1d25',
    clusterBorder:       '#252933',
    titleColor:          '#e8eaf0',
    edgeLabelBackground: '#111318',
    lineColor:           '#47b8ff',
    nodeTextColor:       '#e8eaf0',
    fontFamily:          'DM Mono, monospace',
    fontSize:            '12px',
  },
  flowchart: {
    curve:       'basis',
    padding:     20,
    nodeSpacing: 55,
    rankSpacing: 65,
    htmlLabels:  true,
    useMaxWidth: false,
  },
});

const state = {
  pyodide:      null,
  pyReady:      false,
  currentView:  'diagram',
  lastSVG:      null,
  lastFilename: null,
};

async function initPyodide() {
  UI.setPyodideStatus('loading', 'Loading Python runtime…');
  UI.showLoading('Loading Python / WebAssembly…');

  try {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load Pyodide script'));
      document.head.appendChild(script);
    });

    UI.showLoading('Initialising Pyodide…');
    state.pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
    });

    UI.showLoading('Installing PyYAML…');
    await state.pyodide.loadPackage('pyyaml');

    UI.showLoading('Loading CFN parser…');
    const resp = await fetch('python/cfn_parser.py');
    if (!resp.ok) throw new Error(`Failed to fetch cfn_parser.py (${resp.status})`);
    const src = await resp.text();
    await state.pyodide.runPythonAsync(src);

    state.pyReady = true;
    UI.setPyodideStatus('ready', 'Python ready');
  } catch (err) {
    console.error('[Pyodide]', err);
    UI.setPyodideStatus('error', 'Python unavailable — reload to retry');
    state.pyReady = false;
  } finally {
    UI.hideLoading();
  }
}

async function parseWithPython(content, filename) {
  state.pyodide.globals.set('_cfn_content', content);
  state.pyodide.globals.set('_cfn_filename', filename);
  const result = await state.pyodide.runPythonAsync(
    'parse_template(_cfn_content, _cfn_filename)'
  );
  return JSON.parse(result);
}

async function processTemplate(content, filename) {
  UI.showLoading('Parsing template…');
  UI.hideError();

  await new Promise(r => setTimeout(r, 40));

  try {
    if (!state.pyReady) {
      throw new Error('Python runtime not ready. Please wait or reload the page.');
    }

    UI.showLoading('Running Python parser…');
    const parsed = await parseWithPython(content, filename);

    if (!parsed.nodes || parsed.nodes.length === 0) {
      throw new Error('No resources found in template.');
    }

    UI.showLoading('Generating diagram…');
    const code = DiagramGenerator.generate(parsed);

    const graphId = 'cfn-' + Date.now();
    const { svg } = await mermaid.render(graphId, code);

    state.lastSVG      = svg;
    state.lastFilename = filename;

    UI.renderDiagramSVG(svg);
    UI.setMermaidCode(code);
    UI.setFilename(filename);
    UI.setStatus('ready', filename);
    UI.showExportBtn();

    UI.updateStats({
      resources:  parsed.stats.resources,
      parameters: parsed.stats.parameters,
      outputs:    parsed.stats.outputs,
      edges:      parsed.edges.length,
    });

    UI.updateResourceList(parsed.nodes);
    UI.hideWelcome();
    UI.switchView(state.currentView);

  } catch (err) {
    console.error('[CFNDiagrams]', err);
    UI.showError(err.message || String(err));
    UI.setStatus('error', 'Parse error');
    UI.showWelcome();
  } finally {
    UI.hideLoading();
  }
}

function readFile(file) {
  if (!file) return;
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!['.yaml', '.yml', '.json'].includes(ext)) {
    UI.showError(`Unsupported file type "${ext}". Use .yaml, .yml, or .json.`);
    return;
  }
  const reader = new FileReader();
  reader.onload  = e => processTemplate(e.target.result, file.name);
  reader.onerror = () => UI.showError('Could not read the file.');
  reader.readAsText(file);
}

function setupDropZone() {
  const dz = document.getElementById('drop-zone');
  const fi = document.getElementById('file-input');

  dz.addEventListener('click',   () => fi.click());
  dz.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fi.click(); });
  dz.addEventListener('dragover',  e => { e.preventDefault(); UI.setDropZoneDragging(true); });
  dz.addEventListener('dragleave', e => { if (!dz.contains(e.relatedTarget)) UI.setDropZoneDragging(false); });
  dz.addEventListener('drop',      e => { e.preventDefault(); UI.setDropZoneDragging(false); readFile(e.dataTransfer.files[0]); });

  document.addEventListener('dragover', e => e.preventDefault());
  document.addEventListener('drop', e => {
    e.preventDefault();
    if (dz.contains(e.target)) return;
    readFile(e.dataTransfer.files[0]);
  });

  fi.addEventListener('change', () => {
    if (fi.files[0]) readFile(fi.files[0]);
    fi.value = '';
  });
}

function switchView(view) {
  state.currentView = view;
  UI.switchView(view);
}

function exportSVG() {
  if (!state.lastSVG) return;
  const blob     = new Blob([state.lastSVG], { type: 'image/svg+xml;charset=utf-8' });
  const url      = URL.createObjectURL(blob);
  const anchor   = document.createElement('a');
  const baseName = (state.lastFilename || 'cfn-diagram').replace(/\.[^.]+$/, '');
  anchor.href     = url;
  anchor.download = `${baseName}-diagram.svg`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

document.addEventListener('DOMContentLoaded', () => {
  setupDropZone();
  UI.showWelcome();
  UI.resetStats();
  UI.resetResourceList();
  UI.setStatus('idle', 'No template loaded');
  initPyodide();
});

const app = { switchView, exportSVG };