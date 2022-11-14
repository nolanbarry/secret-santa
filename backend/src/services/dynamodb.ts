import { AttributeValue, DynamoDB, QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { GameEntry, UserEntry, PlayerEntry, AuthEntry, entryToModel, GameModel, UserModel, PlayerModel, AuthModel, modelToEntry, DatabaseModel, DatabaseEntry } from "../model/database-model";
import { ExpectedError, HTTPError } from "../model/error";
import { getModeOfContact, ModeOfContact } from "../model/mode-of-contact";
import constants from "../utils/constants";
import { generateRandomString, generateUserId } from "../utils/utils";

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
  const retrieveUser = (modeOfContact == ModeOfContact.Email) ? getUserByEmail : getUserByPhoneNumber
  const user = await retrieveUser(contactString)

  // return id if it already exists
  if (user) return user.id

  // otherwise create the user and return their new id
  const id = generateUserId()
  const contactStringKey = (
    modeOfContact == ModeOfContact.Email ?
      schema.users.indexes.byEmail :
      schema.users.indexes.byPhoneNumber
  ).partitionKey
  await putUser({
    id,
    [contactStringKey]: contactString
  })
  return id
}

/**
 * Creates an auth table entry for a user and returns the OTP required to to get an authorization
 * token.
 * @param userId The id of the user. See `getUserIdByContactString`
 * @returns An OTP. OTPs are 6-digit numeric strings, i.e. `"123456"`.
 */
export async function login(userId: string) {
  let otp = generateRandomString(constants.rules.otp.validCharacters, constants.rules.otp.length)
  let expirationDate = Date.now() / 1000 + schema.auth.otpTTL

  // TODO: Impose a limit on the number of auth table entries a user
  // can have, replace the oldest one if the limit has been reached.
  await putAuth({
    id: userId,
    otp: otp,
    expirationDate: expirationDate
  })
  return otp
}

/**
 * Finds the pending OTP entry in the Auth table, then generates and returns an auth token, updating
 * the entry to include the auth token.
 * @param userId The id of the user submitting the OTP.
 * @param otp The OTP, a 6 character string of numbers sent to the user.
 * @returns The authorization token, a string of 24 random characters.
 */
export async function verifyOtp(userId: string, otp: string): Promise<string | null> {
  let auth = await getAuth(userId, otp)
  if (!auth || auth.authToken) return null
  const authToken = generateRandomString(constants.rules.authToken.validCharacters, constants.rules.authToken.length)
  await setAuthToken(auth, authToken)
  return authToken
}


/**
 * Retrieves (if possible) auth token from the auth table, then returns the associated user id. 
 * Throws an `ExpectedError` if the token doesn't exist. 
 * @param authToken The authToken to authenticate.
 * @returns The userId, a unique random string to identify the user. 
 */
export async function authenticate(authToken: string): Promise<string> {
  let auth = await getAuthByAuthToken(authToken);
  if (!auth) throw new ExpectedError(constants.strings.authTokenDne)

  // update expiration date of auth token
  await extendExpirationDate(auth, schema.auth.authTokenTTL)
  return auth.id!
}

/**
 * Retrieves and returns the players associated with a specific user.
 * @param userId The id of the user to retrieve the players of.
 * @returns An array of the `Player` objects
 */
export async function getPlayersForUser(userId: string): Promise<PlayerModel[]> {
  // TODO: Instead of a raw query, this should be querying on an index that partitions by user id.
  const response = await ddb.query({
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': schema.players.schema.id
    },
    ExpressionAttributeValues: marshall({
      ':id': userId
    }),
    TableName: schema.players.name,
  })
  return mapQueryResult(response)
}

/**
 * Retrieves a list of players that are in a game.
 * @param gameCode The code of the game. Case sensitive.
 * @returns A list of PlayerModel objects.
 */
