import { SNS } from "@aws-sdk/client-sns"
import { HTTPError } from "../model/error"
import constants from "../utils/constants"

const client = new SNS({ region: constants.region })

export function sendMessage(message:string, ...phoneNumbers: string[]) {
  throw new HTTPError(500, "Sending SMS messages is not supported")
}