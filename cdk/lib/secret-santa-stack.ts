import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface SecretSantaStackProps extends cdk.StackProps {
  stage: string
}

export class SecretSantaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SecretSantaStackProps) {
    super(scope, id, props);
  }
}
