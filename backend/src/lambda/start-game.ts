/* Makes assignments and texts/emails to all players. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'
import { authenticate, getGame, getUser, getPlayersInGame, setPlayerAssignment, startGame } from '../services/dynamodb'
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

  let availableAssignments: PlayerModel[] = [];
  let lastPlayerAssignee: PlayerModel | undefined;
  let lastPlayerAssigned: PlayerModel | undefined;

  // verify authtoken, retrieve user
  let userId = await authenticate(authToken);
  // retrieve game by gameCode
  let game = await getGame(gameCode);
  if (!game) {
    return response(200, {success: false, message: constants.strings.gameDne})
  }
  // retrieve host of game
  let host = await getUser(game!.hostName);
  if (host!.id != userId) {
    return response(200, {success: false, message: constants.strings.userIsNotHost})
  }

  let players = await getPlayersInGame(game.code);

  if (players.length < 2) {
    throw new ExpectedError(constants.strings.tooFewPlayers);
  }

  availableAssignments = shuffleArray(players);

  let numPlayers = players.length;
  lastPlayerAssignee = players.at(0);
  if (!lastPlayerAssignee) {
    throw new ExpectedError(constants.strings.playerDne(gameCode, "Unknown Player"));
  }
  for(let i = 0; i < numPlayers; i++){

    let player = players.at(i);
    if (!player) {
      throw new ExpectedError(constants.strings.playerDne(gameCode, "Unknown Player"));
    }
    
    let playerAssignment = availableAssignments.pop();
    if (!playerAssignment) {
      throw new ExpectedError(constants.strings.playerDne(gameCode, "Unknown Player"));
    }
    
    if (player.displayName == playerAssignment.displayName) {
      if (availableAssignments.length > 1) {
        let newPlayerAssignment = availableAssignments.pop();
        availableAssignments.push(playerAssignment);
        playerAssignment = newPlayerAssignment;
      }
      else {
        playerAssignment = lastPlayerAssigned;
        setPlayerAssignment(lastPlayerAssignee, player.displayName);
      }
    }
  
    setPlayerAssignment(player, playerAssignment!.displayName);
    lastPlayerAssignee = player;
    lastPlayerAssigned = playerAssignment;
  
    // update game status as started
    startGame(game);
    return response(200);

  }
  
  return response(400);

};

function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
  
      // Generate random number
      var j = Math.floor(Math.random() * (i + 1));
                  
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
      
  return array;
}

export default lambda(handler)