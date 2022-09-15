export const constants = {
  /** CORS Headers that Lambdas must return for the data to be used by the client */
  corsHeaders: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": '*',
      "Access-Control-Allow-Methods": process.env["CORS_METHODS"] ?? "OPTIONS,POST,GET"
  },
  /** The AWS region the lambda is being called from, i.e. `us-west-2` */
  region: process.env["AWS_REGION"] ?? "us-east-1"
};