/* Retrieves information about a game, if the authorized user has a player that is in the game. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { HTTPError } from '../model/error'
import { authenticate, getGame, getPlayersInGame } from '../services/dynamodb'
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

  const game = await getGame(gameCode)
  if (!game)
    throw new HTTPError(400, constants.strings.gameDne(gameCode))
  
  const gamePlayers = await getPlayersInGame(gameCode)
  // check if at least one of the game players belongs to this user
  if (!gamePlayers.some(player => player.id == userId))
    throw new HTTPError(400, constants.strings.noAccessToGame)

  return response(200, { game })
};

export default lambda(handler)