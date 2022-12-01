let BASE_URL = "https://susf36ju4a.execute-api.us-west-2.amazonaws.com/prod"; // Nolan's Link
// let BASE_URL = "https://8ymlgc01j7.execute-api.us-west-2.amazonaws.com/prod" // Jared's Link

function getAuthToken() {
    return sessionStorage.getItem("authToken") ? sessionStorage.getItem("authToken") : "unauthorized"
}

export async function logout() {
    sessionStorage.clear();
}

export async function checkAuth() {
    let body = {
        "authToken": getAuthToken()
    }
    let response = await postMethod("/user", body);
    if (response.user) {
        return true;
    }
    return false;
}

export async function getUser() {
    let body = {
        "authToken": getAuthToken()
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
    sessionStorage.setItem("authToken", response.authToken)
    return response;
}

export async function validateAuth() {
    const body = { authToken: getAuthToken() }
    try {
        const response = await postMethod(`${BASE_URL}/user/validateauth`, body)
        return response
    } catch (e) {
        console.log(e);
    }
}

export async function getGame(gameCode: string) {
    const body = {
        "authToken": getAuthToken(),
        "gameCode": gameCode
    }
    const response = await postMethod("/game", body);
    const utcSeconds = response.game.exchangeDate;
    const d = new Date(utcSeconds);
    response.game.exchangeDate = d.toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" });
    return response;
}

export async function joinGame(gameCode: string, displayname: string) {
    let body = {
        "authToken": getAuthToken(),
        "gameCode": gameCode,
        "displayName": displayname
    }
    let response = await postMethod("/game/join", body);
    return response;
}

export async function createGame(gameName: string, hostDisplayName: string, exchangeDate: string) {
    let date_seconds = Date.parse(exchangeDate);

    let body = {
        "authToken": getAuthToken(),
        "gameName": gameName,
        "hostDisplayName": hostDisplayName,
        "exchangeDate": date_seconds
    }
    let response = await postMethod("/game/create", body);
    return response;
}

export async function startGame(gameCode: string) {
    let body = {
        "authToken": getAuthToken(),
        "gameCode": gameCode
    }
    let response = await postMethod("/game/start", body);
    return response;
}

export async function endGame(gameCode: string) {
    let body = {
        "authToken": getAuthToken(),
        "gameCode": gameCode
    }
    let response = await postMethod("/game/end", body);
    return response;
}

export async function getPlayers() {
    let body = {
        "authToken": getAuthToken()
    }
    let response = await postMethod("/user/players", body);
    return response;
}

export async function getPlayer(gameCode: string, displayName: string) {
    let body = {
        "authToken": getAuthToken(),
        "gameCode": gameCode,
        "displayName": displayName
    }
    let response = await postMethod("/user/player", body);
    return response;
}

export async function getGamePlayers(gameCode: string) {
    let body = {
        "authToken": getAuthToken(),
        "gameCode": gameCode
    }
    let response = await postMethod("/game/players", body);
    return response;
}

async function postMethod(path: string, body: Object) {
    try {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        if (response.ok) {
            return await response.json();
        } else {
            console.log(await response.json());
        }
    } catch (e) {
        console.log(e);
    }
}