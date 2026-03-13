#! /bin/sh

PATH=../..:$PATH

# Generate the infrastructure diagrams in different formats for the WordPress template.
for format in d2 dot_json drawio mermaid pdf png
do
  aws-cfn-diagrams -f ${format} WordPress-RDS.yaml
done
aws-cfn-diagrams -f svg --embed-all-icons WordPress-RDS.yaml
