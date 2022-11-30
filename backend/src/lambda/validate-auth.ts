/* 
 * Checks authtoken and makes sure the user is authorized.
 */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'
import { authenticate } from '../services/dynamodb'
import { ExpectedError } from '../model/error'
import constants from '../utils/constants'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = {
  auth: String
}

async function handler(event: APIGatewayEvent, context: Context) {
  const { auth } = validateRequestBody(event.body, requestParameters)

  const userid = await authenticate(auth)
  if (!userid) 
    throw new ExpectedError(constants.strings.unauthorized)
  
  return response(200, { success: true, auth })
};

export default lambda(handler)