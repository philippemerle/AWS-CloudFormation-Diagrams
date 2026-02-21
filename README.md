# AWS CloudFormation Diagrams

[![license](https://img.shields.io/github/license/philippemerle/AWS-CloudFormation-Diagrams)](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/blob/main/LICENSE)
![python version](https://img.shields.io/badge/python-%3E%3D%203.9-blue?logo=python)
[![pypi version](https://badge.fury.io/py/AWS-CloudFormation-Diagrams.svg)](https://badge.fury.io/py/AWS-CloudFormation-Diagrams)
[![PyPI Downloads](https://static.pepy.tech/personalized-badge/aws-cloudformation-diagrams?period=total&units=INTERNATIONAL_SYSTEM&left_color=GRAY&right_color=GREEN&left_text=pypi+downloads)](https://pepy.tech/projects/aws-cloudformation-diagrams)![contributors](https://img.shields.io/github/contributors/philippemerle/AWS-CloudFormation-Diagrams)

A simple CLI script to generate AWS infrastructure diagrams from AWS CloudFormation templates.

## Features

* Parses both YAML and JSON AWS CloudFormation templates
* Supports [140 AWS resource types and any custom resource types](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/blob/main/docs/supported_resource_types.md)
* Supports `Rain::Module` resource type
* Supports `DependsOn`, `Ref`, and `Fn::GetAtt` relationships
* Supports `::Id`-suffixed parameter types such as `AWS::EC2::Image::Id`, `AWS::EC2::SecurityGroup::Id`, `AWS::EC2::Subnet::Id`, `AWS::EC2::VPC::Id`, `AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>`, `List<AWS::EC2::SecurityGroup::Id>`, `List<AWS::EC2::Subnet::Id>`, or `List<AWS::EC2::VPC::Id>`

* Generates DOT, GIF, JPEG, PDF, PNG, SVG, and TIFF diagrams
* Provides [126 generated diagram examples](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/blob/main/diagrams/)

Have ideas? [Open an issue](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/issues/new) or [start a discussion](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/discussions/new).

## Prerequisites

Following software must be installed:

- [Python](https://www.python.org) 3.9 or higher
- `dot` command ([Graphviz](https://www.graphviz.org/))

## Installation

Following command installs required Python dependencies, i.e., [PyYAML](https://pyyaml.org) and [Diagrams](https://diagrams.mingrammer.com/).

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
  -f, --format FORMAT  output format, allowed formats are dot, dot_json, gif, jp2, jpe, jpeg, jpg, pdf, png, svg, tif, tiff, set to png by default
  --embed-all-icons    embed all icons into svg or dot_json output diagrams
```

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
