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

export async function getGame(gameId: String) {
    if (gameId == "def") {
        let data: Game = {
            displayName: "Smith Family Gift Exchange",
            code: "def",
            hostName: "Bob",
            started: false,
            exchangeDate: "December 25th"
        }
        return data;
    }
    else if (gameId == "ghi") {
        let data: Game = {
            displayName: "Work Gift Exchange",
            code: "ghi",
            hostName: "Bob",
            started: false,
            exchangeDate: "December 25th"
        }
        return data
    }
    else if (gameId == "jkl") {
        let data: Game = {
            displayName: "Group Project Gift Exchange",
            code: "jkl",
            hostName: "John",
            started: false,
            exchangeDate: "December 25th"
        }
        return data
    }
}

export async function joinGame(gameCode: String, displayName: String) {
    return { success: true };
}

export async function createGame(gameName: String, hostDisplayName: String, exchangeDate: String) {
    return {
        gameCode: "def"
    }
}

export async function startGame() {
// Not implemented
}

export async function endGame() {
// Not implemented
}

export async function getPlayers() {
    let data: (Player)[] = [
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

    return data
}

export async function getPlayer(authToken: String, gameCode: String) {
    if (authToken == "abc" && gameCode == "def") {
        let data: Player = {
            id: "abc",
            gameCode: "def",
            displayName: "Johnny",
            assignedTo: "Zach"
        };
        return data;
    }
    else if (authToken == "abc" && gameCode == "ghi") {
        let data: Player = {
            id: "abc",
            gameCode: "ghi",
            displayName: "John Smith",
            assignedTo: ""
        };
        return data;
    }
    else {
        let data: Player = {
            id: "abc",
            gameCode: "jkl",
            displayName: "John",
            assignedTo: ""
        };
        return data;
    }
}