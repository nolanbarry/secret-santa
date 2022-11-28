# `/game/create`
Located in `create-game.ts`
### Request Body
```json
{
  authToken: string,
  gameName: string,
  hostDisplayName: string,
  exchangeDate: string
}
```
### Response Body
```json
{
  gameCode: string
}
```

# `/game/end`
Located in `end-game.ts`
### Request Body
```json
{
  authToken: string,
  gameCode: string
}
```
### Response Body
```json
{
  success: true
}
```

# `/game/players`
Located in `get-game-players.ts`
### Request Body
```json
{
  authToken: string,
  gameCode: string
}
```
### Response Body
```json
{
  players: [
    {
      id: string // id of user this player belongs to
      gameCode: string
      displayName: string
      assignedTo?: string // display name of recipient
    }
  ]
}
```
# `/game`
Located in `get-game.ts`
### Request Body
```json
{
  authToken: string,
  gameCode: string
}
```
### Response Body
```json
{
  game: {
    displayName: string // display name of game
    code: string
    hostName: string // display name of host
    started: boolean
    exchangeDate?: number // epoch seconds
  }
}
```
# `/user/player`
Located in `get-player.ts`
### Request Body
```json
{
  authToken: string
  gameCode: string
  displayName: string
}
```
### Response Body
```json
{
  player: {
    id: string // id of user that player belongs to
    gameCode: string
    displayName: string
    assignedTo?: string // display name of recipient
  }
}
```
# `/user/players`
Located `get-user-players.ts`
### Request Body
```json
{
  authToken: string
}
```
### Response Body
```json
{
  players: [
      {
        id: string // id of user this player belongs to
        gameCode: string
        displayName: string
        assignedTo?: string // display name of recipient
      }
  ]
}
```
# `/user`
Located in `get-user.ts`
### Request Body
```json
{
  authToken: string
}
```
### Response Body
```json
{
  user: {
    id: string
    phoneNumber?: string // E.164 format
    email?: string
  }
}
```
# `/game/join`
Located in `join-game.ts`
### Request Body
```json
{
  authToken: string,
  gameCode: string,
  displayName: string // display name of new player
}
```
### Response Body
```json
{
  success: true
}
```
# `/login`
Located in `login.ts`
### Request Body
```json
TBD
```
### Response Body
```json
TBD
```
# `/game/start`
Located in `start-game.ts`
### Request Body
```json
{
  authToken: string,
  gameCode: string,
}
```
### Respone **Body*
```json
None
```
# `/submitotp`
Located in `submit-otp.ts`
### Request Body
```json
{
  id: string,
  otp: string
}
```
### Response Body
```json
{
  success: true,
  authToken: string
}
```

# `/validate-auth`
Located in `validate-auth.ts`
### Request Body
```json
{
  id: string,
  auth: string
}
```
### Response Body
```json
{
  success: true,
  authToken: string
}
```