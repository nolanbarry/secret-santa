/* Makes assignments and texts/emails to all players. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'
import { authenticate, getGame, getUser, getPlayersInGame, setPlayerAssignment, startGame, getPlayer } from '../services/dynamodb'
import { PlayerModel } from '../model/database-model'
import { ExpectedError } from '../model/error'
import constants from '../utils/constants'


/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = {
  authToken: String,
  gameCode: String,
}

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, gameCode } = validateRequestBody(event.body, requestParameters)

  // verify authtoken, retrieve user making request
  let userId = await authenticate(authToken);

  // retrieve game by gameCode
  let game = await getGame(gameCode);
  if (!game) throw new ExpectedError(constants.strings.gameDne(gameCode))

  // retrieve host of game, verify user starting game is the host
  let host = await getPlayer(game.code, game.hostName) as PlayerModel;
  if (host.id != userId) throw new ExpectedError(constants.strings.userIsNotHost)

  // retrieve players, abort if not enough players to start the game
  let players = await getPlayersInGame(game.code);
  if (players.length < 2) throw new ExpectedError(constants.strings.tooFewPlayers);

  const assignmentOrder = shuffleArray(players);

  for (let i = 0; i < assignmentOrder.length; i++) {
    const secretSanta = assignmentOrder.at(i - 1)
    const recipient = assignmentOrder.at(i)
    setPlayerAssignment(secretSanta, recipient.displayName)
  }

  // update game status as started
  startGame(game);
  return response(200);
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {

    // Generate random number
    let j = Math.floor(Math.random() * (i + 1));

    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

export default lambda(handler)