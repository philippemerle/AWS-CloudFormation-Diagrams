# Examples Directory

This directory contains CloudFormation template example files for AWS CloudFormation Diagrams.

## Structure

```
examples/
└── cfn/       # AWS CloudFormation template examples
    ├── ElastiCache-Redis.yaml
    ├── IAM_Policy.yaml
    └── WordPress-RDS.yaml
```

## How to Add New Examples

1. Create a new YAML (or JSON) file in `cfn/` directory
2. Add the example configuration in `src/examples/registry.js`:

```javascript
const CFN_EXAMPLES = [
  // ...existing examples
  {
    id: 'my-example',
    name: 'My Example',
    description: 'Description of my example',
    filePath: '/examples/cfn/my-example.yaml'
  }
];
```