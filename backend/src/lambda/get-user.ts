/* Retrieves contact information for the logged in user. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { authenticate, getUser } from '../services/dynamodb'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = {
  authToken: String
}

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken } = validateRequestBody(event.body, requestParameters)

  const userId = await authenticate(authToken)
  const user = await getUser(userId)

  return response(200, { user })
};

export default lambda(handler)