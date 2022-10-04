/* Retrieves information about a specific Player object linked to the authorized user. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = ['authToken', 'gameCode', 'displayName']

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, gameCode, displayName } = validateRequestBody(event.body, requestParameters)

  // verify authtoken and retrieve user
  // retrieve player
  // verify player.id is user.id
  // return player if user has authorization
  // otherwise return not authorized

  return response(200, { message: "Hello world!" })
};

export default lambda(handler)