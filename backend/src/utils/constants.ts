// see cdk/lib/lambdas.getLambdaEnvironmentVariables for definitions of these in deployment
const tables = {
  auth: {
    name: process.env["AUTH_TABLE_NAME"] ?? "",
    partitionKey: process.env["AUTH_TABLE_PARTITION_KEY"] ?? "",
    sortKey: process.env["AUTH_TABLE_SORT_KEY"] ?? "",
    indexes: {
      byAuthToken: {
        name: process.env["AUTH_TABLE_AUTH_TOKEN_INDEX_NAME"] ?? "",
        partitionKey: process.env["AUTH_TABLE_AUTH_TOKEN_INDEX_PARTITION_KEY"] ?? ""
      }
    }
  },
  users: {
    name: process.env["USERS_TABLE_PARTITION_KEY"] ?? "",
    partitionKey: process.env["USERS_TABLE_PARTITION_KEY"] ?? "",
    indexes: {
      byPhoneNumber: {
        name: process.env["USERS_TABLE_PHONE_NUMBER_INDEX_NAME"] ?? "",
        partitionKey: process.env["USERS_TABLE_PHONE_NUMBER_INDEX_PARTITION_KEY"] ?? ""
      },
      byEmail: {
        name: process.env["USERS_TABLE_EMAIL_INDEX_NAME"] ?? "",
        partitionKey: process.env["USERS_TABLE_EMAIL_INDEX_PARTITION_KEY"] ?? ""
      }
    }
  },
  players: {
    name: process.env["PLAYERS_TABLE_NAME"] ?? "",
    partitionKey: process.env["PLAYERS_TABLE_PARTITION_KEY"] ?? "",
    sortKey: process.env["PLAYERS_TABLE_SORT_KEY"] ?? ""
  },
  games: {
    name: process.env["GAMES_TABLE_NAME"] ?? "",
    partitionKey: process.env["GAMES_TABLE_PARTITION_KEY"] ?? ""
  }
}

export default {
  /** CORS Headers that Lambdas must return for the data to be used by the client */
  corsHeaders: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": '*',
      "Access-Control-Allow-Methods": process.env["CORS_METHODS"] ?? "OPTIONS,POST,GET"
  },
  /** The AWS region the lambda is being called from, i.e. `us-west-2` */
  region: process.env["AWS_REGION"] ?? "",
  tables
} as const