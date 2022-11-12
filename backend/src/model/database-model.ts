import { camelToKebab, kebabToCamel } from "../utils/utils"
import constants from "../utils/constants"
const { games, users, players, auth } = constants.tables

/*
 * Entry: The object as it actually exists in the database - all keys are in kebab-case and all values are strings.
 * Model: The exact same as the corresponding Entry object, but with keys in camelCase instead of kebab-case. Used
 *        purely as a "friendly version" to make using it in TS easier.
 * 
 * These types must match the schema defined in utils/constants.ts
 */

export type GameEntry = {
    "display-name": string;
    code: string;
    "host-name": string;
    started: boolean;
    "exchange-date"?: number;
}
export type GameModel = {
    displayName: string;
    code: string;
    hostName: string;
    started: boolean;
    exchangeDate?: number;
}

export type UserEntry = {
    id: string;
    "phone-number"?: string;
    email?: string;
}
export type UserModel = {
    id: string;
    phoneNumber?: string;
    email?: string;
}

export type PlayerEntry = {
    id: string;
    "game-code": string;
    "display-name": string;
    "assigned-to"?: string;
}
export type PlayerModel = {
    id: string;
    gameCode: string;
    displayName: string;
    assignedTo?: string;
}

export type AuthEntry = {
    id: string;
    otp: string;
    "expiration-date": string;
    "auth-token"?: string;
}
export type AuthModel = {
    id: string;
    otp: string;
    expirationDate: number;
    authToken?: string;
}

export type DatabaseEntry = GameEntry | UserEntry | PlayerEntry | AuthEntry
export type DatabaseModel = GameModel | UserModel | PlayerModel | AuthModel

/* modelToEntry Overloads */
export function modelToEntry(from: GameModel): GameEntry
export function modelToEntry(from: UserModel): UserEntry
export function modelToEntry(from: PlayerModel): PlayerEntry
export function modelToEntry(from: AuthModel): AuthEntry
/** Converts a Model object into its corresponding Entry object (as in, converts each key name to kebab-case). */
export function modelToEntry(from: Record<string, string | number | boolean>): Record<string, string | number | boolean> {
    let result: any = {}
    for (let [key, value] of Object.entries(from)) {
        result[camelToKebab(key)] = value
    }
    return result
}

/* entryToModel overloads */
export function entryToModel(from: GameEntry): GameModel
export function entryToModel(from: UserEntry): UserModel
export function entryToModel(from: PlayerEntry): PlayerModel
export function entryToModel(from: AuthEntry): AuthModel
/** Converts an Entry object into its corresponding Model object (as in, converts each key name to camelCase). */
export function entryToModel(from: Record<string, string | number | boolean | undefined>): Record<string, string | number | boolean | undefined> {
    let result: any = {}
    for (let [key, value] of Object.entries(from)) {
        result[kebabToCamel(key)] = value
    }
    return result
}