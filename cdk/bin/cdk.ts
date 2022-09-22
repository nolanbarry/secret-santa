#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SecretSantaStack } from '../lib/secret-santa-stack';

const app = new cdk.App();
new SecretSantaStack(app, 'SecretSantaPersonalStack', {
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  stage: 'dev',
  stackName: 'SecretSantaPersonalStack'
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});