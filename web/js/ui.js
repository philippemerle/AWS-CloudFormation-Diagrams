const UI = (() => {

  function $(id) {
    const el = document.getElementById(id);
    if (!el) console.warn(`[UI] element #${id} not found`);
    return el;
  }

  function setDot(id, state) {
    const el = $(id);
    if (!el) return;
    el.className = 'status-dot';
    if (state === 'ready')   el.classList.add('is-ready');
    if (state === 'error')   el.classList.add('is-error');
    if (state === 'loading') el.classList.add('is-loading');
  }

  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text || '';
  }

  function setStatus(state, text) {
    setDot('status-dot', state);
    setText('status-text', text);
  }

  function setPyodideStatus(state, text) {
    setDot('pyodide-dot', state);
    setText('pyodide-label', text);
  }

  function show(id) {
    const el = $(id);
    if (!el) return;
    el.style.display = '';
    el.classList.remove('hidden');
  }

  function hide(id) {
    const el = $(id);
    if (!el) return;
    el.style.display = 'none';
    el.classList.add('hidden');
  }

  function showFlex(id) {
    const el = $(id);
    if (!el) return;
    el.classList.remove('hidden');
    el.style.display = 'flex';
  }

  function hideFlex(id) {
    const el = $(id);
    if (!el) return;
    el.style.display = 'none';
    el.classList.add('hidden');
  }

  function showLoading(msg) {
    setText('loading-text', msg || 'Processing…');
    showFlex('loading-overlay');
  }

  function hideLoading() {
    hideFlex('loading-overlay');
  }

  let errorTimer = null;

  function showError(message) {
    setText('error-text', message);
    showFlex('error-bar');
    clearTimeout(errorTimer);
    errorTimer = setTimeout(hideError, 8000);
  }

  function hideError() {
    hideFlex('error-bar');
  }

  function showWelcome() {
    showFlex('welcome-screen');
    hide('diagram-view');
    hide('code-view');
  }

  function hideWelcome() {
    hideFlex('welcome-screen');
  }

  function switchView(view) {
    const bd = $('btn-diagram');
    const bc = $('btn-code');

    if (view === 'diagram') {
      showFlex('diagram-view');
      hide('code-view');
      if (bd) { bd.classList.add('active');    }
      if (bc) { bc.classList.remove('active'); }
    } else {
      show('code-view');
      hide('diagram-view');
      if (bc) { bc.classList.add('active');    }
      if (bd) { bd.classList.remove('active'); }
    }
  }

  function updateStats({ resources, parameters, outputs, edges }) {
    setText('stat-resources', resources);
    setText('stat-params',    parameters);
    setText('stat-outputs',   outputs);
    setText('stat-edges',     edges);
  }

  function resetStats() {
    ['stat-resources','stat-params','stat-outputs','stat-edges']
      .forEach(id => setText(id, '—'));
  }

  const DOT_CLASS = {
    compute: 'dot-compute', network: 'dot-network', storage: 'dot-storage',
    security: 'dot-security', database: 'dot-database', other: 'dot-other',
  };

  function updateResourceList(nodes) {
    const list = $('resource-list');
    if (!list) return;
    list.innerHTML = '';

    const sorted = [...nodes].sort((a, b) => (a.type || '').localeCompare(b.type || ''));

    sorted.forEach((n, idx) => {
      const cat   = DiagramGenerator.getCategory(n.type || '');
      const stype = DiagramGenerator.shortType(n.type || 'Unknown');
      const item  = document.createElement('div');
      item.className = 'resource-item';
      item.style.animationDelay = `${Math.min(idx * 18, 400)}ms`;
      item.innerHTML = `
        <div class="resource-dot ${DOT_CLASS[cat]}"></div>
        <span class="resource-name" title="${n.id}">${n.id}</span>
        ${n.from_parameter
          ? '<span class="resource-badge">param</span>'
          : `<span class="resource-type" title="${n.type}">${stype}</span>`}
      `;
      list.appendChild(item);
    });
  }

  function resetResourceList() {
    const list = $('resource-list');
    if (!list) return;
    list.innerHTML = `
      <div class="text-center py-10 text-ink-600 text-xs leading-relaxed px-4">
        Drop a CloudFormation template<br />to see resources here
      </div>`;
  }

  function renderDiagramSVG(svg) {
    const el = $('diagram-output');
    if (el) el.innerHTML = svg;
  }

  function setMermaidCode(code) {
    const el = $('mermaid-code');
    if (el) el.textContent = code;
  }

  function setFilename(name) {
    setText('toolbar-filename', name);
  }

  function showExportBtn() {
    const el = $('btn-export');
    if (!el) return;
    el.classList.remove('hidden');
    el.style.display = 'flex';
  }

  function setDropZoneDragging(on) {
    const el = $('drop-zone');
    if (el) el.classList.toggle('drag-active', on);
  }

  return {
    setStatus, setPyodideStatus,
    showLoading, hideLoading,
    showError, hideError,
    showWelcome, hideWelcome,
    switchView,
    updateStats, resetStats,
    updateResourceList, resetResourceList,
    renderDiagramSVG, setMermaidCode, setFilename,
    showExportBtn, setDropZoneDragging,
  };
})();