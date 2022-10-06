import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { HTTPError } from "../model/error";
import { getModeOfContact, ModeOfContact } from "../model/modeofcontact";
import constants from "../utils/constants";
import { generateRandomString, generateUserId } from "../utils/utils";

const ddb = new DynamoDB({region: constants.region})
const schema = constants.tables

/**
 * Retrieve a user id from the database by phone number/email. If no user exists with 
 * that contact string, create one, and return the new id.
 * Users should be created with this method *and no other*. This will guarentee that 
 * no two users ever have the same contract string.
 * @param contactString A phone number or email. Phone numbers should be formatted in 
 * E.164 format. If this string is not a valid email or phone number, an `HTTPError`
 * will be thrown.
 */
export async function getUserIdByContactString(contactString: string) {
  let modeOfContact = getModeOfContact(contactString)
  if (modeOfContact == ModeOfContact.Invalid) {
    throw new HTTPError(400, `"${contactString}" isn't a valid phone number or email.`)
  }
  const usersTable = schema.users
  const index = modeOfContact == ModeOfContact.Email ? usersTable.indexes.byEmail : usersTable.indexes.byPhoneNumber
  // indexes are only queryable, but there should only ever be one item in the index with 
  // this contact string.
  let query = await ddb.query({
    TableName: usersTable.name,
    IndexName: index.name,
    KeyConditionExpression: '#key=:value',
    ExpressionAttributeNames: {
      '#key': index.partitionKey
    },
    ExpressionAttributeValues: {
      ':value': {S: contactString}
    }
  })
  let id: string;
  if (!!query.Items && query.Items.length > 0) {
    id = unmarshall(query.Items[0])[usersTable.partitionKey]
  } else {
    // no user exists with this contact string, create one
    id = generateUserId()
    await ddb.putItem({
      TableName: usersTable.name,
      Item: marshall({
        [usersTable.partitionKey]: id,
        [index.partitionKey]: contactString
      })
    })
  }
  return id
}

export async function login(userId: string) {
  let otp = generateRandomString("1234567890", constants.otpLength)
  await ddb.putItem({
    TableName: schema.auth.name,
    Item: marshall({
      [schema.auth.partitionKey]: userId,
      [schema.auth.schema.otp]: otp,
      [schema.auth.ttlKey]: Date.now() / 1000 + schema.auth.ttlLength
    })
  })
  return otp
}