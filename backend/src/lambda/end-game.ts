/* Deletes a Game and all associated Player objects from the database, if the authorized user is the host. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { HTTPError } from '../model/error'
import { authenticate, endGame, getGame, getPlayer, getPlayersInGame, getUser } from '../services/dynamodb'
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
  const [user, game] = await Promise.all([getUser(userId), getGame(gameCode)])
  if (!user) throw new HTTPError(500, constants.strings.authorizedUserDne)
  if (!game) throw new HTTPError(400, constants.strings.gameDne(gameCode))

  const gameHost = await getPlayer(gameCode, game.hostName)
  // if the game host doesn't exist, anyone can delete the game because the data is corrupted
  if (gameHost && gameHost.id != userId) throw new HTTPError(401, constants.strings.userIsNotHost)  

  await endGame(gameCode)

  return response(200, { success: true })
};

export default lambda(handler)