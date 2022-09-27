import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { lambdaConfigurations, LambdaReference, Lambdas } from "./lambdas";
import { SecretSantaStack } from "./secret-santa-stack";

/**
 * Creates and configures an API gateway, based on the `apiRoute` attribute in the lambda
 * configuration.
 */
export function createApiGateway(scope: SecretSantaStack, functions: Lambdas) {
  const api = new RestApi(scope, "BackendAPI", {
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: ['POST', 'OPTIONS'],
    },
    restApiName: 'secret-santa-backend-api'
  })

  /* Build a tree based on the `apiRoute` property in the configuration for each lambda */
  type Node = { resource: typeof api.root, children: { [name: string]: Node } }

  const tree: Node = { resource: api.root, children: {} }

  for (let lambdaReference of Object.keys(lambdaConfigurations) as LambdaReference[]) {
    const lambda = functions[lambdaReference]
    const route = lambdaConfigurations[lambdaReference].apiRoute.split('/').filter(x => x != "")

    let node = tree

    // Navigate to resource that matches route, creating resources along the way as necessary.
    // i.e., For the route `/game/create`, we need to create a `game` resource, then add
    // a child resource called `create`, with the create-game lambda as the integration.
    // Then when we create the `/game/start` endpoint, we don't need to create the `game` resource
    // since we did it in the last step.
    for (let resourceName of route) {

      // create resource if it doesn't exist
      if (!(resourceName in tree.children)) {
        const resource = node.resource.addResource(resourceName)

        node.children[resourceName] = { resource, children: {} }
      }
      node = node.children[resourceName]
    }

    node.resource.addMethod('POST', new LambdaIntegration(lambda))
  }

  return api
}