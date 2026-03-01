#! /bin/sh

PATH=../..:$PATH

# Generate the infrastructure diagrams.
for template in `ls *.yaml`
do
  aws-cfn-diagrams ${template}
done
