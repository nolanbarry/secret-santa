import type { Player, Game } from "@/model/network-models";

let isLoggedIn = false;

export async function getAuth() {
    return isLoggedIn;
}

export async function getUser() {
    return {
        id: "abc",
        email: "user@email.com"
    }
}

export async function login() {
    isLoggedIn = true;
    return true;
}

export async function logout() {
    isLoggedIn = false;
    return false;
}

export async function getGame(gameCode: String) {
    let val = games.find((x) => { return (x.code === gameCode) })
    return val
}

export async function joinGame(gameCode: String, displayName: String) {
    return { success: true };
}

export async function createGame(gameName: string, hostDisplayName: string, exchangeDate: string) {
    let gameCode = makeid(3)
    let newGame: Game = {
        displayName: gameName,
        code: gameCode,
        hostName: hostDisplayName,
        started: false,
        exchangeDate: exchangeDate
    }

    let newPlayer: Player = {
        id: "abc",
        gameCode: gameCode,
        displayName: hostDisplayName,
        assignedTo: ""
    }
    
    games.push(newGame)
    players.push(newPlayer)
    return {
        gameCode: gameCode
    }
}

export async function startGame() {
    // Not implemented
}

export async function endGame() {
    // Not implemented
}

export async function getPlayers() {
    return players
}

export async function getPlayer(authToken: String, gameCode: String) {
    let val = players.find((x) => { return (x.id === authToken && x.gameCode === gameCode) })
    return val
}

let players: Array<Player> = [
    {
        id: "abc",
        gameCode: "def",
        displayName: "Johnny",
        assignedTo: ""
    },
    {
        id: "abc",
        gameCode: "ghi",
        displayName: "John Smith",
        assignedTo: ""
    },
    {
        id: "abc",
        gameCode: "jkl",
        displayName: "John",
        assignedTo: ""
    }
]

let games: Array<Game> = [
    {
        displayName: "Smith Family Gift Exchange",
        code: "def",
        hostName: "Bob",
        started: false,
        exchangeDate: "December 25th"
    },
    {
        displayName: "Work Gift Exchange",
        code: "ghi",
        hostName: "Bob",
        started: false,
        exchangeDate: "December 25th"
    },
    {
        displayName: "Group Project Gift Exchange",
        code: "jkl",
        hostName: "John",
        started: false,
        exchangeDate: "December 25th"
    }
]

function makeid(length: Number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}