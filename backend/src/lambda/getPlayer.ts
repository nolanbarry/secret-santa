/* Retrieves information about a specific Player object linked to the authorized user. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = ['authToken', 'gameCode', 'displayName']

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, gameCode, displayName } = validateRequestBody(event.body, requestParameters)

  console.log(authToken, gameCode, displayName)

  return response(200, { message: "Hello world!" })
};

export default lambda(handler)