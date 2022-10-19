import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { randomInt, randomUUID } from 'crypto';
import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch';
import { HTTPError } from '../model/error'
import constants from './constants'


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
    return response(500, { message: "Internal Server Error" });
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
 * @returns The same handler wrapped in a try/catch block
 */
export function lambda(handler: Handler): Handler {
  const wrapper = async function (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
      return await handler(event, context)
    } catch (error: any) {
      return errorHandling(error)
    }
  }
  return wrapper
}

/* Typing for validateRequestBody */
type RequestTypes = typeof Boolean | typeof Number | typeof String
export type PropertyDefinition = {
  [name: string]: RequestTypes
}
export type TypeOfMap<type extends RequestTypes> = type extends typeof Boolean ? boolean : (type extends typeof Number ? number : string)
export type RequestBody<Definition extends PropertyDefinition> = {
  [Property in keyof Definition]: TypeOfMap<Definition[Property]>
}
/**
 * Validates that the body received in a handler contains everything we expect it to have.
 * If not, an HTTPError is thrown. Otherwise returns a (typed) object based on the based
 * requiredProperties.
 * @param body The request body, straight from `event.body`
 * @param requiredProperties The name of the parameters expected to be in `body`, mapped to their types. Valid types are `String`, `Boolean`, and `Number`.
 * @returns `body`, parsed into an object.
 */
export function validateRequestBody<T extends PropertyDefinition>(body: string | null, requiredProperties: T): RequestBody<T>  {
  if (!body) throw new HTTPError(400, "Request body is required");
  let parsed;

  try {
    parsed = JSON.parse(body);
  } catch (error) {
    throw new HTTPError(400, "Body wasn't a valid JS object")
  }

  const typeMap: any = {
    'boolean': Boolean,
    'string': String,
    'number': Number
  }

  for (let [property, expectedType] of Object.entries(requiredProperties)) {
    // assert that property exists in request body 
    if (!(property in parsed))
      throw new HTTPError(400, `Missing required parameter "${property}"`)
    // assert that value is the correct type
    if (typeMap[typeof parsed[property]] != expectedType)
      throw new HTTPError(400, `Parameter ${property} should be of type ${expectedType}, got ${typeof parsed[property]}`)
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

/**
 * Generate a random of string of length `length` with characters randomly selected from
 * `validCharacters`.
 * @param validCharacters A string containing characters that can be in the random string, 
 * i.e. "ABCDEFGHIJKLMNOPQRSTUVWXYZ" for a random string containing only uppercase letters.
 * @param length The length of the returned string
 */
export function generateRandomString(validCharacters: string, length: number): string {
  let randomString = ""
  for (let i = 0; i < length; i++) {
    randomString += validCharacters[randomInt(0, validCharacters.length)]
  }
  return randomString
}

/**
 * Generates a random user id.
 * @returns A new user id.
 */
export function generateUserId(): string {
  return randomUUID()
}

/** Capitalizes the first letter of a string. */
export function capitalize(word: string) {
  return word[0].toUpperCase() + word.slice(1)
}

/** Convert kebab-case string to camelCase. */
export function kebabToCamel(kebab: string) {
  const tokens = kebab.split('-')
  return tokens[0]+tokens.slice(1).map(word => capitalize(word)).join('')
}

/** Convert camelCase string to kebab-case. */
export function camelToKebab(camel: string) {
  const isUppercase = (letter: string) => letter == letter.toUpperCase()
  let tokens = [camel[0]]
  for (let letter of camel.slice(1)) {
    if (isUppercase(letter))
      tokens.push("")
    tokens[tokens.length - 1] += letter
  }
  return tokens.map(word => word.toLowerCase()).join('-')
}

