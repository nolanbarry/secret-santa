/* Creates a game, assigns the authorized user to it as the host, and returns the new game code. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { authenticate, createGame } from '../services/dynamodb'
import { lambda, response, validateRequestBody } from '../utils/utils'
import constants from '../utils/constants'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

// const requestParameters = ['authToken', 'gameName', 'hostDisplayName', 'exchangeDate']
const requestParameters = {
  authToken: String,
  gameName: String,
  hostDisplayName: String,
  exchangeDate: Number
}

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, exchangeDate, gameName, hostDisplayName } = validateRequestBody(event.body, requestParameters)

  let userId = await authenticate(authToken)
  let gameCode = await createGame(gameName, exchangeDate, userId, hostDisplayName)

  return response(200, { gameCode })
};

export default lambda(handler)