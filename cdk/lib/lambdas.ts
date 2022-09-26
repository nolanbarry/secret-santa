import { Duration } from "aws-cdk-lib"
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam"
import { Code, Function, Runtime, LayerVersion } from "aws-cdk-lib/aws-lambda"
import { SecretSantaStack } from "./secret-santa-stack"

type LambdaConfigurationProps = {
  /** The api route to attach this lambda to, i.e. `/api/route` */
  apiRoute: string,
  /** The configured memory (in megabytes) for the lambda. Defaults to 128. */
  memory?: number,
  /** The configured timeout for the lambda. Defaults to 20 seconds. */
  timeout?: Duration,
  /** A description of what the lambda does. */
  description?: string
}

class LambdaConfiguration {
  public name: string
  public cdkID: string
  public friendlyName: string
  public apiRoute: string
  public memory: number
  public timeout: Duration
  public description: string

  constructor(name: string, props: LambdaConfigurationProps) {
    const tokenizedName = name.split('-').map(([first, ...after]) => first.toUpperCase() + after.join(""));
    this.name = name;
    this.cdkID = tokenizedName.join("") + 'Lambda';
    this.friendlyName = tokenizedName.join(" ");

    this.apiRoute = props.apiRoute;
    this.memory = props.memory ?? 128;
    this.timeout = props.timeout ?? Duration.seconds(20);
    this.description = props.description ?? `Lambda to handle ${props.apiRoute}`;
  }
}


/* When defining a lambda, add its name (in kebab case, name should match exactly the
 * filename containing its handler) to the const below. `configurationProps`
 * is typed such that it will automatically enforce that a configuration exists for
 * every name defined in `Lambda`. */

/** 
 * This object is used to define typing for all objects containing information about
 * each lambda. For example, the `createLambdas` object returns a (typed) object with
 * each key named the same as a key (aka `lambda reference`) in this object and mapped 
 * to a `Function` object.
 */
const Lambda = {
  submitOtp: 'submit-otp',
  login: 'login',
  getUser: 'get-user',
  createGame: 'create-game',
  joinGame: 'join-game',
  getGame: 'get-game',
  startGame: 'start-game',
  endGame: 'end-game',
  getPlayers: 'get-players',
  getPlayer: 'get-player'
} as const

/** 
 * A type representing a union of all keys in the `Lambda` object. Other objects in this file
 * will use the same keys.
 */
type LambdaReference = keyof typeof Lambda

/** 
 * A type representing a union of all values in the `Lambda` object. e.g., the name of every
 * Lambda.
 */
type LambdaName = typeof Lambda[keyof typeof Lambda];
type DiscreteConfigurationProps = { [Property in LambdaName]: LambdaConfigurationProps }

/** The contents of this object are use to configure each Lambda when deploying. See the 
 * `LambdaConfigurationProps` type for more options available for configuration. The 
 * `DiscreteConfigurationProps` type will automatically update to require a configuration
 * for every lambda named in the `Lambda` object.
 */
const configurationProps: DiscreteConfigurationProps = {
  [Lambda.submitOtp]: {
    apiRoute: '/user/submitotp',
  },
  [Lambda.login]: {
    apiRoute: '/user/login'
  },
  [Lambda.getUser]: {
    apiRoute: '/user'
  },
  [Lambda.createGame]: {
    apiRoute: '/game/create'
  },
  [Lambda.joinGame]: {
    apiRoute: '/game/join'
  },
  [Lambda.getGame]: {
    apiRoute: '/game'
  },
  [Lambda.startGame]: {
    apiRoute: '/game/start'
  },
  [Lambda.endGame]: {
    apiRoute: '/game/end'
  },
  [Lambda.getPlayers]: {
    apiRoute: '/user/players'
  },
  [Lambda.getPlayer]: {
    apiRoute: '/user/player'
  }
}

/** 
 * Creates a map with the same keys as `Lambda`, except that instead of just the function name, the value
 * is the function configuration. 
 * */
function buildConfigurationMap(): {[Property in keyof typeof Lambda]: LambdaConfiguration} {
  const entries = Object.entries<LambdaName>(Lambda) as [LambdaReference, LambdaName][];
  const configurationMap: any = {};
  for (let [lambdaReference, lambdaName] of entries) {
    configurationMap[lambdaReference] = new LambdaConfiguration(lambdaName, configurationProps[lambdaName]);
  }
  return configurationMap;
}
/** Maps LambdaReference -> Configuration object for that lambda */
export const lambdaConfigurations = buildConfigurationMap();


// Return type of `createLambdas`
type Lambdas = {[Property in LambdaReference]: Function} 

/** 
 * Creates a Lambda function for every configuration defined in this file and returns it
 * in an object map. 
 */
export function createLambdas(scope: SecretSantaStack, lambdaRole: Role): Lambdas {
  // must declare object we are building as type `any`, otherwise
  // typescript throws a fit because all properties aren't defined at
  // once
  const lambdas: any = {};
  const layer = new LayerVersion(scope, "SecretSantaLambdaLayer", {
    code: Code.fromAsset('../backend/layer'),
    description: "Contains node_modules used by Secret Santa lambdas",
    layerVersionName: "SecretSantaNodeModules",
  })
  const sharedConfiguration = {
    code: Code.fromAsset('../backend/build'),
    runtime: Runtime.NODEJS_16_X,
    role: lambdaRole,
    layers: [layer]
  };

  for (let lambdaReference in Lambda) {
    const configuration = lambdaConfigurations[lambdaReference as LambdaReference];

    lambdas[lambdaReference] = new Function(scope, configuration.cdkID, {
      ...sharedConfiguration,
      functionName: `secret-santa-${configuration.name}`,
      handler: `lambda/${configuration.name}.default`, // file should be named same as function name
      description: configuration.description,
      memorySize: configuration.memory,
      timeout: configuration.timeout,
    });
  }
  return lambdas;
} 

export function createLambdaRole(scope: SecretSantaStack) {
  return new Role(scope, "LambdaRole", {
    assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")],
    roleName: "SecretSantaLambdaRole"
  })
}