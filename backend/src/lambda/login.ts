/* User submits phone number/email address. Server retrieves ID based on number, email, creates OTP, and texts/emails it to the user. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'

import {getUserIdByContactString, login } from '../services/dynamodb'
import { sendMessage } from '../services/ses'


/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = {
  contactString: String
}

async function handler(event: APIGatewayEvent, context: Context) {
  const { contactString } = validateRequestBody(event.body, requestParameters)

  // search for contact in users table
  // if contact doesn't exist, create an entry
  const userId = await getUserIdByContactString(contactString)

  // create auth table entry with new otp and user id
  const otp = await login(userId)

  // text/email otp to user 
  //TODO: allow for email or text based on mode of contact.
  // Currently this will always try to send an email to the contactString, even if it is a phone number
  //TODO: return a success/failure from sendMessage and forward to response code
  await sendMessage(otp, "Secret Santa One Time Password", contactString)

  // return 200 OK {success: true}
  return response(200, { userId })
};

export default lambda(handler)