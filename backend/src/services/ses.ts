import { AWSError } from 'aws-sdk'
import { SendEmailRequest, SendEmailResponse, SESv2, SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { HTTPError } from "../model/error"
import { readFile } from "fs"
import path from "path"
import constants from "../utils/constants"

const client = new SESv2Client({ region: constants.region })

export async function sendMessage(message:string, subject:string, ...emails: string[]) { 
  console.log("Sending Email with message: " + message + " Subject: " + subject + " To: " + emails[0] + " (and possibly more)")

  const params: SendEmailRequest = {
    FromEmailAddress: constants.strings.sesSource,
    Destination: {
        ToAddresses: emails
    },
    Content:{
      Simple:{
        Subject:{
          Charset: constants.strings.emailCharset,
          Data: subject
        },
        Body:{
          Text:{
            Charset: constants.strings.emailCharset,
            Data: message
          }
        }
      }
    }

    
  }

  const command = new SendEmailCommand(params);

  const response = await client.send(command)

  console.log("Email sent with response: " + response.$metadata.httpStatusCode)
}

function getMessageHtml(message:string){
  //Should probably move this to a .html file and read it instead
  return "<p>" + message + "</p>"
}

