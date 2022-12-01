import * as amplify from '@aws-cdk/aws-amplify-alpha';
import { CustomRule } from '@aws-cdk/aws-amplify-alpha';
import { SecretValue } from "aws-cdk-lib"
import { BuildSpec } from "aws-cdk-lib/aws-codebuild"
import { Construct } from 'constructs';

import { SecretSantaStack } from './secret-santa-stack';

const BUILD_SPEC = {
  version: '1.0',
  applications: [
    {
      appRoot: 'frontend',
      frontend: {
        phases: {
          preBuild: {
            commands: [
              'npm install'
            ]
          },
          build: {
            commands: [
              'npm run build'
            ]
          }
        },
        artifacts: {
          baseDirectory: 'dist',
          files: ['**/*'],
        },
        cache: {
          paths: ['node_modules/**/*']
        }
      }
    }
  ]
}

export function createAmplifyApp(scope: Construct) {
  const amplifyApp = new amplify.App(scope, 'SecretSantaAmplifyApp', {
    sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
      owner: 'nolanbarry',
      repository: 'secret-santa',
      oauthToken: SecretValue.secretsManager('github-token'),
    }),
    buildSpec: BuildSpec.fromObjectToYaml(BUILD_SPEC),
    environmentVariables: {
      AMPLIFY_MONOREPO_APP_ROOT: 'frontend'
    },
    customRules: [CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT]
  })

  const branch = amplifyApp.addBranch("main")
  return amplifyApp
}