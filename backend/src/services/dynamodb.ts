import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { GameEntry, UserEntry, PlayerEntry, AuthEntry, fromEntry, GameModel, UserModel, PlayerModel, AuthModel, toEntry, DatabaseModel, DatabaseEntry } from "../model/database-model";
import { HTTPError } from "../model/error";
import { getModeOfContact, ModeOfContact } from "../model/modeofcontact";
import constants from "../utils/constants";
import { generateRandomString, generateUserId, kebabToCamel } from "../utils/utils";

const ddb = new DynamoDB({ region: constants.region })
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
      ':value': { S: contactString }
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
  let expirationDate = Date.now() / 1000 + schema.auth.otpTTL
  // TODO: Impose a limit on the number of auth table entries a user
  // can have, replace the oldest one if the limit has been reached.
  await ddb.putItem({
    TableName: schema.auth.name,
    Item: marshall({
      [schema.auth.partitionKey]: userId,
      [schema.auth.schema.otp]: otp,
      [schema.auth.ttlKey]: expirationDate.toString()
    })
  })
  return otp
}


/**
 * Retrieves (if possible) auth token from the auth table, then returns the associated user id. 
 * Returns null if the auth token doesn't exist. 
 * @param authToken The authToken to authenticate.
 * @returns The userId, a unique random string to identify the user. 
 */
export async function authenticate(authToken: string) {
  let auth = await getAuthByAuthToken(authToken);
  if (!auth) return null

  // update expiration date of auth token
  let newExpirationDate = Date.now() / 1000 + schema.auth.authTokenTTL
  ddb.updateItem({
    TableName: schema.auth.name,
    Key: marshall({
      [schema.auth.partitionKey]: auth[kebabToCamel(schema.auth.partitionKey) as keyof AuthModel]!,
      [schema.auth.sortKey]: auth[kebabToCamel(schema.auth.sortKey) as keyof AuthModel]!
    }),
    UpdateExpression: "#ttl = :new-expiration",
    ExpressionAttributeNames: { '#ttl': schema.auth.ttlKey },
    ExpressionAttributeValues: marshall({ ':new-expiration': newExpirationDate.toString() })
  })
  return auth.id
}

/**
 * Retrieves and returns the players associated with a specific user.
 * @param userId The id fo the user to retrieve players of.
 * @returns An array of the `Player` objects
 */
export async function getPlayers(userId: string) {
  const response = await ddb.query({
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': schema.players.schema.id
    },
    ExpressionAttributeValues: marshall({
      ':id': userId
    }),
    TableName: schema.players.name
  })
  let players = response.Items?.map(item => unmarshall(item) as PlayerEntry);

  return players ?? [];
}

/* HELPER FUNCTIONS */

/* GETTERS */

type TableSchema = {
  name: string
  partitionKey: string
  sortKey?: string
}

/**
 * Retrieves an item from given table.
 * @param tableSchema A table schema object containing the table name, partition key, and sort key.
 * @param partitionKeyValue The value of the partition key of the item being retrieved.
 * @param sortKeyValue The value of the sort key, optional.
 * @returns A promise for the table entry, if it exists, or null.
 */
async function getter<TableEntryType extends DatabaseModel>(tableSchema: TableSchema, partitionKeyValue: string, sortKeyValue?: string): Promise<TableEntryType | null> {
  const response = await ddb.getItem({
    TableName: tableSchema.name,
    Key: marshall({
      [tableSchema.partitionKey]: partitionKeyValue,
      ...(sortKeyValue && { [tableSchema.sortKey!]: sortKeyValue }) // only add the sort key if it is given
    })
  })

  return response.Item ? fromEntry(unmarshall(response.Item!) as any) as TableEntryType : null
}

/**
 * Retrieve the item from the table by its partition/sort key in an index.
 * @param tableName The name of the table to retrieve from.
 * @param indexSchema The schema of the index, including its name, partition key name, and sort key name.
 * @param partitionKeyValue The value of the partition key.
 * @param sortKeyValue The value of sort key, optional.
 * @returns A promise for the table entry, if it exists, or null.
 */
