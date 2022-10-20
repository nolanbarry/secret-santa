/* Retrieves all Player objects that are in the given game. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { HTTPError } from '../model/error'
import { authenticate, getPlayersForUser, getPlayersInGame } from '../services/dynamodb'
import constants from '../utils/constants'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = {
  authToken: String,
  gameCode: String
}

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, gameCode } = validateRequestBody(event.body, requestParameters)

  const userId = await authenticate(authToken)

  const userPlayers = await getPlayersForUser(userId)

  // user must have at least one player that is participating in a game to get its players
  if (!userPlayers.some(player => player.gameCode == gameCode))
    throw new HTTPError(400, constants.strings.noAccessToGame)
  
  const players = await getPlayersInGame(gameCode)

  return response(200, { players })
};

export default lambda(handler)