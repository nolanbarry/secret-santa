import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch';
import { HTTPError } from '../model/error'
import { constants } from './constants'


/**
 * Formats an `APIGatewayProxyResult` object to be returned from an asynchronous Lambda handler.
 * Typically used in a return statement: 
 * ```
 * return response(200, { message });
 * ```
 * @param statusCode The HTTP status code, i.e. 200, 404, etc.
 * @param body The response body, as an object
 * @returns An `APIGatewayProxyResult` that can be immediately returned from a Lambda.
 */
export function response(statusCode: number, body?: {}): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify(body ?? {}),
    headers: constants.corsHeaders
  }
}


/**
 * Creates a Lambda response object based on the error that occurred. All errors
 * raised during a handlers runtime should be handled and put through this function
 * to make error handling and responses consistent.
 * @param error The error received from a `catch` block
 */
export function errorHandling(error: Error): APIGatewayProxyResult {
  if (error instanceof HTTPError) {
    return response(error.statusCode, error.body);
  } else {
    console.error('Error: ', error);
    return response(500, "Internal Server Error");
  }
}


/** 
 * Defines the structure of an AWS Lambda handler function. The arguments are passed by Lambda
 * when it is called from the console or by API Gateway. The result should be generated
 * by the `response()` function in this module.
*/
export type Handler = (event: APIGatewayEvent, context: Context) => Promise<APIGatewayProxyResult>


/**
 * A decorator function to automatically add error handling to a Lambda function. Pass
 * your handler as the argument, and `export default` the result:
 * ```
 * async function handler(event: APIGatewayEvent, context: Context) { ... }
 * export default lambda(handler)
 * ```
 * @param handler Your lambda handler
 * @returns The same handler wrapped in a try/catch block, returned in an object that should be set as the module's export.
 */
export function lambda(handler: Handler): {handler: Handler} {
  const wrapper = async function(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
      return await handler(event, context)
    } catch (error: any) {
      return errorHandling(error)
    }
  }
  return { handler: wrapper }
}


/**
 * Validates that the body received in a handler contains everything we expect it to have.
 * If not, an HTTPError is thrown.
 * @param body The request body, straight from `event.body`
 * @param requiredProperties The name of the parameters expected to be in `body`
 * @returns `body`, parsed into an object.
 */
export function validateRequestBody(body: string | null, requiredProperties: string[]): {[key: string]: any} {
  if (!body) throw new HTTPError(400, "Request body is required");
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch (error) {
    throw new HTTPError(400, "Body wasn't a valid JS object")
  }
  for (let property of requiredProperties) {
    if (!(property in parsed))
      throw new HTTPError(400, `Missing required parameter "${property}"`)
  }
  return parsed
}


/**
 * Condenses down the process of awaiting a fetch and JSON body into a single promise.
 * Raises an HTTPError if the request fails.
 * @param args A RequestInfo and RequestInit object; the same arguments passed to `fetch`.
 * @returns A response body
 */
 export async function fetchJson(...args: [RequestInfo, RequestInit]): Promise<any> {
  const response: Response = await fetch(...args);
  if (!response.ok) {
    console.error(response)
    throw new HTTPError(500, `Request failed: ${response.statusText}`);
  }
  const body: any = await response.json();
  return body;
}
