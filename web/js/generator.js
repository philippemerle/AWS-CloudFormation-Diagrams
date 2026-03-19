const DiagramGenerator = (() => {

  const TYPE_PREFIX_CATEGORY = [
    ['AWS::Lambda',                'compute'],
    ['AWS::EC2::Instance',         'compute'],
    ['AWS::ECS',                   'compute'],
    ['AWS::Batch',                 'compute'],
    ['AWS::ElasticBeanstalk',      'compute'],
    ['AWS::AutoScaling',           'compute'],
    ['AWS::ElasticLoadBalancing',  'compute'],
    ['AWS::ApplicationAutoScaling','compute'],
    ['AWS::EC2::VPC',              'network'],
    ['AWS::EC2::Subnet',           'network'],
    ['AWS::EC2::SecurityGroup',    'network'],
    ['AWS::EC2::RouteTable',       'network'],
    ['AWS::EC2::InternetGateway',  'network'],
    ['AWS::EC2::NatGateway',       'network'],
    ['AWS::EC2::VPCGatewayAttachment','network'],
    ['AWS::ApiGateway',            'network'],
    ['AWS::ApiGatewayV2',          'network'],
    ['AWS::CloudFront',            'network'],
    ['AWS::Route53',               'network'],
    ['AWS::ElasticLoadBalancingV2','network'],
    ['AWS::S3',                    'storage'],
    ['AWS::EFS',                   'storage'],
    ['AWS::FSx',                   'storage'],
    ['AWS::Glacier',               'storage'],
    ['AWS::Backup',                'storage'],
    ['AWS::IAM',                   'security'],
    ['AWS::KMS',                   'security'],
    ['AWS::SecretsManager',        'security'],
    ['AWS::ACM',                   'security'],
    ['AWS::WAFv2',                 'security'],
    ['AWS::Cognito',               'security'],
    ['AWS::RDS',                   'database'],
    ['AWS::DynamoDB',              'database'],
    ['AWS::ElastiCache',           'database'],
    ['AWS::Redshift',              'database'],
    ['AWS::Neptune',               'database'],
    ['AWS::DocumentDB',            'database'],
    ['AWS::Timestream',            'database'],
  ];

  const CATEGORY_STYLE = {
    compute:  'fill:#1c0f0d,stroke:#ff6b4a,color:#ff8a6a',
    network:  'fill:#0d1520,stroke:#47b8ff,color:#7dd3fd',
    storage:  'fill:#191a08,stroke:#d4f74a,color:#bce830',
    security: 'fill:#160a1c,stroke:#b847ff,color:#d28aff',
    database: 'fill:#081a12,stroke:#47ffb8,color:#1aee99',
    other:    'fill:#111318,stroke:#4a5060,color:#9ea2ab',
  };

  const EMOJI_MAP = [
    [/Lambda/,                            '⚡'],
    [/EC2::Instance/,                     '🖥️'],
    [/S3::Bucket/,                        '🪣'],
    [/RDS|Aurora/,                        '🗄️'],
    [/DynamoDB/,                          '⚡'],
    [/VPC$/,                              '🌐'],
    [/Subnet/,                            '🔲'],
    [/SecurityGroup/,                     '🛡️'],
    [/IAM/,                               '🔑'],
    [/ApiGateway/,                        '🔀'],
    [/CloudFront/,                        '☁️'],
    [/ECS|EKS|Fargate/,                   '🐳'],
    [/SQS|SNS/,                           '📨'],
    [/ElasticLoadBalancing|LoadBalancer/, '⚖️'],
    [/Route53/,                           '🔭'],
    [/KMS|SecretsManager|ACM/,            '🔐'],
    [/ElastiCache/,                       '⚡'],
    [/CloudFormation/,                    '📋'],
    [/CodePipeline|CodeBuild|CodeDeploy/, '🔧'],
    [/StepFunctions/,                     '🔄'],
    [/Kinesis/,                           '🌊'],
    [/Glue/,                              '🧩'],
  ];

  function getCategory(resourceType) {
    for (const [prefix, cat] of TYPE_PREFIX_CATEGORY) {
      if (resourceType.startsWith(prefix)) return cat;
    }
    return 'other';
  }

  function getEmoji(resourceType) {
    for (const [pattern, emoji] of EMOJI_MAP) {
      if (pattern.test(resourceType)) return emoji;
    }
    return '📦';
  }

  function shortType(fullType) {
    const parts = fullType.split('::');
    return parts.length >= 3 ? parts.slice(1).join('::') : fullType;
  }

  function safeId(name) {
    return name.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  function safeLabel(text, maxLen = 36) {
    return text.replace(/["\[\]{}()<>]/g, '').substring(0, maxLen);
  }

  function generate(parsed) {
    const { nodes, edges, vpc_children, subnet_children } = parsed;

    const resourceMap = {};
    for (const n of nodes) resourceMap[n.id] = n;

    const lines   = ['flowchart TB'];
    const styles  = [];
    const rendered = new Set();

    function renderNode(name, indent = '  ') {
      if (rendered.has(name)) return;
      rendered.add(name);

      const n     = resourceMap[name];
      const rtype = n?.type || 'Unknown';
      const nid   = safeId(name);
      const emoji = getEmoji(rtype);
      const stype = safeLabel(shortType(rtype), 30);
      const label = safeLabel(name, 28);
      const cat   = getCategory(rtype);
      const param = n?.from_parameter ? ' 🔧' : '';

      lines.push(`${indent}${nid}["${emoji} ${label}${param}<br/><small>${stype}</small>"]`);
      styles.push(`style ${nid} ${CATEGORY_STYLE[cat]}`);
    }

    function renderSubnet(name, indent = '  ') {
      if (rendered.has(name)) return;
      rendered.add(name);

      const nid   = safeId(name);
      const label = safeLabel(name, 28);

      lines.push(`${indent}subgraph ${nid}_sg ["🔲 ${label}"]`);
      renderNode(name, indent + '  ');
      for (const child of (subnet_children[name] || [])) {
        renderNode(child, indent + '  ');
      }
      lines.push(`${indent}end`);
    }

    function renderVpc(name) {
      if (rendered.has(name)) return;
      rendered.add(name);

      const nid   = safeId(name);
      const label = safeLabel(name, 28);

      lines.push(`  subgraph ${nid}_vpc ["🌐 ${label}"]`);
      renderNode(name, '    ');
      for (const child of (vpc_children[name] || [])) {
        if (child in subnet_children) renderSubnet(child, '    ');
        else renderNode(child, '    ');
      }
      lines.push(`  end`);
    }

    const allVpcKids = new Set(Object.values(vpc_children).flat());

    for (const vpcName of Object.keys(vpc_children)) renderVpc(vpcName);

    for (const subName of Object.keys(subnet_children)) {
      if (!allVpcKids.has(subName)) renderSubnet(subName, '  ');
    }

    for (const n of nodes) renderNode(n.id, '  ');

    for (const edge of edges) {
      const fromId = safeId(edge.from);
      const toId   = safeId(edge.to);
      const arrow  = edge.kind === 'depends' ? '-. depends .-> ' : '-->';
      lines.push(`  ${fromId} ${arrow} ${toId}`);
    }

    for (const s of styles) lines.push(`  ${s}`);

    return lines.join('\n');
  }

  return { generate, getCategory, getEmoji, shortType };
})();