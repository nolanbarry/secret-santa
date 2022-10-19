/* Creates a new Player with the given display name, with the ID of the authorized user. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { ExpectedError, HTTPError } from '../model/error'
import { authenticate, displayNameTaken, getGame, putPlayer } from '../services/dynamodb'
import constants from '../utils/constants'
import { displayNameIsValid, lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = {
  authToken: String,
  gameCode: String,
  displayName: String
}

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, gameCode, displayName } = validateRequestBody(event.body, requestParameters)

  const userId = await authenticate(authToken)

  // validate game exists, display name is valid, and display name isn't taken
  if (!await getGame(gameCode))
    throw new HTTPError(400, `Game ${gameCode} doesn't exist`)

  if (!displayNameIsValid(displayName))
    throw new ExpectedError(constants.strings.displayNameInvalid)

  if (await displayNameTaken(gameCode, displayName))
    throw new ExpectedError(constants.strings.displayNameTaken)

  await putPlayer({
    displayName: displayName,
    id: userId,
    gameCode: gameCode
  })

  return response(200, { success: true })
};

export default lambda(handler)