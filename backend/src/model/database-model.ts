import { camelToKebab, kebabToCamel } from "../utils/utils"
import constants from "../utils/constants"
const { games, users, players, auth } = constants.tables

/*
 * Entry: The object as it actually exists in the database - all keys are in kebab-case and all values are strings.
 * Model: The exact same as the corresponding Entry object, but with keys in camelCase instead of kebab-case. Used
 *        purely as a "friendly version" to make using it in TS easier.
 */

export type GameEntry = { [key in typeof games.schema[keyof typeof games.schema]]: string }
export type GameModel = { -readonly [key in keyof typeof games.schema]: string }

export type UserEntry = { [key in typeof users.schema[keyof typeof users.schema]]: string }
export type UserModel = { -readonly [key in keyof typeof users.schema]: string }

export type PlayerEntry = { [key in typeof players.schema[keyof typeof players.schema]]: string }
export type PlayerModel = { -readonly [key in keyof typeof players.schema]: string }

export type AuthEntry = { [key in typeof auth.schema[keyof typeof auth.schema]]: string }
export type AuthModel = { -readonly [key in keyof typeof auth.schema]: string }

export type DatabaseEntry = GameEntry | UserEntry | PlayerEntry | AuthEntry
export type DatabaseModel = GameModel | UserModel | PlayerModel | AuthModel

export function toEntry(from: GameModel): GameEntry
export function toEntry(from: UserModel): UserEntry
export function toEntry(from: PlayerModel): PlayerEntry
export function toEntry(from: AuthModel): AuthEntry

/** Converts a Model object into its corresponding Entry object (as in, converts each key name to kebab-case). */
export function toEntry(from: GameModel | UserModel | PlayerModel | AuthModel): GameEntry | UserEntry | PlayerEntry | AuthEntry {
    let result: any = {}
    for (let [key, value] of Object.entries(from)) {
        result[kebabToCamel(key)] = value
    }
    return result
}

export function fromEntry(from: GameEntry): GameModel
export function fromEntry(from: UserEntry): UserModel
export function fromEntry(from: PlayerEntry): PlayerModel
export function fromEntry(from: AuthEntry): AuthModel

/** Converts an Entry object into its corresponding Model object (as in, converts each key name to camelCase). */
export function fromEntry(from: GameEntry | UserEntry | PlayerEntry | AuthEntry): GameModel | UserModel | PlayerModel | AuthModel {
    let result: any = {}
    for (let [key, value] of Object.entries(from)) {
        result[camelToKebab(key)] = value
    }
    return result
}