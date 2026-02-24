#! /bin/sh

PATH=../..:$PATH

# Generate the infrastructure diagrams in different formats for the WordPress template.
for format in png dot_json drawio
do
  aws-cfn-diagrams -f ${format} WordPress-RDS.yaml
done
