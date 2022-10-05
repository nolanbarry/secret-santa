import { SES } from "@aws-sdk/client-ses"
import { HTTPError } from "../model/error"
import constants from "../utils/constants"

const client = new SES({ region: constants.region })

export function sendMessage(message:string, ...emails: string[]) {
  throw new HTTPError(500, "Sending email messages is not supported")
}