# AWS CloudFormation Diagrams

[![license](https://img.shields.io/github/license/philippemerle/AWS-CloudFormation-Diagrams)](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/blob/main/LICENSE)
![python version](https://img.shields.io/badge/python-%3E%3D%203.9-blue?logo=python)
[![pypi version](https://badge.fury.io/py/AWS-CloudFormation-Diagrams.svg)](https://badge.fury.io/py/AWS-CloudFormation-Diagrams)
[![PyPI Downloads](https://static.pepy.tech/personalized-badge/aws-cloudformation-diagrams?period=total&units=INTERNATIONAL_SYSTEM&left_color=GRAY&right_color=GREEN&left_text=pypi+downloads)](https://pepy.tech/projects/aws-cloudformation-diagrams)![contributors](https://img.shields.io/github/contributors/philippemerle/AWS-CloudFormation-Diagrams)

An open source tool to generate AWS infrastructure diagrams from AWS CloudFormation templates.

## Features

* Parses both YAML and JSON AWS CloudFormation templates
* Supports [159 AWS resource types and any custom resource types](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/blob/main/docs/supported_resource_types.md)
* Supports `Rain::Module` resource type
* Supports `DependsOn`, `Ref`, `Fn::GetAtt` relationships, and `${}` resource attributes
* Supports `::Id`-suffixed parameter types such as `AWS::EC2::Image::Id`, `AWS::EC2::SecurityGroup::Id`, `AWS::EC2::Subnet::Id`, `AWS::EC2::VPC::Id`, `AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>`, `List<AWS::EC2::SecurityGroup::Id>`, `List<AWS::EC2::Subnet::Id>`, or `List<AWS::EC2::VPC::Id>`
* Generates DOT, draw.io, GIF, JPEG, Mermaid, PDF, PNG, SVG, and TIFF diagrams
* [Mermaid Diagram Generation](https://github.com/philippemerle/AWS-CloudFormation-Diagrams#mermaid-diagram-generation)
* [AWS CloudFormation Diagrams Interactive Viewer](https://github.com/philippemerle/AWS-CloudFormation-Diagrams#interactive-viewer)
* [Editable draw.io export](https://github.com/philippemerle/AWS-CloudFormation-Diagrams#editable-drawio-export)
* Provides [156 generated diagram examples](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/blob/main/diagrams/)


Have ideas? [Open an issue](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/issues/new) or [start a discussion](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/discussions/new).

## Prerequisites

Following software must be installed:

- [Python](https://www.python.org) 3.9 or higher
- `dot` command ([Graphviz](https://www.graphviz.org/))

## Installation

Following command installs required Python dependencies, i.e., [PyYAML](https://pyyaml.org), [Diagrams](https://diagrams.mingrammer.com/), and [graphviz2drawio](https://pypi.org/project/graphviz2drawio).

```ssh
# using pip (pip3)
pip install AWS-CloudFormation-Diagrams
```

## Usage

```bash
usage: aws-cfn-diagrams [-h] [-o OUTPUT] [-f FORMAT] [--embed-all-icons] filename

Generate AWS infrastructure diagrams from AWS CloudFormation templates

positional arguments:
  filename             the AWS CloudFormation template to process

options:
  -h, --help           show this help message and exit
  -o, --output OUTPUT  output diagram filename
  -f, --format FORMAT  output format, allowed formats are dot, dot_json, drawio, gif, jp2, jpe, jpeg, jpg, mermaid, pdf, png, svg, tif, tiff, set to png by default
  --embed-all-icons    embed all icons into svg or dot_json output diagrams
```

## Mermaid Diagram Generation

**AWS CloudFormation Diagrams** could output diagrams in the `mermaid` format. For instance, type:

```sh
aws-cfn-diagrams examples/wordpress/WordPress-RDS.yaml -f mermaid
```

The generated diagram is rendered as follows:

```mermaid
flowchart TB
  subgraph cluster_VpcId [VpcId]
    direction TB
    style cluster_VpcId fill:#f2e6ff,color:#2D3436,font:sans-serif,font-size:12pt,stroke:box
    subgraph cluster_WebSecurityGroup [WebSecurityGroup]
      direction TB
      style cluster_WebSecurityGroup fill:#fff5e6,color:#2D3436,font:sans-serif,font-size:12pt,stroke:box
      resource_WebSecurityGroup@{ img: "https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/aws/compute/ec2.png", label: "WebSecurityGroup", h: 120, constraint: "on" }
      style resource_WebSecurityGroup fill:none,stroke:none
      resource_WordPressInstance@{ img: "https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/aws/compute/ec2-instance.png", label: "WordPressInstance", h: 120, constraint: "on" }
      style resource_WordPressInstance fill:none,stroke:none
    end
    subgraph cluster_DBSecurityGroup [DBSecurityGroup]
      direction TB
      style cluster_DBSecurityGroup fill:#fff5e6,color:#2D3436,font:sans-serif,font-size:12pt,stroke:box
      resource_DBSecurityGroup@{ img: "https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/aws/compute/ec2.png", label: "DBSecurityGroup", h: 120, constraint: "on" }
      style resource_DBSecurityGroup fill:none,stroke:none
      resource_WordPressDB@{ img: "https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/aws/database/rds-mysql-instance.png", label: "WordPressDB", h: 120, constraint: "on" }
      style resource_WordPressDB fill:none,stroke:none
    end
    resource_VpcId@{ img: "https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/resources/aws/network/vpc.png", label: "VpcId", h: 120, constraint: "on" }
    style resource_VpcId fill:none,stroke:none
  end
  resource_WebSecurityGroup --> resource_VpcId
  linkStyle 0 stroke:black,color:#2D3436,font:sans-serif,font-size:13pt
  resource_WordPressInstance --> resource_WebSecurityGroup
  linkStyle 1 stroke:black,color:#2D3436,font:sans-serif,font-size:13pt
  resource_WordPressInstance --> resource_WordPressDB
  linkStyle 2 stroke:black,color:#2D3436,font:sans-serif,font-size:13pt
  resource_DBSecurityGroup --> resource_WebSecurityGroup
  linkStyle 3 stroke:black,color:#2D3436,font:sans-serif,font-size:13pt
  resource_DBSecurityGroup --> resource_VpcId
  linkStyle 4 stroke:black,color:#2D3436,font:sans-serif,font-size:13pt
  resource_WordPressDB --> resource_DBSecurityGroup
  linkStyle 5 stroke:black,color:#2D3436,font:sans-serif,font-size:13pt
```

## Interactive Viewer

**AWS CloudFormation Diagrams** could output diagrams in the `dot_json` format. For instance, type:

```sh
aws-cfn-diagrams examples/wordpress/WordPress-RDS.yaml -f dot_json
```

Diagrams in the `dot_json` format can be viewed and manipulated interactively thanks to **AWS CloudFormation Diagrams Interactive Viewer**. Just type:

```sh
open interactive_viewer/index.html
```

Then open [examples/wordpress/WordPress-RDS.dot_json](examples/wordpress/WordPress-RDS.dot_json) in **AWS CloudFormation Diagrams Interactive Viewer**.

![AWS CloudFormation Diagrams Interactive Viewer](https://raw.githubusercontent.com/philippemerle/AWS-CloudFormation-Diagrams/refs/heads/main/examples/wordpress/WordPress-RDS-in-interactive-viewer.png)

**AWS CloudFormation Diagrams Interactive Viewer** allows users to zoom in/out diagrams, to see cluster/node/edge tooltips, open/close clusters, move clusters/nodes interactively, and save as PNG/JPG images.

## Editable draw.io Export

**AWS CloudFormation Diagrams** could output diagrams in the `drawio` format. For instance, type:

```sh
aws-cfn-diagrams examples/wordpress/WordPress-RDS.yaml -f drawio
```

✨ Generated `drawio` files can be opened with [draw.io](https://www.drawio.com/) or your favorite diagram editor.

![AWS CloudFormation Diagrams in draw.io](https://raw.githubusercontent.com/philippemerle/AWS-CloudFormation-Diagrams/refs/heads/main/examples/wordpress/WordPress-RDS-in-drawio.png)

## Examples

The folder [diagrams](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/blob/main/diagrams) contains generated diagrams for most of [AWS CloudFormation templates](
https://github.com/aws-cloudformation/aws-cloudformation-templates).

Following diagram is about WebApp:

![WebApp](https://raw.githubusercontent.com/philippemerle/AWS-CloudFormation-Diagrams/refs/heads/main/diagrams/aws-cloudformation-templates-Solutions-WebApp-webapp.yaml.png)

Following diagram is about Gitea with `Rain::Module`:

![Gitea](https://raw.githubusercontent.com/philippemerle/AWS-CloudFormation-Diagrams/refs/heads/main/diagrams/aws-cloudformation-templates-Solutions-Gitea-Gitea.yaml.png)

Following diagram is about Gitea without `Rain::Module`:

![Gitea](https://raw.githubusercontent.com/philippemerle/AWS-CloudFormation-Diagrams/refs/heads/main/diagrams/aws-cloudformation-templates-Solutions-Gitea-Gitea-pkg.yaml.png)

Following diagram is about AutoScaling:

![AutoScaling](https://raw.githubusercontent.com/philippemerle/AWS-CloudFormation-Diagrams/refs/heads/main/diagrams/aws-cloudformation-templates-AutoScaling-AutoScalingMultiAZWithNotifications.yaml.png)

Following diagram is about EKS:

![EKS](https://raw.githubusercontent.com/philippemerle/AWS-CloudFormation-Diagrams/refs/heads/main/diagrams/aws-cloudformation-templates-EKS-template.yaml.png)

Following diagram is about VPC:

![VPC](https://raw.githubusercontent.com/philippemerle/AWS-CloudFormation-Diagrams/refs/heads/main/diagrams/aws-cloudformation-templates-VPC-VPC_With_Managed_NAT_And_Private_Subnet.yaml.png)

## License

This project is licensed under the [Apache 2.0 License](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/blob/main/LICENSE).

## Contributing

[PRs](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/pulls) and [ideas](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/discussions/categories/ideas) are welcome!

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=philippemerle/AWS-CloudFormation-Diagrams&type=date&legend=top-left)](https://www.star-history.com/#philippemerle/AWS-CloudFormation-Diagrams&type=date&legend=top-left)

**[Star this project](https://github.com/philippemerle/AWS-CloudFormation-Diagrams)** if you find it useful!