export async function getPlayersInGame(gameCode: string): Promise<PlayerModel[]> {
  const response = await ddb.query({
    TableName: schema.players.name,
    KeyConditionExpression: '#gameCode = :gameCode',
    ExpressionAttributeNames: {
      '#gameCode': schema.players.schema.gameCode
    },
    ExpressionAttributeValues: marshall({
      ':gameCode': gameCode
    })
  })
  return mapQueryResult(response)
}

/**
 * Checks to see if a player with the given display name already exists in the game. Case-insensitive.
 * For a case-sensitive version, use `getPlayer`.
 * @param gameCode The game to check in
 * @param displayName The display name to check for
 * @returns True if a player already exists with that display name.
 */
export async function displayNameTaken(gameCode: string, displayName: string): Promise<boolean> {
  const players = await getPlayersInGame(gameCode)
  return players.some(player => player.displayName.toLowerCase() == displayName.toLowerCase())
}

/**
 * Creates a Game with the given display name, then creates a Player object for the host. Returns the game
 * code.
 * @param gameName The display name of the game. Does not need to be unique.
 * @param hostId The id of the user creating the game
 * @param hostDisplayName The display name the host has chosen
 * @returns The game code, a 7 letter uppercase string.
 */
export async function createGame(gameName: string, exchangeDate: number, hostId: string, hostDisplayName: string): Promise<string> {
  // generate a game code, making sure that no game already exists with that code
  // if no unique game code can be generated after 15 attempts, abort
  const maxAttempts = 15
  let attempts = 0, gameCode = ""
  do {
    gameCode = generateRandomString(constants.rules.gameCode.validCharacters, constants.rules.gameCode.length)
    attempts++
  } while (await getGame(gameCode) && attempts < maxAttempts);

  if (attempts == maxAttempts)
    throw new HTTPError(500, constants.strings.gameGenerationFailed)

  // TODO: Impose limits on number of games that a person can host?

  await Promise.all([
    putGame({
      code: gameCode,
      displayName: gameName,
      hostName: hostDisplayName,
      started: false,
      exchangeDate: exchangeDate
    }),
    putPlayer({
      gameCode: gameCode,
      displayName: hostDisplayName,
      id: hostId
    })
  ])

  return gameCode
}

/**
 * Cleans up all the data related to a game by deleting the `Game` and
 * all associated `Player` objects from the database.
 * @param gameCode The code of the game
 */
export async function endGame(gameCode: string) {
  const players = await getPlayersInGame(gameCode)

  // initate all requests BEFORE awaiting any so that an attempt will be made to delete everything
  // regardless of an error returned by any deletion
  const deleteGamePromise = deleteGame(gameCode) 
  const deletePlayerPromises = players.map(player => deletePlayer(gameCode, player.displayName))

  for (let promise of [deleteGamePromise, ...deletePlayerPromises])
    await promise
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

  return response.Item ? entryToModel(unmarshall(response.Item!) as any) as TableEntryType : null
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
  return getFirstQueryResult<TableEntryType>(response)
}

/** Retrieve a game by its gameCode. Returns `null` if no game exists with that game code. */
export const getGame = (gameCode: string) => getter<GameModel>(schema.games, gameCode)

/** Retrieve a user by their id. Returns `null` if no user exists with that id. */
export const getUser = (userId: string) => getter<UserModel>(schema.users, userId)
/** Retrieve a user by their id. Returns `null` if no user exists with that id. */
const getUserByPhoneNumber = (phoneNumber: string) => indexGetter<UserModel>(schema.users.name, schema.users.indexes.byPhoneNumber, phoneNumber)
/** Retrieve a user by their id. Returns `null` if no user exists with that id. */
const getUserByEmail = (email: string) => indexGetter<UserModel>(schema.users.name, schema.users.indexes.byEmail, email)

/** Retrieves a player by game code and display name. Returns `null` if the player does not exist in the game */
export const getPlayer = (gameCode: string, displayName: string) => getter<PlayerModel>(schema.players, gameCode, displayName)

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
    Item: marshall(modelToEntry(entry as any))
  })
}

