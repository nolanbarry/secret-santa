/* Creates a game, assigns the authorized user to it as the host, and returns the new game code. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import constants from '../utils/constants'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = ['authToken']

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken } = validateRequestBody(event.body, requestParameters)

  console.log(authToken)

  return response(200, { message: "Function not implemented." })
};

export default lambda(handler)