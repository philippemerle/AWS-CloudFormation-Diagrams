# AWS CloudFormation Diagrams Configuration

**AWS CloudFormation Diagrams** is highly configurable. Its configuration is stored in the [aws-cfn-diagrams.yaml](../aws-cfn-diagrams.yaml) file and defines mappings of AWS resource types to their visual representations ([`resources`](#aws-resource-type-mapping)) and graphical styles ([`styles`](#graphical-styles)). It is structured as follows:

```yaml
resources:
  ... mappings of AWS resource types to their visual representations ...
styles:
  ... definitions of graphical styles ...
```

Currently, [aws-cfn-diagrams.yaml](../aws-cfn-diagrams.yaml) defines the mapping for [159 AWS resource types](supported_resource_types.md). 
**Contributing mappings for any other AWS resource types is welcome!**
 
## AWS resource type mapping

The mapping of an AWS resource type to its visual representation is defined as follows:

```yaml
resources:
  An_AWS_Resource_Type:
    kind: node|cluster|edge
    ... specific kind properties ...
```

An AWS resource type can be mapped to either a [visual `node`](#node-mapping) or a [visual `cluster`](#cluster-mapping) or a [visual `edge`](#edge-mapping).

### `node` mapping

Most of AWS resource types are mapped to visual nodes.

The mapping of an AWS resource type to its visual node is defined as follows:

```yaml
resources:
  An_AWS_Resource_Type:
    kind: node
    style: ...
    icon: ...
    edges: ...
    parents: ...
```

#### `style` property

The optional `style` property defines the graphical attributes of the visual node.
Its value can be either the name of a [graphical style](#graphical-styles) or a map of [Graphviz node attributes](https://graphviz.org/docs/nodes/).

For instance, following configuration
```yaml
resources:
  Unsupported Resource Type:
    kind: node
    style:
      fontname: Courier New Bold
      fontcolor: orange
```
represents all unsupported resources as a visual node with a bold label in the Courier New font and in the orange color.

#### `icon` property

The mandatory `icon` property defines the visual icon associated to a resource type.
This `icon` value can be either a `classname` or a `filename`.

##### `classname`

`classname` refers to a node class implemented with the [diagrams](https://diagrams.mingrammer.com/) library.
See [available AWS node classes provided by the diagrams library](https://diagrams.mingrammer.com/docs/nodes/aws).

For instance, following configuration

```yaml
resources:
  AWS::EC2::Instance:
    kind: node
    icon:
      classname: diagrams.aws.compute.EC2Instance
```

associates the ![AWS::EC2::Instance](https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/aws/compute/ec2-instance.png) icon to all `AWS::EC2::Instance` resources.

By default, the mapping for any unsupported resource type is defined as follows:

```yaml
resources:
  Unsupported Resource Type:
    kind: node
    icon:
      classname: diagrams.aws.general.General
```

Then any unsupported resource type is represented by the following icon ![Unsupported Resource Type](https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/aws/general/general.png)

Sometimes, the icon to associate to an AWS resource could be dependent of the properties of this resource. For instance, an AWS EC2 subnet could be private or public according to the value of its `MapPublicIpOnLaunch` property.

Following configuration
```yaml
resources:
  AWS::EC2::Subnet:
    kind: cluster
    icon:
      classname:
        - when: MapPublicIpOnLaunch == False
          then: diagrams.aws.network.PrivateSubnet
        - then: diagrams.aws.network.PublicSubnet
```

associates the ![AWS::EC2::Instance](https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/aws/network/private-subnet.png) icon when the `MapPublicIpOnLaunch` property is equals to `false` or the ![AWS::EC2::Instance](https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/aws/network/public-subnet.png) icon in any other cases.

Following configuration
```yaml
resources:
  AWS::ElastiCache::CacheCluster:
    kind: cluster
    icon:
      classname:
        - when: Engine == "redis"
          then: diagrams.aws.database.ElasticacheForRedis
        - when: Engine == "memcached"
          then: diagrams.aws.database.ElasticacheForMemcached
```

associates the ![AWS::ElastiCache::CacheCluster](https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/aws/database/elasticache-for-redis.png) icon when the `Engine` property is equals to `redis` or the  ![AWS::ElastiCache::CacheCluster](https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/aws/database/elasticache-for-memcached.png) icon when the `Engine` property is equals to `memcached`.

##### `filename`

`filename` refers to a PNG icon file to associate to the resource type.

Following configuration

```yaml
resources:
  Rain::Module:
    kind: cluster
    icon:
      filename: icons/Rain_Module.png
```

associates the ![Rain::Module](https://raw.githubusercontent.com/philippemerle/AWS-CloudFormation-Diagrams/refs/heads/main/icons/Rain_Module.png) icon to all `Rain::Module` resources.

#### `edges` property

The optional `edges` property lists resource properties referencing other resources and represented as edges.

Following configuration
```yaml
resources:
  AWS::EC2::RouteTable:
    kind: node
    edges:
      - VpcId
```
defines a visual edge from each `AWS::EC2::RouteTable` resource and the resource referenced by its `VpcId` property.

#### `parents` property

The optional `parents` property lists resource properties referencing parent resources.

Following configuration
```yaml
resources:
  AWS::EC2::RouteTable:
    kind: node
    parents:
      - VpcId
```
defines that each `AWS::EC2::RouteTable` visual node will be contained in the visual cluster of the resource referenced by its `VpcId` property.

### `cluster` mapping

Some of resource types are mapped to visual clusters, such as `AWS::EC2::VPC`, `AWS::EC2::Subnet`, `AWS::EC2::SecurityGroup`, `AWS::EKS::Cluster`, `AWS::ElastiCache::CacheCluster`, and so on.

The mapping of an AWS resource type to its visual cluster is defined as follows:

```yaml
resources:
  An_AWS_Resource_Type:
    kind: cluster
    style: ...
    icon: ...
    edges: ...
    parents: ...
    children: ...
```

#### `style` property

The optional `style` property defines the graphical attributes of a visual cluster. Its value can be either the name of a [graphical style](#graphical-styles) or a map of [Graphviz cluster attributes](https://graphviz.org/docs/clusters/).

Following configuration
```yaml
resources:
  AWS::EC2::VPC:
    kind: cluster
    style: Network
```
associates the `Network` graphical style to the visual cluster representing an `AWS::EC2::VPC` resource.

Following configuration
```yaml
resources:
  Rain::Module:
    kind: cluster
    style:
      bgcolor: "#F1FFE6"
```
sets the background color of the visual cluster representing a `Rain::Module` resource.

#### `icon` property

See [`icon` node property](#icon-property).

#### `edges` property

See [`edges` node property](#edges-property).

#### `parents` property

See [`parents` node property](#parents-property).

#### `children` property

The optional `children` property lists resource properties referencing resources that must be put inside this visual cluster.

Following configuration

```yaml
resources:
  AWS::RDS::DBInstance:
    kind: cluster
    children:
      - DBParameterGroupName
```

defines that the visual representation of the resource referenced by the `DBParameterGroupName` property of an `AWS::RDS::DBInstance` resource must be put inside the visual cluster representing this `AWS::RDS::DBInstance` resource.

### `edge` mapping

Few resource types are mapped to visual edges, such as `AWS::EC2::Route`, `AWS::EC2::SubnetRouteTableAssociation`, `AWS::EC2::VPCGatewayAttachment`, and so on.

The mapping of an AWS resource type to a visual edge is defined as follows:

```yaml
resources:
  An_AWS_Resource_Type:
    kind: edge
    style: ...
    from: ...
    to: ...
```

#### `style` property

The optional `style` property defines the graphical attributes of the visual edge.
Its value can be either the name of a [graphical style](#graphical-styles) or a map of [Graphviz edge attributes](https://graphviz.org/docs/edges/).

Following configuration
```yaml
resources:
  AWS::EC2::SubnetRouteTableAssociation:
    kind: edge
    style: Association
```
associates the `Association` graphical style to the visual edge representing any `AWS::EC2::SubnetRouteTableAssociation` resource.

#### `from` property

The mandatory `from` property lists resource properties referencing the source resource of the visual edge.

Following configuration
```yaml
resources:
  AWS::EC2::SubnetRouteTableAssociation:
    kind: edge
    from:
      - SubnetId
```

defines that any `AWS::EC2::SubnetRouteTableAssociation` resource is represented by a visual edge, which the edge source is the visual representation of the resource referenced by the `SubnetId` property.

#### `to` property

The mandatory `to` property lists resource properties referencing the target resource of the visual edge.

Following configuration
```yaml
resources:
  AWS::EC2::SubnetRouteTableAssociation:
    kind: edge
    to:
      - RouteTableId
```

defines that any `AWS::EC2::SubnetRouteTableAssociation` resource is represented by a visual edge, which the edge target is the visual representation of the resource referenced by the `RouteTableId` property.

## Graphical styles

A graphical style is a named map of [Graphviz attributes](https://graphviz.org/doc/info/attrs.html).

A graphical style is defined as follows:

```yaml
styles:
  A_Style_Name:
    ... Graphviz attributes and values ...
```

For instance, following configuration
```yaml
styles:
  Network:
    bgcolor: "#f2e6ff"
```
defines the `Network` cluster style, which sets the background color.

Following configuration
```yaml
styles:
  Association:
    color: black
    #dir: both
    forward: true
    reverse: true
```
defines the `Association` edge style, which is bidirectional and of black color.
