/* 
 * Users types in OTP and it is submitted to server. Server finds OTP in Security table, 
 * adds Auth Token to table entry, and returns it to user.
 */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'
import { verifyOtp } from '../services/dynamodb'
import { ExpectedError } from '../model/error'
import constants from '../utils/constants'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = {
  id: String,
  otp: String
}

async function handler(event: APIGatewayEvent, context: Context) {
  const { id, otp } = validateRequestBody(event.body, requestParameters)

  const authToken = await verifyOtp(id, otp)
  if (authToken == null) 
    throw new ExpectedError(constants.strings.otpDne)
  
  return response(200, { success: true, authToken })
};

export default lambda(handler)