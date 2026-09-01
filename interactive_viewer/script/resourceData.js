(function () {
  'use strict';

  // domain → service → [ResourceType, ...]  (from aws-cfn-diagrams.yaml)
  const RESOURCE_CATEGORIES = {
      'analytics': {
          'DataPipeline':    ['Pipeline'],
          'EMR':             ['Cluster'],
          'KinesisFirehose': ['DeliveryStream'],
      },
      'compute': {
          'AppRunner':              ['Service'],
          'ApplicationAutoScaling': ['ScalableTarget','ScalingPolicy'],
          'EC2':                    ['DHCPOptions','EIP','Image','Instance','LaunchTemplate',
                                     'SecurityGroup','SecurityGroupEgress','SecurityGroupIngress'],
          'ECS':                    ['Cluster','Service','TaskDefinition'],
          'EKS':                    ['Cluster','Nodegroup'],
          'Lambda':                 ['Function','Permission','Version'],
          'Serverless':             ['Function'],
      },
      'database': {
          'DMS':         ['Endpoint','ReplicationInstance','ReplicationSubnetGroup','ReplicationTask'],
          'DynamoDB':    ['Table'],
          'ElastiCache': ['CacheCluster','ParameterGroup','ReplicationGroup','SubnetGroup'],
          'Neptune':     ['DBCluster','DBClusterParameterGroup','DBInstance','DBParameterGroup','DBSubnetGroup'],
          'RDS':         ['DBCluster','DBInstance','DBParameterGroup','DBSubnetGroup'],
      },
      'devtools': {
          'CDK':          ['Metadata'],
          'CodeBuild':    ['Project'],
          'CodeCommit':   ['Repository'],
          'CodePipeline': ['Pipeline'],
      },
      'integration': {
          'Events': ['EventBus','EventBusPolicy','Rule'],
          'SNS':    ['Subscription','Topic','TopicPolicy'],
          'SQS':    ['Queue','QueuePolicy'],
      },
      'iot': {
          'Greengrass':   ['CoreDefinition','CoreDefinitionVersion','FunctionDefinition','Group','SubscriptionDefinition'],
          'IoT':          ['Policy','Thing','TopicRule'],
          'IoTAnalytics': ['Channel','Dataset','Datastore','Pipeline'],
      },
      'management': {
          'AppConfig':      ['Application','ConfigurationProfile','DeploymentStrategy','Environment'],
          'AutoScaling':    ['AutoScalingGroup','LaunchConfiguration','ScalingPolicy','ScheduledAction'],
          'CloudFormation': ['Macro','Stack','StackSet','WaitCondition','WaitConditionHandle'],
          'CloudWatch':     ['Alarm','Dashboard'],
          'Config':         ['ConfigRule','ConfigurationRecorder','DeliveryChannel'],
          'Logs':           ['LogGroup','LogStream','QueryDefinition','ResourcePolicy','SubscriptionFilter'],
          'SSM':            ['Association','Document'],
          'ServiceCatalog': ['CloudFormationProduct','Portfolio','PortfolioProductAssociation',
                             'PortfolioShare','TagOption','TagOptionAssociation'],
      },
      'network': {
          'ApiGateway':             ['Authorizer','Deployment','Method','Model','Resource','RestApi','Stage'],
          'CloudFront':             ['CachePolicy','Distribution','OriginAccessControl'],
          'EC2':                    ['EgressOnlyInternetGateway','FlowLog','InternetGateway','NatGateway',
                                     'NetworkAcl','NetworkAclEntry','NetworkInterface','RouteTable','Subnet',
                                     'VPC','VPCCidrBlock','VPCEndpoint','VPCEndpointService',
                                     'VPCEndpointServicePermissions','VPCPeeringConnection'],
          'ElasticLoadBalancing':   ['LoadBalancer'],
          'ElasticLoadBalancingV2': ['Listener','ListenerRule','LoadBalancer','TargetGroup'],
          'Route53':                ['HostedZone'],
      },
      'security': {
          'CertificateManager': ['Certificate'],
          'Cognito':            ['UserPool','UserPoolClient','UserPoolDomain'],
          'DirectoryService':   ['MicrosoftAD','SimpleAD'],
          'IAM':                ['InstanceProfile','ManagedPolicy','Policy','Role','RolePolicy'],
          'KMS':                ['Alias','Key'],
          'SecretsManager':     ['Secret'],
          'WAFv2':              ['WebACL'],
      },
      'storage': {
          'EC2': ['Volume'],
          'EFS': ['AccessPoint','FileSystem','MountTarget'],
          'S3':  ['Bucket','BucketPolicy','Object'],
      },
  };

  const DOMAIN_COLORS = {
      'analytics':   '#e6f4ff',
      'compute':     '#fff5e6',
      'database':    '#e6ecff',
      'devtools':    '#f0f0f0',
      'integration': '#fff9e6',
      'iot':         '#e6ffee',
      'management':  '#ffe6f2',
      'network':     '#f2e6ff',
      'security':    '#ffe6e6',
      'storage':     '#e6ffe6',
  };

  // Flattened set of every "AWS::Service::Type" covered by RESOURCE_CATEGORIES,
  // used to tell a categorized resource type from one the mapping doesn't know
  // about yet (CloudFormation has far more resource types than are listed above).
  const KNOWN_KINDS = new Set(
      Object.values(RESOURCE_CATEGORIES).flatMap(services =>
          Object.entries(services).flatMap(([service, types]) =>
              types.map(type => `AWS::${service}::${type}`)
          )
      )
  );

  window.IV = window.IV || {};
  window.IV.resourceData = { RESOURCE_CATEGORIES, DOMAIN_COLORS, KNOWN_KINDS };
})();
