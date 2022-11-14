export type Player = {
    id: string;
    gameCode: String;
    displayName: String;
    assignedTo?: string;
}

export type Game = {
    displayName: string;
    code: string;
    hostName: string;
    started: boolean;
    exchangeDate?: string;
}

export type User = {
    id: string;
    phoneNumber?: string;
    email?: string;
}

export type Auth = {
    id: string;
    otp: string;
    authToken?: string;
}