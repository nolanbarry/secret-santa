/* Retrieves information about a specific Player object linked to the authorized user. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { HTTPError } from '../model/error'
import { authenticate, getPlayer, getPlayersForUser } from '../services/dynamodb'
import constants from '../utils/constants'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = {
  authToken: String,
  gameCode: String,
  displayName: String
}

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, gameCode, displayName } = validateRequestBody(event.body, requestParameters)

  const userId = await authenticate(authToken)
  const requestedPlayer = await getPlayer(gameCode, displayName)

  if (!requestedPlayer)
    throw new HTTPError(400, constants.strings.playerDne(gameCode, displayName))

  const usersPlayers = await getPlayersForUser(userId)
  if (!usersPlayers.some(player => player.gameCode == requestedPlayer.gameCode))
    throw new HTTPError(400, constants.strings.noAccessToPlayer)

  return response(200, { player: requestedPlayer })
};

export default lambda(handler)