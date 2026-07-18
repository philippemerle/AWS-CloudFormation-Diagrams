/**
 * API service for AWS CloudFormation diagram generation
 */

import { API_ENDPOINTS } from '../utils/constants.js';
import logger from '../utils/logger.js';

async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      logger.error(`API request failed: ${endpoint}`, {
        statusCode: response.status,
        error: data?.error,
        endpoint,
      });
    }

    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    logger.error(`Network error during API request: ${endpoint}`, { error, endpoint });
    throw error;
  }
}

/**
 * Generate diagram from AWS CloudFormation template
 * @param {Object} params
 * @param {string} params.template - Template content (YAML or JSON)
 * @param {string} params.outputFormat - Output format
 * @param {string} [params.extraArgs] - Additional CLI arguments
 * @param {boolean} [params.embedAllIcons] - Embed all icons
 * @returns {Promise<Object>} Response with diagram data
 */
export async function generateCfnDiagram({
  template,
  outputFormat,
  extraArgs = '',
  embedAllIcons = false,
}) {
  logger.debug('Requesting CFN diagram generation', { outputFormat, embedAllIcons });

  const response = await apiFetch(API_ENDPOINTS.GENERATE_CFN, {
    body: JSON.stringify({
      template,
      outputFormat,
      extraArgs,
      embedAllIcons,
    }),
  });

  if (response.ok && response.data.diagram) {
    logger.info('CFN diagram generated successfully', {
      outputFormat,
      filename: response.data.filename,
    });
  }

  return response;
}

/**
 * Submit user feedback
 */
export async function submitFeedback({ note, comment, diagramType }) {
  logger.debug('Submitting feedback', { note, diagramType });

  const response = await apiFetch(API_ENDPOINTS.SUBMIT_FEEDBACK, {
    body: JSON.stringify({ note, comment, diagramType }),
  });

  if (response.ok) {
    logger.info('Feedback sent successfully', { diagramType, note });
  }

  return response;
}

/**
 * Render DOT source (already returned by a previous generate call) to SVG
 * @param {string} dot - DOT source text
 * @returns {Promise<Object>} Response with { svg } data
 */
export async function renderDotToSvg(dot) {
  logger.debug('Requesting DOT-to-SVG render');

  const response = await apiFetch(API_ENDPOINTS.RENDER_DOT_SVG, {
    body: JSON.stringify({ dot }),
  });

  if (!response.ok) {
    logger.warn('Failed to render DOT to SVG', {
      statusCode: response.status,
      error: response.data?.error,
    });
  }

  return response;
}

/**
 * Check if output contains fatal errors
 */
export function hasFatalErrors(stdout = '', stderr = '') {
  return /(^|\s)error:/i.test(stdout) || /(^|\s)error:/i.test(stderr);
}

export default {
  generateCfnDiagram,
  submitFeedback,
  renderDotToSvg,
  hasFatalErrors,
};
