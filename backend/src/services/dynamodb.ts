import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Game, User, Player, Auth } from "../model/dao-interfaces";
import { HTTPError } from "../model/error";
import { getModeOfContact, ModeOfContact } from "../model/modeofcontact";
import constants from "../utils/constants";
import { generateRandomString, generateUserId } from "../utils/utils";

var AWS = require("aws-sdk");

const ddb = new DynamoDB({region: constants.region})
const documentClient = new AWS.DynamoDB.DocumentClient();
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

/**
 * Creates an auth table entry for a user and returns the OTP required to to get an authorization
 * token.
 * @param userId The id of the user. See `getUserIdByContactString`
 * @returns An OTP. OTPs are 6-digit numeric strings, i.e. `"123456"`.
 */
export async function login(userId: string) {
  let otp = generateRandomString("1234567890", constants.otpLength)
  // TODO: Impose a limit on the number of auth table entries a user
  // can have, replace the oldest one if the limit has been reached.
  await ddb.putItem({
    TableName: schema.auth.name,
    Item: marshall({
      [schema.auth.partitionKey]: userId,
      [schema.auth.schema.otp]: otp,
      [schema.auth.ttlKey]: Date.now() / 1000 + schema.auth.otpTTL
    })
  })
  return otp
}


/**
 * Retrieves (if possible) auth token from the auth table, then returns the associated user id. 
 * Returns null if the auth token doesn't exist. 
 * 
 * TODO: We should add/update some kind of lastUsed property in this function, 
 * but we can add that later if needs be.
 * 
 * @param authToken The authToken to authenticate.`
 * @returns The userID, a unique random string to identify the user. 
 */
 export async function authenticate(authToken: string) {
  
  let auth = await getAuth(authToken);
  return auth?.id
}

/**
 * Retrieves the players with a given userid and returns them. You’ll need to make a 
 * function that maps a dynamodb Item to a Player type of object (also needs to be created). 
 * see our database model for attribute names. add attribute names to constants.ts instead 
 * of using naked strings.
 * 
 * TODO: We should add/update some kind of lastUsed property in this function, 
 * but we can add that later if needs be.
 * 
 * @param userID The userID that belongs to the user we're retrieving players for.`
 * @returns An array of the players that are stored under a single user's id
 */
 export async function getPlayersForUser(userID: string) {
  
  try {
    const params = {
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
            ':id': userID
        },
        TableName: schema.players.name
    };
    const res = await documentClient.query(params).promise()
    let players = unmarshall(res?.Item) as Player[];
    return players;
  } catch (error) {
      console.error(error);
  }
}


//HELPER FUNCTIONS

//gets (single item)

export async function getGame(gameCode: string): Promise<Game | undefined> {

    const params = {
        Key: {
          "id": {"S": gameCode}, 
        }, 
        TableName: schema.games.name
    };
    const res = await ddb.getItem(params)
    return unmarshall(res.Item!) as Game;

}

export async function getUser(userID: string): Promise<User | undefined> {

    const params = {
        Key: {
          "code": {"S": userID}, 
        }, 
        TableName: schema.users.name
    };
    const res = await ddb.getItem(params)
    return unmarshall(res.Item!) as User;

}

export async function getPlayer(playerID: string): Promise<Player | undefined> {

    const params = {
        Key: {
          "id": {"S": playerID}, 
        }, 
        TableName: schema.players.name
    };
    const res = await ddb.getItem(params)
    return unmarshall(res.Item!) as Player;

}

export async function getAuth(authID: string): Promise<Auth | undefined> {

    const params = {
        Key: {
          "id": {"S": authID}, 
        }, 
        TableName: schema.auth.name
    };
    const res = await ddb.getItem(params)
    if (res) {
      return unmarshall(res.Item!) as Auth;
    }
    else return undefined;

}

//gets (batch)

export async function getPlayersForGame(gameCode: string): Promise<Player[] | undefined> {

    const params = {
        KeyConditionExpression: 'gameCode = :game-code',
        ExpressionAttributeValues: {
            ':game-code': gameCode
        },
        TableName: schema.players.name
    };
    const res = await documentClient.query(params)
    return unmarshall(res.Item!) as Player[];

}

//puts (single item)

export async function putGame(game : Game): Promise<void> { 
  
  await ddb.putItem({
    TableName: schema.games.name,
    Item: marshall({
      "code": game["code"],
      "display-name": game["display-name"],
      "host-name": game["host-name"]
    })
  })
}

export async function putUser(user : User): Promise<void> { 
  
  await ddb.putItem({
    TableName: schema.users.name,
    Item: marshall({
      "id": user["id"],
      "phone-number": user["phone-number"],
      "email":  user["email"]
    })
  })
  
}

export async function putPlayer(player : Player): Promise<void> { 

  await ddb.putItem({
    TableName: schema.users.name,
    Item: marshall({
      "id": player["id"],
      "display-name": player["display-name"],
      "game-code":  player["game-code"],
      "assigned-to": player["assigned-to"]
    })
  })
}


export async function putAuth(auth : Auth): Promise<void> { 
  await ddb.putItem({
    TableName: schema.users.name,
    Item: marshall({
      "id": auth["id"],
      "otp": auth["otp"],
      "auth-token":  auth["auth-token"]
    })
  })
  
}

// updates (single item) TODO: do we want to implement these? Or would using only "put" be simpler?
// put replaces an item while update only updates the fields


//delete (single item)

export async function deleteGame(gameCode: string): Promise<void> {

  const params = {
      Key: {
        "id": {"S": gameCode}, 
      }, 
      TableName: schema.games.name
  };
  await ddb.deleteItem(params)
  
}

export async function deleteUser(userID: string): Promise<void> {

  const params = {
      Key: {
        "code": {"S": userID}, 
      }, 
      TableName: schema.users.name
  };
  await ddb.deleteItem(params)

}

export async function deletePlayer(playerID: string): Promise<void> {

  const params = {
      Key: {
        "id": {"S": playerID}, 
      }, 
      TableName: schema.players.name
  };
  await ddb.deleteItem(params)

}

export async function deleteAuth(authID: string): Promise<void> {

  const params = {
      Key: {
        "id": {"S": authID}, 
      }, 
      TableName: schema.auth.name
  };
  await ddb.deleteItem(params)

}
