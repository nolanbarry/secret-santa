// see cdk/lib/lambdas.getLambdaEnvironmentVariables for definitions of these in deployment
// the default values (i.e. ?? "auth table") are used when the environment variables don't exist,
// which occurs when running unit tests. all that matters is that these values are unique so we can
// verify calls are being made with the right constant
const tables = {
  auth: {
    name: process.env["AUTH_TABLE_NAME"] ?? "auth table",
    partitionKey: process.env["AUTH_TABLE_PARTITION_KEY"] ?? "auth table partition key",
    sortKey: process.env["AUTH_TABLE_SORT_KEY"] ?? "auth table sort key",
    /** Number of seconds since last use before an auth table entry with an auth token should expire */
    authTokenTTL: 60 * 60 * 24 * 3, // 3 days 
    /** Number of seconds before an auth table entry with just an OTP should expire */
    otpTTL: 60 * 5, // 5 minutes
    /** The name of the key that dynamodb scans to determine when an entry should expire. Key should be set the datetime, in 
    * epoch seconds, that the entry should expire */
    ttlKey: process.env["AUTH_TABLE_TTL_KEY"] ?? "auth table ttl key",
    schema: {
      otp: process.env["AUTH_TABLE_SORT_KEY"] ?? "auth table sort key",
      authToken: process.env["AUTH_TABLE_AUTH_TOKEN_INDEX_PARTITION_KEY"] ?? "auth table auth token index partition key",
      expirationDate: process.env["AUTH_TABLE_TTL_KEY"] ?? "auth table ttl key"
    },
    indexes: {
      byAuthToken: {
        name: process.env["AUTH_TABLE_AUTH_TOKEN_INDEX_NAME"] ?? "auth table auth token index",
        partitionKey: process.env["AUTH_TABLE_AUTH_TOKEN_INDEX_PARTITION_KEY"] ?? "auth table auth token index partition key"
      }
    }
  },
  users: {
    name: process.env["USERS_TABLE_NAME"] ?? "users table",
    partitionKey: process.env["USERS_TABLE_PARTITION_KEY"] ?? "users table partition key",
    indexes: {
      byPhoneNumber: {
        name: process.env["USERS_TABLE_PHONE_NUMBER_INDEX_NAME"] ?? "users table phone number index",
        partitionKey: process.env["USERS_TABLE_PHONE_NUMBER_INDEX_PARTITION_KEY"] ?? "users table phone number index partition key"
      },
      byEmail: {
        name: process.env["USERS_TABLE_EMAIL_INDEX_NAME"] ?? "users table email index",
        partitionKey: process.env["USERS_TABLE_EMAIL_INDEX_PARTITION_KEY"] ?? "users table email index partition key"
      }
    }
  },
  players: {
    name: process.env["PLAYERS_TABLE_NAME"] ?? "players table",
    partitionKey: process.env["PLAYERS_TABLE_PARTITION_KEY"] ?? "players table partition key",
    sortKey: process.env["PLAYERS_TABLE_SORT_KEY"] ?? ""
  },
  games: {
    name: process.env["GAMES_TABLE_NAME"] ?? "games table",
    partitionKey: process.env["GAMES_TABLE_PARTITION_KEY"] ?? "games table partition key"
  }
} as const

export default {
  /** CORS Headers that Lambdas must return for the data to be used by the client */
  corsHeaders: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": '*',
    "Access-Control-Allow-Methods": process.env["CORS_METHODS"] ?? "OPTIONS,POST,GET"
  },
  /** The AWS region the lambda is being called from, i.e. `us-west-2` */
  region: process.env["AWS_REGION"] ?? "us-west-2",
  tables,
  otpLength: 6
} as const