// Output formats for diagram generation
export const OUTPUT_FORMATS = Object.freeze({
  PNG: 'png',
  JPG: 'jpg',
  JPEG: 'jpeg',
  GIF: 'gif',
  SVG: 'svg',
  PDF: 'pdf',
  DOT: 'dot',
  DOT_JSON: 'dot_json',
  DRAWIO: 'drawio',
  MERMAID: 'mermaid',
  D2: 'd2',
});

export const OUTPUT_FORMAT_LIST = Object.freeze([
  OUTPUT_FORMATS.PNG,
  OUTPUT_FORMATS.JPG,
  OUTPUT_FORMATS.JPEG,
  OUTPUT_FORMATS.GIF,
  OUTPUT_FORMATS.SVG,
  OUTPUT_FORMATS.PDF,
  OUTPUT_FORMATS.DOT,
  OUTPUT_FORMATS.DOT_JSON,
  OUTPUT_FORMATS.DRAWIO,
  OUTPUT_FORMATS.MERMAID,
  OUTPUT_FORMATS.D2,
]);

// API Endpoints
export const API_ENDPOINTS = Object.freeze({
  BASE: '/api',
  GENERATE_CFN: '/api/generate-cfn-diagram',
  SUBMIT_FEEDBACK: '/api/submit-feedback',
  EXAMPLES: '/api/examples',
  RENDER_DOT_SVG: '/api/render-dot-svg',
});

// Example types
export const EXAMPLE_TYPES = Object.freeze({
  CFN: 'cfn',
});

// File input configuration
export const FILE_INPUT = Object.freeze({
  ACCEPT: '.yaml,.yml,.json',
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB
  MAX_SIZE: 5 * 1024 * 1024,
});

// MIME types for different formats
export const MIME_TYPES = Object.freeze({
  [OUTPUT_FORMATS.PNG]: 'image/png',
  [OUTPUT_FORMATS.JPG]: 'image/jpg',
  [OUTPUT_FORMATS.JPEG]: 'image/jpeg',
  [OUTPUT_FORMATS.GIF]: 'image/gif',
  [OUTPUT_FORMATS.SVG]: 'image/svg+xml',
  [OUTPUT_FORMATS.PDF]: 'application/pdf',
  [OUTPUT_FORMATS.DOT]: 'text/vnd.graphviz',
  [OUTPUT_FORMATS.DOT_JSON]: 'application/json',
  [OUTPUT_FORMATS.DRAWIO]: 'application/xml',
  [OUTPUT_FORMATS.MERMAID]: 'text/vnd.mermaid',
  [OUTPUT_FORMATS.D2]: 'text/vnd.d2',
});

// Viewer message types for postMessage communication
export const VIEWER_MESSAGE_TYPES = Object.freeze({
  DOT_JSON: 'KD_LOAD_DOT_JSON',
  READY: 'VIEWER_READY',
  RESIZE: 'VIEWER_RESIZE',
});

// Default values
export const DEFAULTS = Object.freeze({
  OUTPUT_FORMAT: OUTPUT_FORMATS.PNG,
  TIMEOUT_MS: 60000,
  FILENAME: 'diagram',
});

// Text-based formats (not base64 encoded)
export const TEXT_FORMATS = Object.freeze([
  OUTPUT_FORMATS.SVG,
  OUTPUT_FORMATS.DOT,
  OUTPUT_FORMATS.DOT_JSON,
  OUTPUT_FORMATS.DRAWIO,
  OUTPUT_FORMATS.MERMAID,
  OUTPUT_FORMATS.D2,
]);
