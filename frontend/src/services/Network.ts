let BASE_URL = "https://susf36ju4a.execute-api.us-west-2.amazonaws.com/prod";

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

export async function joinGame() {
    let body = {
        "authToken": "123",
        "gameCode": "123",
        "displayName": "abc"
    }
    let response = await postMethod("/game/join", body);
    return response;
}

export async function createGame() {
    let body = {
        "authToken": "123"
    }
    let response = await postMethod("/game/create", body);
    return response;
}

export async function startGame() {
    let body = {
        "authToken": "123",
        "gameCode": "123"
    }
    let response = await postMethod("/game/start", body);
    return response;
}

export async function endGame() {
    let body = {
        "authToken": "123",
        "gameCode": "123"
    }
    let response = await postMethod("/game/end", body);
    return response;
}

export async function getPlayers() {
    let body = {
        "authToken": "123"
    }
    let response = await postMethod("/user/players", body);
    return response;
}

export async function getPlayer() {
    let body = {
        "authToken": "123",
        "gameCode": "123",
        "displayName": "abc"
    }
    let response = await postMethod("/user/player", body);
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