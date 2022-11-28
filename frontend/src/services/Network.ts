let isLoggedIn = false;

export async function getAuth() {
    return isLoggedIn;
}

export async function loginUser() {
    isLoggedIn = true;
    return true;
}

let BASE_URL = "https://susf36ju4a.execute-api.us-west-2.amazonaws.com/prod";

export async function getUser() {
    let body = {
        "authToken": "helloworld"
    }
    try {
        const response = await fetch(`${BASE_URL}/user`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        return await response.json();
    } catch(e) {
        console.log(e);
    }
}

export async function login() {
    let body = {
        "contact": "123@gmail.com"
    }
    try {
        const response = await fetch(`${BASE_URL}/user/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        return await response.json();
    } catch(e) {
        console.log(e);
    }
}

export async function submitOtp() {
    let body = {
        "id": "123",
        "otp": "123"
    }
    try {
        const response = await fetch(`${BASE_URL}/user/submitotp`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        return await response.json();
    } catch(e) {
        console.log(e);
    }
}

export async function validateAuth() {
    let body = {
        "id": "123",
        "auth": "123"
    }
    try {
        const response = await fetch(`${BASE_URL}/user/validateauth`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        return await response.json();
    } catch(e) {
        console.log(e);
    }
}

export async function getGame() {
    let body = {
        "authToken": "123",
        "gameCode": "123"
    }
    try {
        const response = await fetch(`${BASE_URL}/game`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        return await response.json();
    } catch(e) {
        console.log(e);
    }
}

export async function joinGame() {
    let body = {
        "authToken": "123",
        "gameCode": "123",
        "displayName": "abc"
    }
    try {
        const response = await fetch(`${BASE_URL}/game/join`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        return await response.json();
    } catch(e) {
        console.log(e);
    }
}

export async function createGame() {
    let body = {
        "authToken": "123"
    }
    try {
        const response = await fetch(`${BASE_URL}/game/create`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        return await response.json();
    } catch(e) {
        console.log(e);
    }
}

export async function startGame() {
    let body = {
        "authToken": "123",
        "gameCode": "123"
    }
    try {
        const response = await fetch(`${BASE_URL}/game/start`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        return await response.json();
    } catch(e) {
        console.log(e);
    }
}

export async function endGame() {
    let body = {
        "authToken": "123",
        "gameCode": "123"
    }
    try {
        const response = await fetch(`${BASE_URL}/game/end`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        return await response.json();
    } catch(e) {
        console.log(e);
    }
}

export async function getPlayers() {
    let body = {
        "authToken": "123"
    }
    try {
        const response = await fetch(`${BASE_URL}/user/players`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        return await response.json();
    } catch(e) {
        console.log(e);
    }
}

export async function getPlayer() {
    let body = {
        "authToken": "123",
        "gameCode": "123",
        "displayName": "abc"
    }
    try {
        const response = await fetch(`${BASE_URL}/user/player`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        return await response.json();
    } catch(e) {
        console.log(e);
    }
}