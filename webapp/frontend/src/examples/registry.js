import { EXAMPLE_TYPES } from '../utils/constants.js';
import logger from '../utils/logger.js';

const CFN_EXAMPLES = [
  {
    id: 'wordpress-rds',
    name: 'WordPress with RDS',
    description: 'WordPress application with Amazon RDS database',
    filePath: '/examples/cfn/WordPress-RDS.yaml',
  },
  {
    id: 'elasticache-redis',
    name: 'ElastiCache Redis',
    description: 'Amazon ElastiCache with Redis engine',
    filePath: '/examples/cfn/ElastiCache-Redis.yaml',
  },
  {
    id: 'iam-policy',
    name: 'IAM Policy',
    description: 'AWS IAM Policy resource',
    filePath: '/examples/cfn/IAM_Policy.yaml',
  },
];

const contentCache = new Map();

async function fetchFileContent(filePath) {
  if (contentCache.has(filePath)) return contentCache.get(filePath);

  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load example: ${response.statusText}`);
    const content = await response.text();
    contentCache.set(filePath, content);
    return content;
  } catch (error) {
    logger.error(`Error loading example from ${filePath}`, { error, filePath });
    throw error;
  }
}

export function getExamplesByType(type) {
  if (type === EXAMPLE_TYPES.CFN) return CFN_EXAMPLES;
  return [];
}

export function getExampleById(type, id) {
  return getExamplesByType(type).find((ex) => ex.id === id) || null;
}

export async function loadExampleContent(type, id) {
  const example = getExampleById(type, id);
  if (!example) throw new Error(`Example not found: ${type}/${id}`);
  if (example.filePath) return await fetchFileContent(example.filePath);
  return example.content || '';
}
