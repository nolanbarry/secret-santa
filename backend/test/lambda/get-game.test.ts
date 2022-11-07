import { describe, it } from 'mocha'
import { expect } from 'chai'
import sinon from 'sinon'
import * as dynamodb from '../../src/services/dynamodb'
import handler from '../../src/lambda/get-game'
import { asPromise, createMockBody } from '../testing-utils'
import constants from '../../src/utils/constants'
import { GameModel, PlayerModel } from '../../src/model/database-model'

describe("get game lambda", () => {
  afterEach(() => {
    sinon.restore()
  })

  const game: GameModel = {
    code: "<GAME CODE>",
    displayName: "A game",
    hostName: "Foobar",
    started: false,
    exchangeDate: 10
  }

  const players: PlayerModel[] = [
    {
      displayName: "player 1",
      gameCode: "<GAME CODE>",
      id: "<USER ID>"
    },
    {
      displayName: "player 2",
      gameCode: "<GAME CODE>",
      id: "<USER ID 2>"
    }
  ]

  it("returns a game", async () => {
    const authenticateStub = sinon.stub(dynamodb, "authenticate").returns(asPromise("<USER ID>"))
    const getGameStub = sinon.stub(dynamodb, "getGame").returns(asPromise(game))
    const getPlayersInGameStub = sinon.stub(dynamodb, "getPlayersInGame").returns(asPromise(players))

    const response = await handler(...createMockBody({ authToken: "<AUTH TOKEN>", gameCode: "<GAME CODE>"}))

    expect(authenticateStub.calledOnceWith("<AUTH TOKEN>")).to.be.true
    expect(getGameStub.calledOnceWith("<GAME CODE>")).to.be.true
    expect(getPlayersInGameStub.calledOnceWith("<GAME CODE>")).to.be.true

    expect(response.statusCode).to.equal(200)

    const body = JSON.parse(response.body)
    expect(body.game).to.deep.equal(game)
  })

  it("rejects request when user is not in game", async () => {
    const authenticateStub = sinon.stub(dynamodb, "authenticate").returns(asPromise("<RANDOM USER>"))
    const getGameStub = sinon.stub(dynamodb, "getGame").returns(asPromise(game))
    const getPlayersInGameStub = sinon.stub(dynamodb, "getPlayersInGame").returns(asPromise(players))

    const response = await handler(...createMockBody({ authToken: "<AUTH TOKEN>", gameCode: "<GAME CODE>"}))

    expect(authenticateStub.calledOnceWith("<AUTH TOKEN>")).to.be.true
    expect(getGameStub.calledOnceWith("<GAME CODE>")).to.be.true
    expect(getPlayersInGameStub.calledOnceWith("<GAME CODE>")).to.be.true

    expect(response.statusCode).to.equal(400)

    const body = JSON.parse(response.body)
    expect(body.game).to.be.undefined
    expect(body.message).to.equal(constants.strings.noAccessToGame)
  })

  it("rejects request when game does not exist", async () => {
    const authenticateStub = sinon.stub(dynamodb, "authenticate").returns(asPromise("<USER ID>"))
    const getGameStub = sinon.stub(dynamodb, "getGame").returns(asPromise(null))
    const getPlayersInGameStub = sinon.stub(dynamodb, "getPlayersInGame").returns(asPromise(players))

    const response = await handler(...createMockBody({ authToken: "<AUTH TOKEN>", gameCode: "<GAME CODE>"}))

    expect(authenticateStub.calledOnceWith("<AUTH TOKEN>")).to.be.true
    expect(getGameStub.calledOnceWith("<GAME CODE>")).to.be.true
    expect(getPlayersInGameStub.calledOnceWith("<GAME CODE>")).to.be.false

    expect(response.statusCode).to.equal(400)

    const body = JSON.parse(response.body)
    expect(body.game).to.be.undefined
    expect(body.message).to.equal(constants.strings.gameDne("<GAME CODE>"))
  })
})
