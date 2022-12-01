import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createAmplifyApp } from './amplify';
import { createApiGateway } from './apiGateway';
import { createLambdaRole, createLambdas } from './lambdas';
import { createTables } from './tables';

interface SecretSantaStackProps extends cdk.StackProps {
  stage: string
}

export class SecretSantaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SecretSantaStackProps) {
    super(scope, id, props);

    const tables = createTables(this)
    
    const lambdaRole = createLambdaRole(this, tables)
    const lambdas = createLambdas(this, lambdaRole)

    const apis = createApiGateway(this, lambdas)
    const amplifyApp = createAmplifyApp(this)
  }
}
