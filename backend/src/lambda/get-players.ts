/* Retrieves all Player objects linked to the authorized user. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = {
  authToken: String
}

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken } = validateRequestBody(event.body, requestParameters)

  // verify auth token, retrieve user
  // query for and return player objects with id = user.id

  return response(200, { message: "Function not implemented." })
};

export default lambda(handler)