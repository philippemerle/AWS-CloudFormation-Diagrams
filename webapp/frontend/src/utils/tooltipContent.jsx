/**
 * Tooltip Content Definitions for AWS CloudFormation Diagrams
 */

export const TOOLTIP_CONTENT = {
  outputFormat: {
    title: 'Output Format',
    description: 'Choose the diagram format to generate',
    formats: {
      png: 'PNG Image - Ideal for documents and presentations',
      svg: 'SVG Vector - Perfect quality at any scale',
      dot: 'DOT File - Graphviz text format for manual editing',
      dotjson: 'Interactive Viewer - Explore with zoom/pan/click',
      drawio: 'Draw.io - Open in draw.io editor or diagrams.net',
      mermaid: 'Mermaid - Text-based diagramming syntax',
      d2: 'D2 - Declarative diagramming language',
    },
  },

  extraArgs: {
    title: 'Additional CLI Arguments',
    description: 'Advanced options for aws-cfn-diagrams',
    examples: ['-v, --verbose : Enable verbose output'],
  },

  embedAllIcons: {
    title: 'Embed All Icons',
    description: 'Embed all AWS service icons directly into the output file',
    when: 'Useful for sharing diagrams without needing external icon files',
  },

  fileUpload: {
    title: 'Upload File',
    description: 'Import a CloudFormation template from your computer',
    formats: 'Accepted formats: .yaml, .yml, .json',
  },

  submit: {
    title: 'Generate Diagram',
    description: 'Start diagram generation with current parameters',
    steps: 'Parsing → Validation → Generation → Rendering',
  },

  download: {
    title: 'Download',
    description: 'Save the generated diagram to your computer',
  },

  history: {
    title: 'History',
    description: 'Access the 20 most recent generated diagrams',
    actions: 'Restore, delete, or clear history',
  },

  examples: {
    title: 'Examples',
    description: 'Load a pre-configured CloudFormation example',
  },
};

export function getTooltipContent(key) {
  const keys = key.split('.');
  let content = TOOLTIP_CONTENT;
  for (const k of keys) {
    content = content[k];
    if (!content) return '';
  }
  return content;
}

export function outputFormatTooltip() {
  return (
    <div className="min-w-[240px] max-w-[300px]">
      <div className="text-xs text-slate-300 mb-2">Choose the diagram output format</div>
      <div className="text-[11px] space-y-0.5 text-slate-400">
        <div>
          <span className="font-medium text-slate-300">PNG:</span> Image file
        </div>
        <div>
          <span className="font-medium text-slate-300">SVG:</span> Vector, scalable
        </div>
        <div>
          <span className="font-medium text-slate-300">DOT:</span> Graphviz format
        </div>
        <div>
          <span className="font-medium text-slate-300">DOT_JSON:</span> Interactive
        </div>
        <div>
          <span className="font-medium text-slate-300">DRAWIO:</span> Draw.io editor
        </div>
        <div>
          <span className="font-medium text-slate-300">MERMAID:</span> Mermaid text
        </div>
        <div>
          <span className="font-medium text-slate-300">D2:</span> D2 text
        </div>
      </div>
    </div>
  );
}

export function extraArgsTooltip() {
  return (
    <div className="min-w-[320px]">
      <div className="font-semibold mb-2">{TOOLTIP_CONTENT.extraArgs.title}</div>
      <div className="text-xs text-slate-300 mb-3">{TOOLTIP_CONTENT.extraArgs.description}</div>
      <div className="text-xs">
        <div className="font-medium mb-2">Examples:</div>
        <div className="grid grid-cols-1 gap-1">
          {TOOLTIP_CONTENT.extraArgs.examples.map((ex, i) => (
            <div key={i} className="text-slate-400 font-mono text-[10px]">
              • {ex}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function embedAllIconsTooltip() {
  return (
    <div className="min-w-[260px]">
      <div className="text-xs text-slate-300">{TOOLTIP_CONTENT.embedAllIcons.description}</div>
    </div>
  );
}

export default TOOLTIP_CONTENT;
