/* Retrieves contact information for the logged in user. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = {
  authToken: String
}

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken } = validateRequestBody(event.body, requestParameters)

  // verify authtoken, retrieve user
  // return user

  return response(200, { message: "Function not implemented." })
};

export default lambda(handler)