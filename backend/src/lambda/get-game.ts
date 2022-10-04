/* Retrieves information about a game, if the authorized user has a player that is in the game. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = ['authToken', 'gameCode']

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, gameCode } = validateRequestBody(event.body, requestParameters)

  // verify authtoken and retrieve user
  // retrieve game
  // retrieve user's players that have have game code matching game
  // return game if user has 1+ players in the game

  return response(200, { message: "Function not implemented." })
};

export default lambda(handler)