/* Retrieves all Player objects linked to the authorized user. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { authenticate, getPlayersForUser } from '../services/dynamodb'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = {
  authToken: String
}

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken } = validateRequestBody(event.body, requestParameters)

  const userId = await authenticate(authToken)
  const players = await getPlayersForUser(userId)

  return response(200, { players })
};

export default lambda(handler)