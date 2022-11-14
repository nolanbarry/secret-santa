import type { Player, Game, User, Auth } from "@/model/network-models";

let isLoggedIn = false;

export async function getAuth() {
    return isLoggedIn;
}

export async function getUser(authToken: string) {
    let authVal = authData.find((x) => { return (x.authToken === authToken) })
    if (authVal) {
        let userId = authVal.id;
        let user = users.find((x) => { return (x.id === userId) })
        return {
            id: userId,
            email: user?.email
        }
    } else {
        return {
            success: false
        }
    }
}

export async function login(contactString: string) {
    let val = users.find((x) => { return (x.email === contactString) })
    if (val) {
        let newAuthToken = makeid(5);
        let newAuthData: Auth = {
            id: val.id,
            otp: defaultotp,
            authToken: newAuthToken
        }
        authData.push(newAuthData);
        return {
            userId: val.id
        }
    } else {
        let newid = makeid(3);
        let newUser: User = {
            id: newid,
            email: contactString
        }
        users.push(newUser);

        let newAuthToken = makeid(5);
        let newAuthData: Auth = {
            id: newid,
            otp: defaultotp,
            authToken: newAuthToken
        }
        authData.push(newAuthData);

        return {
            userId: newid
        }
    }
}

export async function submitOtp(id: string, otp: string) {
    let val = authData.find((x) => { return (x.id === id && x.otp === otp) })
    if (val) {
        isLoggedIn = true;
        return {
            success: true,
            authToken: val.authToken
        }
    } else {
        return {
            success: false,
            message: "Invalid OTP"
        }
    }
}

export async function logout() {
    isLoggedIn = false;
    return false;
}

export async function getGame(authToken: String, gameCode: String) {
    let authVal = authData.find((x) => { return (x.authToken === authToken) })
    let val = games.find((x) => { return (x.code === gameCode) })
    if (authVal && val) {
        return val
    } else {
        return {
            success: false
        }
    }
}

export async function joinGame(authToken: String, gameCode: String, displayName: String) {
    let authVal = authData.find((x) => { return (x.authToken === authToken) })
    let game = games.find((x) => { return (x.code === gameCode) })
    if (authVal && game) {
        let userId = authVal.id;
        let newPlayer: Player = {
            id: userId,
            gameCode: gameCode,
            displayName: displayName,
            assignedTo: ""
        }
        players.push(newPlayer);
        return { success: true }
    }
    return { success: false };
}

export async function createGame(authToken: String, gameName: string, hostDisplayName: string, exchangeDate: string) {
    let authVal = authData.find((x) => { return (x.authToken === authToken) })

    if (authVal) {
        let gameCode = makeid(3)
        let newGame: Game = {
            displayName: gameName,
            code: gameCode,
            hostName: hostDisplayName,
            started: false,
            exchangeDate: exchangeDate
        }

        let newPlayer: Player = {
            id: authVal.id,
            gameCode: gameCode,
            displayName: hostDisplayName,
            assignedTo: ""
        }

        games.push(newGame)
        players.push(newPlayer)
        return {
            gameCode: gameCode
        }
    } else {
        return {
            success: false
        }
    }
}

export async function startGame() {
    // Not implemented
}

export async function endGame() {
    // Not implemented
}

export async function getPlayers(authToken: String) {
    let authVal = authData.find((x) => { return (x.authToken === authToken) })
    let userId = authVal?.id
    let vals = players.filter((x) => { return (x.id === userId) })
    return vals
}

export async function getPlayer(authToken: String, gameCode: String) {
    let authVal = authData.find((x) => { return (x.authToken === authToken) })
    let userId = authVal?.id
    let val = players.find((x) => { return (x.id === userId && x.gameCode === gameCode) })
    if (authVal && val) {
        return val
    } else {
        return {
            success: false
        }
    }
}

function makeid(length: Number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

let players: Array<Player> = [
    {
        id: "user1",
        gameCode: "def",
        displayName: "Johnny",
        assignedTo: ""
    },
    {
        id: "user1",
        gameCode: "ghi",
        displayName: "John Smith",
        assignedTo: ""
    },
    {
        id: "user1",
        gameCode: "jkl",
        displayName: "John",
        assignedTo: ""
    },
    {
        id: "user2",
        gameCode: "def",
        displayName: "Bob",
        assignedTo: ""
    },
    {
        id: "user2",
        gameCode: "mno",
        displayName: "Bobby",
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
    },
    {
        displayName: "Bob's Gift Exchange",
        code: "mno",
        hostName: "Bob",
        started: false,
        exchangeDate: "December 24th"
    }
]

let users: Array<User> = [
    {
        id: "user1",
        email: "user1@email.com"
    },
    {
        id: "user2",
        email: "user2@email.com"
    },
    {
        id: "user3",
        email: "user3@email.com"
    }
]

let defaultotp = "abc"
let authData: Array<Auth> = []