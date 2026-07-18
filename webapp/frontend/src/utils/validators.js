/**
 * Validation utilities for AWS CloudFormation templates
 */

/**
 * Heuristic to detect if content looks like an AWS CloudFormation template
 * @param {string} content - The content to check
 * @returns {boolean} - True if it looks like a CFN template
 */
export function looksLikeCfnTemplate(content) {
  if (!content) return false;
  const cfnKeys = [
    /\bResources\s*:/,
    /\bAWSTemplateFormatVersion\s*:/,
    /\bDescription\s*:/,
    /\bParameters\s*:/,
    /\bOutputs\s*:/,
  ];
  return cfnKeys.some((re) => re.test(content));
}
