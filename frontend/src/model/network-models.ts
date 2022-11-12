export type Player = {
    id: string;
    gameCode: string;
    displayName: string;
    assignedTo?: string;
}

export type Game = {
    displayName: string;
    code: string;
    hostName: string;
    started: boolean;
    exchangeDate?: string;
}