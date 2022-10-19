/* Makes assignments and texts/emails to all players. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = {
  authToken: String,
  gameCode: String,
}

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, gameCode } = validateRequestBody(event.body, requestParameters)

  // verify authtoken, retrieve user
  // retrieve game by gameCode
  // retrieve host of game
  // verify host of game id == user.id
  // make assignments and text/email to everyone
  // update game status as started

  return response(200, { message: "Function not implemented." })
};

export default lambda(handler)