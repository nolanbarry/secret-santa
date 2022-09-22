/* Deletes a Game and all associated Player objects from the database, if the authorized user is the host. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = ['authToken', 'gameCode']

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, gameCode } = validateRequestBody(event.body, requestParameters)

  console.log(authToken, gameCode)

  return response(200, { message: "Function not implemented." })
};

export default lambda(handler)