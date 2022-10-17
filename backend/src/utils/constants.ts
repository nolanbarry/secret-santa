// see cdk/lib/lambdas.getLambdaEnvironmentVariables for definitions of these in deployment
// the default values (i.e. ?? "auth table") are used when the environment variables don't exist,
// which occurs when running unit tests. all that matters is that these values are unique so we can
// verify calls are being made with the right constant
const tables = {
  auth: {
    name: process.env["AUTH_TABLE_NAME"] ?? "auth table",
    partitionKey: 'id',
    sortKey: 'otp',
    /** Number of seconds since last use before an auth table entry with an auth token should expire */
    authTokenTTL: 60 * 60 * 24 * 3, // 3 days 
    /** Number of seconds before an auth table entry with just an OTP should expire */
    otpTTL: 60 * 5, // 5 minutes
    /** The name of the key that dynamodb scans to determine when an entry should expire. Key should be set the datetime, in 
    * epoch seconds, that the entry should expire */
    ttlKey: 'expiration-date',
    schema: {
      id: 'id',
      otp: 'otp',
      authToken: 'auth-token',
      expirationDate: 'expiration-date'
    },
    indexes: {
      byAuthToken: {
        name: process.env["AUTH_TABLE_AUTH_TOKEN_INDEX_NAME"] ?? "auth table auth token index",
        partitionKey: 'auth-token'
      }
    }
  },
  users: {
    name: process.env["USERS_TABLE_NAME"] ?? "users table",
    partitionKey: 'id',
    schema: {
      id: 'id',
      phoneNumber: 'phoneNumber',
      email: 'email'
    },
    indexes: {
      byPhoneNumber: {
        name: process.env["USERS_TABLE_PHONE_NUMBER_INDEX_NAME"] ?? "users table phone number index",
        partitionKey: 'phone-number'
      },
      byEmail: {
        name: process.env["USERS_TABLE_EMAIL_INDEX_NAME"] ?? "users table email index",
        partitionKey: 'email'
      }
    }
  },
  players: {
    name: process.env["PLAYERS_TABLE_NAME"] ?? "players table",
    partitionKey: 'game-code',
    sortKey: 'display-name',
    schema: {
      id: 'id',
      displayName: 'display-name',
      gameCode: 'game-code',
      assignedTo: 'assigned-to'
    },
  },
  games: {
    name: process.env["GAMES_TABLE_NAME"] ?? "games table",
    partitionKey: 'code',
    schema: {
      code: 'code',
      displayName: 'display-name',
      hostName: 'host-name'    
    },
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