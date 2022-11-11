import { describe, it } from 'mocha'
import { expect } from 'chai'
import sinon from 'sinon'
import * as dynamodb from '../../src/services/dynamodb'
import handler from '../../src/lambda/start-game'
import { createMockBody } from './testing-utils'
import constants from '../../src/utils/constants'
import { GameModel, PlayerEntry, PlayerModel, UserModel } from '../../src/model/database-model'

afterEach(() => {
  sinon.restore()
})

describe("lambda: start-game", () => {
  it("Updates game to started when there's multiple players", async () => {
    const sampleGame : GameModel = {
      "displayName" : "<DISPLAY NAME>",
      "code" : "<GAME CODE>",
      "started" : false,
      "hostName": "<USER ID>"
    }
    const sampleUser : UserModel = {
      "id" : "<USER ID>", 
      "email" : "<EMAIL"
    }
    const samplePlayers: PlayerModel[] = [
      {
        "displayName": "Player 1",
        "gameCode": "<GAME CODE>",
        "id": "<USER ID>"
      },
      {
        "displayName": "Player 2",
        "gameCode": "<GAME CODE>",
        "id": "<USER ID>"
      }
    ]
    sinon.stub(dynamodb, "startGame").callsFake(async (gameModel: GameModel) => {
      expect(gameModel).to.equal(sampleGame)
      return true;
    })
    sinon.stub(dynamodb, "authenticate").callsFake(async (authToken: string) => {
      expect(authToken).to.equal("<AUTH TOKEN>")
      return "<USER ID>";
    })
    sinon.stub(dynamodb, "getGame").callsFake(async (gameCode: string) => {
      expect(gameCode).to.equal("<GAME CODE>")
      return sampleGame;
    })
    sinon.stub(dynamodb, "getUser").callsFake(async (userId: string) => {
      expect(userId).to.equal("<USER ID>")
      return sampleUser;
    })
    sinon.stub(dynamodb, "getPlayersByGame").callsFake(async (gameCode: string) => {
      expect(gameCode).to.equal("<GAME CODE>")
      return samplePlayers;
    })
    const response = await handler(...createMockBody({ authToken: "<AUTH TOKEN>", gameCode: "<GAME CODE>"}))
    const body = JSON.parse(response.body)
    expect(response.statusCode).to.equal(200)
    expect(body).to.deep.equal({})
  })

  it("Returns error when one or less players have joined", async () => {
    const sampleGame : GameModel = {
      "displayName" : "<DISPLAY NAME>",
      "code" : "<GAME CODE>",
      "started" : false,
      "hostName": "<USER ID>"
    }
    const sampleUser : UserModel = {
      "id" : "<USER ID>", 
      "email" : "<EMAIL"
    }
    const samplePlayers: PlayerModel[] = [
      {
        "displayName": "Player 1",
        "gameCode": "<GAME CODE>",
        "id": "<USER ID>"
      }
    ]
    sinon.stub(dynamodb, "startGame").callsFake(async (gameModel: GameModel) => {
      expect(gameModel).to.equal(sampleGame)
      return true;
    })
    sinon.stub(dynamodb, "authenticate").callsFake(async (authToken: string) => {
      expect(authToken).to.equal("<AUTH TOKEN>")
      return "<USER ID>";
    })
    sinon.stub(dynamodb, "getGame").callsFake(async (gameCode: string) => {
      expect(gameCode).to.equal("<GAME CODE>")
      return sampleGame;
    })
    sinon.stub(dynamodb, "getUser").callsFake(async (userId: string) => {
      expect(userId).to.equal("<USER ID>")
      return sampleUser;
    })
    sinon.stub(dynamodb, "getPlayersByGame").callsFake(async (gameCode: string) => {
      expect(gameCode).to.equal("<GAME CODE>")
      return samplePlayers;
    })
    const response = await handler(...createMockBody({ authToken: "<AUTH TOKEN>", gameCode: "<GAME CODE>"}))
    const body = JSON.parse(response.body)
    expect(response.statusCode).to.equal(200)
    expect(body).to.deep.equal({
      success: false,
      message: constants.strings.startGameDne
    })
  })
})