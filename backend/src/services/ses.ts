import { SES } from "@aws-sdk/client-ses"
import { HTTPError } from "../model/error"
import { readFile } from "fs"
import path from "path"
import constants from "../utils/constants"

const client = new SES({ region: constants.region })

export function sendMessage(message:string, ...emails: string[]) { //Might refactor this to just be the "sendEmail() function"?
  sendEmail({
    emails: emails,
    body: getMessageHtml(message),
    subject: "Message From Secret Santa", //This needs to change based on what kind of message we're sending
    source: constants.sesSource
  })
}

function getMessageHtml(message:string){
  //Should probably move this to a .html file and read it instead
  return "<p>" + message + "</p>"
}

interface SendEmailParameters{
  emails: string[]
  body: string
  subject: string
  source: string
}

const sendEmail = ({
  emails,
  body,
  subject,
  source
} : SendEmailParameters) =>
  client.sendEmail({
    Destination: {
      ToAddresses: emails,
    },
    Message: {
      Body: {
        Html: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: source
  })