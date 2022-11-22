import { Duration } from "aws-cdk-lib"
import { Effect, ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam"
import { Code, Function, Runtime, LayerVersion } from "aws-cdk-lib/aws-lambda"
import { SecretSantaStack } from "./secret-santa-stack"
import { tableConfigurations, Tables } from "./tables"

/* When defining a lambda, add its name (in kebab case, name should match exactly the
 * filename containing its handler) to the `Lambdas` type below. `configurationProps`
 * is typed such that it will automatically enforce that a configuration exists for
 * every name defined in `Lambdas`. */

/** 
 * This object is used to define typing for all objects containing information about
 * each lambda. For example, the `createLambdas` object returns a (typed) object with
 * each key named the same as a key (aka `lambda reference`) in this object and mapped 
 * to a `Function` object.
 */
export type Lambdas = {
  submitOtp: Function
  login: Function,
  getUser: Function,
  createGame: Function,
  joinGame: Function,
  getGame: Function,
  startGame: Function,
  endGame: Function,
  getUserPlayers: Function,
  getGamePlayers: Function
  getPlayer: Function
}

/** 
 * A collection of strings to index into objects that have some attribute for every
 * lambda.
 */
export type LambdaReference = keyof Lambdas

type LambdaConfigurationProps = {
  /** The name of the lambda. Must be formatted-in-kebab-case, and must match the name of the file in the build. */
  name: string,
  /** The api route to attach this lambda to, i.e. `/api/route` */
  apiRoute: string,
  /** The configured memory (in megabytes) for the lambda. Defaults to 128. */
  memory?: number,
  /** The configured timeout for the lambda. Defaults to 20 seconds. */
  timeout?: Duration,
  /** A description of what the lambda does. */
  description?: string
}

/** The contents of this object are used to configure each Lambda when deploying. See the 
 * `LambdaConfigurationProps` type for more options available for configuration. The 
 * configured type of this variable will automatically update to require a configuration
 * for every lambda named in the `Lambdas` type.
 */
const configurationProps: { [Property in LambdaReference]: LambdaConfigurationProps } = {
  submitOtp: {
    name: 'submit-otp',
    apiRoute: '/user/submitotp',
  },
  login: {
    name: 'login',
    apiRoute: '/user/login'
  },
  getUser: {
    name: 'get-user',
    apiRoute: '/user'
  },
  createGame: {
    name: 'create-game',
    apiRoute: '/game/create'
  },
  joinGame: {
    name: 'join-game',
    apiRoute: '/game/join'
  },
  getGame: {
    name: 'get-game',
    apiRoute: '/game'
  },
  startGame: {
    name: 'start-game',
    apiRoute: '/game/start'
  },
  endGame: {
    name: 'end-game',
    apiRoute: '/game/end'
  },
  getUserPlayers: {
    name: 'get-user-players',
    apiRoute: '/user/players'
  },
  getGamePlayers: {
    name: 'get-game-players',
    apiRoute: '/game/players'
  },
  getPlayer: {
    name: 'get-player',
    apiRoute: '/user/player'
  }
}

class LambdaConfiguration {
  public name: string
  public cdkID: string
  public friendlyName: string
  public apiRoute: string
  public memory: number
  public timeout: Duration
  public description: string
  public handler: string

  constructor(props: LambdaConfigurationProps) {
    const tokenizedName = props.name.split('-').map(([first, ...after]) => first.toUpperCase() + after.join(""));
    this.name = `secret-santa-${props.name}`;
    this.cdkID = tokenizedName.join("") + 'Lambda';
    this.friendlyName = tokenizedName.join(" ");

    this.handler = `lambda/${props.name}.default`
    this.apiRoute = props.apiRoute;
    this.memory = props.memory ?? 128;
    this.timeout = props.timeout ?? Duration.seconds(20);
    this.description = props.description ?? `Lambda to handle ${props.apiRoute}`;
  }
}

/** 
 * Creates a map with the same keys as `Lambda`, except that instead of just the function name, the value
 * is the function configuration. 
 */
function buildConfigurationMap(): { [Property in LambdaReference]: LambdaConfiguration } {
  const configurationMap: any = {};
  for (let reference of Object.keys(configurationProps) as LambdaReference[]) {
    configurationMap[reference] = new LambdaConfiguration(configurationProps[reference]);
  }
  return configurationMap;
}
/** Maps LambdaReference -> Configuration object for that lambda */
export const lambdaConfigurations = buildConfigurationMap();

/** 
 * Creates a Lambda function for every configuration defined in this file and returns it
 * in an object map. Create `lamdaRole` with `createLambdaRole`.
 */
export function createLambdas(scope: SecretSantaStack, lambdaRole: Role): Lambdas {
  // These environment variables are available to all lambdas
  const environmentVariables = getLambdaEnvironmentVariables()

  const lambdas: any = {};

  // A layer is a way of putting all the dependencies in one place instead
  // of uploading them again for each lambda. 
  const layer = new LayerVersion(scope, "SecretSantaLambdaLayer", {
    code: Code.fromAsset('../backend/layer'),
    description: "Contains node_modules used by Secret Santa lambdas",
    layerVersionName: "SecretSantaNodeModules",
  })

  const sharedConfiguration = {
    code: Code.fromAsset('../backend/build'),
    runtime: Runtime.NODEJS_16_X,
    role: lambdaRole,
    layers: [layer],
    environment: environmentVariables
  };

  for (let reference of Object.keys(lambdaConfigurations) as LambdaReference[]) {
    const configuration = lambdaConfigurations[reference];

    lambdas[reference] = new Function(scope, configuration.cdkID, {
      ...sharedConfiguration,
      functionName: configuration.name,
      handler: configuration.handler, // file containing handler should be named same as function name
      description: configuration.description,
      memorySize: configuration.memory,
      timeout: configuration.timeout,
    });
  }
  return lambdas;
}

/** Custom policies used by lambda role. */
const policies = [
  new PolicyStatement({
    actions: ["ses:SendEmail", "ses:SendRawEmail", "ses:GetEmailIdentity"],
    effect: Effect.ALLOW,
    resources: ['*']
  })
]


/**
 * Creates the role used by all Lambdas. Pass the dynamodb tables so that the Lambdas
 * can be granted read/write access. Create `tables` with `./tables.createTables`
 */
export function createLambdaRole(scope: SecretSantaStack, tables: Tables) {
  const role = new Role(scope, "LambdaRole", {
    assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")],
    roleName: "SecretSantaLambdaRole"
  })

  for (const table of Object.values(tables)) {
    table.grantReadWriteData(role)
  }

  for (const policy of policies) {
    role.addToPolicy(policy)
  }

  return role
}

function getLambdaEnvironmentVariables() {
  /* 
   * The information passed to lambdas should be strings that are configured specifically
   * through CDK, i.e. table names, partition keys, etc. Values that CDK doesn't control
   * (like table schema outside of the sort and partition keys) should be stored directly
   * in the `constants` file in backend. 
   */
  return {
    // Auth table
    AUTH_TABLE_NAME: tableConfigurations.auth.name,
    AUTH_TABLE_PARTITION_KEY: tableConfigurations.auth.partitionKey,
    AUTH_TABLE_SORT_KEY: tableConfigurations.auth.sortKey as string,
    AUTH_TABLE_AUTH_TOKEN_INDEX_NAME: tableConfigurations.auth.globalIndexes[0].name,
    AUTH_TABLE_AUTH_TOKEN_INDEX_PARTITION_KEY: tableConfigurations.auth.globalIndexes[0].partitionKey,
    AUTH_TABLE_TTL_KEY: tableConfigurations.auth.ttlKey as string,

    // Users table
    USERS_TABLE_NAME: tableConfigurations.users.name,
    USERS_TABLE_PARTITION_KEY: tableConfigurations.users.partitionKey,
    USERS_TABLE_PHONE_NUMBER_INDEX_NAME: tableConfigurations.users.globalIndexes[0].name,
    USERS_TABLE_PHONE_NUMBER_INDEX_PARTITION_KEY: tableConfigurations.users.globalIndexes[0].partitionKey,
    USERS_TABLE_EMAIL_INDEX_NAME: tableConfigurations.users.globalIndexes[1].name,
    USERS_TABLE_EMAIL_INDEX_PARTITION_KEY: tableConfigurations.users.globalIndexes[1].partitionKey,

    // Players table
    PLAYERS_TABLE_NAME: tableConfigurations.players.name,
    PLAYERS_TABLE_PARTITION_KEY: tableConfigurations.players.partitionKey,
    PLAYERS_TABLE_SORT_KEY: tableConfigurations.players.sortKey as string,

    // Games table
    GAMES_TABLE_NAME: tableConfigurations.games.name,
    GAMES_TABLE_PARTITION_KEY: tableConfigurations.games.partitionKey
  }
}