import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createLambdaRole, createLambdas } from './lambdas';

interface SecretSantaStackProps extends cdk.StackProps {
  stage: string
}

export class SecretSantaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SecretSantaStackProps) {
    super(scope, id, props);
    const lambdaRole = createLambdaRole(this)
    const lambdas = createLambdas(this, lambdaRole)
  }
}
