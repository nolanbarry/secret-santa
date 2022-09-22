/* Retrieves information about a game, if the authorized user has a player that is in the game. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = ['authToken', 'gameCode']

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, gameCode } = validateRequestBody(event.body, requestParameters)

  console.log(authToken, gameCode)

  return response(200, { message: "Function not implemented." })
};

export default lambda(handler)