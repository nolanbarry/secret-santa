
export interface Game {
    code: string
    "display-name": string
    "host-name": string
}

export interface User {
    id: string
    "phone-number"?: string
    email?: string
}

export interface Player {
    id: string
    "display-name": string
    "game-code": string
    "assigned-to"?: string
}

export interface Auth {
    id: string
    otp: string
    "auth-token"?: string
}