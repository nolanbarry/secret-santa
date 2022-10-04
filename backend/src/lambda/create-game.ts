/* Creates a game, assigns the authorized user to it as the host, and returns the new game code. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import constants from '../utils/constants'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = ['authToken', 'displayName']

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, displayName } = validateRequestBody(event.body, requestParameters)

  // validate auth token, retrieve associated user
  // create game object in database with 0 players, host display name is given display name
  // call join game with display name and new game code
  // return game code

  return response(200, { message: "Function not implemented." })
};

export default lambda(handler)