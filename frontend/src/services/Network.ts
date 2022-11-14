// let BASE_URL = "https://susf36ju4a.execute-api.us-west-2.amazonaws.com/prod"; // Nolan's Link
let BASE_URL = "https://8ymlgc01j7.execute-api.us-west-2.amazonaws.com/prod/" // Jared's Link

export async function getUser(authToken: string) {
    let body = {
        "authToken": authToken
    }
    let response = await postMethod("/user", body);
    return response;
}

export async function login(contactString: string) {
    let body = {
        "contactString": contactString
    }
    let response = await postMethod("/user/login", body);
    return response;
}

export async function submitOtp(id: string, otp: string) {
    let body = {
        "id": id,
        "otp": otp
    }
    let response = await postMethod("/user/submitotp", body);
    return response;
}

export async function getGame(authToken: string, gameCode: string) {
    let body = {
        "authToken": authToken,
        "gameCode": gameCode
    }
    let response = await postMethod("/game", body);
    return response;
}

export async function joinGame(authToken: String, gameCode: String, displayname: String) {
    let body = {
        "authToken": authToken,
        "gameCode": gameCode,
        "displayName": displayname
    }
    let response = await postMethod("/game/join", body);
    return response;
}

export async function createGame(authToken: String, gameName: String, hostDisplayName: String, exchangeDate: String) {
    let body = {
        "authToken": authToken,
        "gameName": gameName,
        "hostDisplayName": hostDisplayName,
        "exchangeDate": exchangeDate
    }
    let response = await postMethod("/game/create", body);
    return response;
}

export async function startGame(authToken: String, gameCode: String) {
    let body = {
        "authToken": authToken,
        "gameCode": gameCode
    }
    let response = await postMethod("/game/start", body);
    return response;
}

export async function endGame(authToken: String, gameCode: String) {
    let body = {
        "authToken": authToken,
        "gameCode": gameCode
    }
    let response = await postMethod("/game/end", body);
    return response;
}

export async function getPlayers(authToken: String) {
    let body = {
        "authToken": authToken
    }
    let response = await postMethod("/user/players", body);
    return response;
}

export async function getPlayer(authToken: String, gameCode: String, displayName: String) {
    let body = {
        "authToken": authToken,
        "gameCode": gameCode,
        "displayName": displayName
    }
    let response = await postMethod("/user/player", body);
    return response;
}

export async function getGamePlayers(authToken: String, gameCode: String) {
    let body = {
        "authToken": authToken,
        "gameCode": gameCode
    }
    let response = await postMethod("/game/players", body);
    return response;
}

async function postMethod(path: String, body: Object) {
    try {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        return await response.json();
    } catch (e) {
        console.log(e);
    }
}