async function indexGetter<TableEntryType extends DatabaseModel>(tableName: string, indexSchema: TableSchema, partitionKeyValue: string, sortKeyValue?: string): Promise<TableEntryType | null> {
  const response = await ddb.query({
    TableName: tableName,
    IndexName: indexSchema.name,
    KeyConditionExpression: "#key = :value" + (sortKeyValue ? " AND #sortKey = :sortValue" : ""),
    ExpressionAttributeNames: {
      '#key': indexSchema.partitionKey,
      ...(sortKeyValue && { '#sortKey': indexSchema.sortKey })
    },
    ExpressionAttributeValues: marshall({
      ':value': partitionKeyValue,
      ...(sortKeyValue && { ':sortValue': sortKeyValue })
    })
  })
  return response.Items?.length ? fromEntry(unmarshall(response.Items![0]) as any) as TableEntryType : null
}

/** Retrieve a game by its gameCode. Returns `null` if no game exists with that game code. */
const getGame = (gameCode: string) => getter<GameModel>(schema.games, gameCode)

/** Retrieve a user by their id. Returns `null` if no user exists with that id. */
const getUser = (userId: string) => getter<UserModel>(schema.users, userId)
/** Retrieve a user by their id. Returns `null` if no user exists with that id. */
const getUserByPhoneNumber = (phoneNumber: string) => indexGetter<UserModel>(schema.users.name, schema.users.indexes.byPhoneNumber, phoneNumber)
/** Retrieve a user by their id. Returns `null` if no user exists with that id. */
const getUserByEmail = (email: string) => indexGetter<UserModel>(schema.users.name, schema.users.indexes.byEmail, email)

/** Retrieves a player by game code and display name. Returns `null` if the player does not exist in the game */
const getPlayer = (gameCode: string, displayName: string) => getter<PlayerModel>(schema.players, gameCode, displayName)

/** Retrieves an auth table entry by user id and OTP. Returns `null` if OTP isn't valid for given player. */
const getAuth = (userId: string, otp: string) => getter<AuthModel>(schema.auth, userId, otp)
/** Retrieves an auth table entry by auth token. Returns `null` if the auth token isn't valid. */
const getAuthByAuthToken = (authToken: string) => indexGetter<AuthModel>(schema.auth.name, schema.auth.indexes.byAuthToken, authToken)

/* SETTERS */

/**
 * Puts a table record into the given table
 * @param tableSchema The schema of the table. This function only uses the name.
 * @param entry The table entry, which will be marshalled automatically.
 */
async function putter<TableEntryType extends DatabaseModel>(tableSchema: TableSchema, entry: TableEntryType): Promise<void> {
  await ddb.putItem({
    TableName: tableSchema.name,
    Item: marshall(toEntry(entry as any))
  })
}

/** Puts a game entry into the Games table */
const putGame = (game: GameModel) => putter(schema.games, game)
/** Puts a user entry into the Users table */
const putUser = (user: UserModel) => putter(schema.users, user)
/** Puts a player entry into the Players table */
const putPlayer = (player: PlayerModel) => putter(schema.players, player)
/** Puts an auth entry into the Auth table */
const putAuth = (auth: AuthModel) => putter(schema.auth, auth)


/* DELETERS */

async function deleter(tableSchema: TableSchema, partitionKeyValue: string, sortKeyValue?: string): Promise<void> {
  await ddb.deleteItem({
    TableName: tableSchema.name,
    Key: marshall({
      [tableSchema.partitionKey]: partitionKeyValue,
      ...(sortKeyValue && { [tableSchema.sortKey!]: sortKeyValue })
    })
  })
}

/** Removes a game from the Games table */
const deleteGame = (gameCode: string) => deleter(schema.games, gameCode)
/** Removes a user from the Users table */
const deleteUser = (userId: string) => deleter(schema.users, userId)
/** Removes a player from the Players table */
const deletePlayer = (gameCode: string, displayName: string) => deleter(schema.players, gameCode, displayName)
/** Removes an auth entry from the auth table */
const deleteAuth = (userId: string, otp: string) => deleter(schema.auth, userId, otp)
