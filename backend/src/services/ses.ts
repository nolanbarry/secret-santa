import { SES, AWSError } from 'aws-sdk'
import { SendEmailRequest, SendEmailResponse } from 'aws-sdk/clients/ses'
import { HTTPError } from "../model/error"
import { readFile } from "fs"
import path from "path"
import constants from "../utils/constants"

const client = new SES({ region: constants.region })

export function sendMessage(message:string, subject:string, ...emails: string[]) { //Might refactor this to just be the "sendEmail() function"?
  console.log("Sending Email with message: " + message + " Subject: " + subject + " To: " + emails[0] + " (and possibly more)")
  // sendEmail({
  //   emails: emails,
  //   body: getMessageHtml(message),
  //   subject: subject, 
  //   source: constants.sesSource
  // })

  const params: SendEmailRequest = {
    Source: constants.strings.sesSource,
    Destination: {
        ToAddresses: emails
    },
    Message: {
        Subject: {
            Data: subject,
            Charset: constants.strings.emailCharset
        },
        Body: {
            Text: {
                Data: message,
                Charset: constants.strings.emailCharset
            },
            // Html: {
            //     Data: getMessageHtml(message),
            //     Charset: constants.strings.emailCharset
            // }
        }
    }
  }
  
  client.sendEmail(params, (err: AWSError, data: SendEmailResponse) => {
    console.log("Email sent, response data:" + data)
  if (err) console.log(err, err.stack);
    else console.log(data);
  });

}

function getMessageHtml(message:string){
  //Should probably move this to a .html file and read it instead
  return "<p>" + message + "</p>"
}

