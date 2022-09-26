/* This is a template to use when writing a new Lambda Function */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'

/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = ['string1', 'number2']

async function handler(event: APIGatewayEvent, context: Context) {
  const { string1, number2 } = validateRequestBody(event.body, requestParameters)

  console.log(string1, number2)
  console.log(context.functionName)

  return response(200, { message: "Hello world!" })
};

export default lambda(handler)