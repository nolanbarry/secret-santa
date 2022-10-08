/* Creates a new Player with the given display name, with the ID of the authorized user. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = ['authToken', 'gameCode', 'displayName']

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, gameCode, displayName } = validateRequestBody(event.body, requestParameters)

  // verify authtoken, retrieve user
  // verify someone with that display name isn't already in the game
  // return 200 OK with success: false and message: "Display name taken" if display name is taken
  // join game

  return response(200, { message: "Function not implemented." })
};

export default lambda(handler)