/** Puts a game entry into the Games table */
const putGame = (game: GameModel) => putter(schema.games, game)
/** Puts a user entry into the Users table */
const putUser = (user: UserModel) => putter(schema.users, user)
/** Puts a player entry into the Players table */
export const putPlayer = (player: PlayerModel) => putter(schema.players, player)
/** Puts an auth entry into the Auth table */
const putAuth = (auth: AuthModel) => putter(schema.auth, auth)

/* UPDATERS */
/* Create these functions only as you need them */

/** 
 * Sets the expiration date of the given auth model to Date.now() + `extensionNumber` seconds. The change is
 * reflected in the database and in the passed object.
 */
async function extendExpirationDate(authModel: AuthModel, extensionTime: number) {
  const authEntry = modelToEntry(authModel)
  let newExpirationDate = Date.now() / 1000 + extensionTime
  await ddb.updateItem({
    TableName: schema.auth.name,
    Key: getKey(schema.auth, authEntry),
    UpdateExpression: "#ttl = :newExpiration",
    ExpressionAttributeNames: { '#ttl': schema.auth.ttlKey },
    ExpressionAttributeValues: marshall({ ':newExpiration': newExpirationDate })
  })
  authModel.expirationDate = newExpirationDate
}

/**
 *  Sets the auth token proprety in the given auth model. Rhe change is reflected in the database and in the 
 * passed object. 
 */
async function setAuthToken(authModel: AuthModel, token: string) {
  const authEntry = modelToEntry(authModel)
  await ddb.updateItem({
    TableName: schema.auth.name,
    Key: getKey(schema.auth, authEntry),
    UpdateExpression: "#token = :newToken",
    ExpressionAttributeNames: { '#token': schema.auth.schema.authToken },
    ExpressionAttributeValues: marshall({ ':newToken': token })
  })
  authModel.authToken = token
}

/**
 *  Sets the assignee property in the given player model. The change is reflected in the database and in the 
 * passed object. 
 */
export async function setPlayerAssignment(playerModel: PlayerModel, assignedTo: string) {
  const playerEntry = modelToEntry(playerModel)
  await ddb.updateItem({
    TableName: schema.players.name,
    Key: getKey(schema.players, playerEntry),
    UpdateExpression: "#assignedTo = :newAssignedTo",
    ExpressionAttributeNames: { '#assignedTo': schema.players.schema.assignedTo },
    ExpressionAttributeValues: marshall({ ':newAssignedTo': assignedTo })
  })
}

/**
 *  Sets the "started" property in the given game model to "true". The change is reflected in the database and in the 
 * passed object. 
 */
export async function startGame(gameModel: GameModel) {
  
  const gameEntry = modelToEntry(gameModel)

  await ddb.updateItem({
    TableName: schema.games.name,
    Key: getKey(schema.games, gameEntry),
    UpdateExpression: "#started = :newStarted",
    ExpressionAttributeNames: { '#started': schema.games.schema.started },
    ExpressionAttributeValues: marshall({ ':newStarted': true })
  })

  return true;
}

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

/** MISCELLANEOUS UTILITY FUNCTIONS */

/** Convert a Model object to the Key attribute used in get/update/delete requests */
function getKey(tableSchema: TableSchema, entry: DatabaseEntry): Record<string, AttributeValue> {
  return marshall({
    [tableSchema.partitionKey]: entry[tableSchema.partitionKey as keyof typeof entry],
    ...(tableSchema.sortKey && { [tableSchema.sortKey]: entry[tableSchema.sortKey as keyof typeof entry] })
  })
}

/** Converts a query response into a list of model objects. Returns `[]` if `response.Items` doesn't exist. */
function mapQueryResult<T extends DatabaseModel>(response: QueryCommandOutput): T[] {
  const items = response.Items?.map(item => entryToModel(unmarshall(item) as any) as T);
  return items ?? []
}

/** Gets the first item returned in a query, or returns null if `response.Items` was empty or doesn't exist. */
function getFirstQueryResult<T extends DatabaseModel>(response: QueryCommandOutput): T | null {
  return mapQueryResult<T>(response).at(0) ?? null
} 