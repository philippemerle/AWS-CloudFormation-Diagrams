# WordPress Example

This is a simple WordPress deployment with RDS generated with ChatGPT.

Type

```sh
aws-cfn-diagrams WordPress-RDS.yaml
```

to generate the following `png` diagram.

![WordPress RDS Diagram](WordPress-RDS.png)

Type

```sh
aws-cfn-diagrams -f pdf WordPress-RDS.yaml
```

to generate the following `pdf` diagram.

![WordPress RDS Diagram](WordPress-RDS.pdf)

Type

```sh
aws-cfn-diagrams -f svg --embed-all-icons WordPress-RDS.yaml
```

to generate the following `svg` diagram.

![WordPress RDS Diagram](WordPress-RDS.svg)

Type

```sh
aws-cfn-diagrams -f dot_json WordPress-RDS.yaml
```

to generate the [WordPress-RDS.dot_json](WordPress-RDS.dot_json) diagram.

Open the interactive viewer as follows.

```sh
open ../../interactive_viewer/index.html
```

Load [WordPress-RDS.dot_json](WordPress-RDS.dot_json) as illustrated as follows.

![WordPress RDS in the interactive viewer](WordPress-RDS-in-interactive-viewer.png)

Type

```sh
aws-cfn-diagrams -f drawio WordPress-RDS.yaml
```

to generate the [WordPress-RDS.drawio](WordPress-RDS.drawio) diagram. Then open it in [draw.io](https://www.drawio.com/) as follows.

![WordPress RDS in draw.io](WordPress-RDS-in-drawio.png)

