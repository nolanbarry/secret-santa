/* 
 * Users types in OTP and it is submitted to server. Server finds OTP in Security table, 
 * adds Auth Token to table entry, and returns it to user.
 */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = ['id', 'otp']

async function handler(event: APIGatewayEvent, context: Context) {
  const { id, otp } = validateRequestBody(event.body, requestParameters)

  console.log(id, otp)

  return response(200, { message: "Function not implemented." })
};

export default lambda(handler)