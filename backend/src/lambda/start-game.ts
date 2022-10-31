/* Makes assignments and texts/emails to all players. */

import { APIGatewayEvent, Context } from 'aws-lambda'
import { lambda, response, validateRequestBody } from '../utils/utils'
import { authenticate, getGame, getUser, getPlayersByGame, setPlayerAssignment, startGame } from '../services/dynamodb'
import { PlayerModel } from '../model/database-model'
import { ExpectedError } from '../model/error'
import constants from '../utils/constants'


/* See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html */

const requestParameters = {
  authToken: String,
  gameCode: String,
}

let availableAssignments: PlayerModel[] = [];
let lastPlayerAssignee: PlayerModel;
let lastPlayerAssigned: PlayerModel | undefined;

async function handler(event: APIGatewayEvent, context: Context) {
  const { authToken, gameCode } = validateRequestBody(event.body, requestParameters)

  // verify authtoken, retrieve user
  let userId = await authenticate(authToken);
  // retrieve game by gameCode
  let game = await getGame(gameCode);
  // retrieve host of game
  let host = await getUser(game!.hostName);
  // verify host of game id == user.id
  if (host!.id == userId) {
    // make assignments and text/email to everyone

    let players = getPlayersByGame(game!.code);
    availableAssignments = shuffleArray(await players);
    if ((await players).length > 1) {
      (await players).forEach(assignPlayer)
    }
    else {
      throw new ExpectedError(constants.strings.otpDne);
    }
  
    // update game status as started
    startGame(game!);

  }
  

  return response(200, { message: "Function not implemented." })
};

function assignPlayer(player: PlayerModel) {

  let playerAssignment = availableAssignments.pop();
  if (!playerAssignment) {
    return;
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

}

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