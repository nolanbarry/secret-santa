/* User submits phone number/email address. Server retrieves ID based on number, email, creates OTP, and texts/emails it to the user. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = ['contact']

async function handler(event: APIGatewayEvent, context: Context) {
  const { contact } = validateRequestBody(event.body, requestParameters)

  console.log(contact)

  return response(200, { message: "Function not implemented." })
};

export default lambda(handler)