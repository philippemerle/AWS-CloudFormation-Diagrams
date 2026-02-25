#!/bin/bash

# Generate diagrams for all examples
cd examples
for example in wordpress
do
  cd ${example}
  ./generate.sh
  cd ..
done
cd ..

# Update or clone aws-cloudformation-templates github repo
if [ -d aws-cloudformation-templates ]; then
  # Update aws-cloudformation-templates github repo
  cd aws-cloudformation-templates
  git pull
  cd ..
else
  # Clone aws-cloudformation-templates github repo
  git clone https://github.com/aws-cloudformation/aws-cloudformation-templates.git
fi

# Generate architecture diagrams for aws-cloudformation-templates github repo
for filename in \
  aws-cloudformation-templates/APIGateway/*.yaml \
  aws-cloudformation-templates/AppRunner/*.yaml \
  aws-cloudformation-templates/AutoScaling/*.yaml \
  aws-cloudformation-templates/AWSSupplyChain/SapPrivateLink/*.yaml \
  aws-cloudformation-templates/CloudFormation/*.yaml \
  aws-cloudformation-templates/CloudFormation/CustomResources/getfromjson/*/*.yml \
  aws-cloudformation-templates/CloudFormation/MacrosExamples/*/*.yaml \
  aws-cloudformation-templates/CloudFormation/StackSets/*.yaml \
  aws-cloudformation-templates/CloudFormation/StackSets/*/*.yaml \
  aws-cloudformation-templates/CloudFormation/StackSets-CDK/prerequisites/*.yaml \
  aws-cloudformation-templates/CloudWatch/*.yaml \
  aws-cloudformation-templates/Config/*.yaml \
  aws-cloudformation-templates/DataFirehose/*.yaml \
  aws-cloudformation-templates/DataPipeline/*.yaml \
  aws-cloudformation-templates/DirectoryService/*.yaml \
  aws-cloudformation-templates/DMS/*.yaml \
  aws-cloudformation-templates/DynamoDB/*.yaml \
  aws-cloudformation-templates/EC2/*.yaml \
  aws-cloudformation-templates/ECS/*.yaml \
  aws-cloudformation-templates/ECS/*/*/*.yaml \
  aws-cloudformation-templates/EFS/*.yaml \
  aws-cloudformation-templates/EKS/*.yaml \
  aws-cloudformation-templates/ElastiCache/*.yaml \
  aws-cloudformation-templates/ElasticLoadBalancing/*.yaml \
  aws-cloudformation-templates/EMR/*.yaml \
  aws-cloudformation-templates/IoT/*.yaml \
  aws-cloudformation-templates/Lambda/*.yaml \
  aws-cloudformation-templates/NeptuneDB/*.yaml \
  aws-cloudformation-templates/RainModules/*.yml \
  aws-cloudformation-templates/RDS/*.yaml \
  aws-cloudformation-templates/S3/*.yaml \
  aws-cloudformation-templates/ServiceCatalog/*.yaml \
  aws-cloudformation-templates/SNS/*.yaml \
  aws-cloudformation-templates/Solutions/*/*.yaml \
  aws-cloudformation-templates/Solutions/*/*/*.yaml \
  aws-cloudformation-templates/SQS/*.yaml \
  aws-cloudformation-templates/VPC/*.yaml 
do
  echo Generate diagram for $filename
  ./aws-cfn-diagrams $filename -o diagrams/${filename//\//-}.png
done
