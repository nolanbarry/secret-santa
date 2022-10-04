/* Deletes a Game and all associated Player objects from the database, if the authorized user is the host. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = ['authToken', 'gameCode']

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, gameCode } = validateRequestBody(event.body, requestParameters)

  // verify authtoken, retrieve user
  // retrieve game
  // retrieve player that is the host
  // verify that player's user id and is the same as retrieved user's id
  // if not, return not authorized
  // if good, delete game and all associated player objects

  return response(200, { message: "Function not implemented." })
};

export default lambda(handler)