import { describe, it } from 'mocha'
import { expect } from 'chai'
import sinon from 'sinon'
import * as dynamodb from '../../src/services/dynamodb'
import handler from '../../src/lambda/get-game-players'
import { asPromise, createMockBody } from '../testing-utils'
import constants from '../../src/utils/constants'

describe("get game players lambda", () => {
  afterEach(() => {
    sinon.restore()
  })

  const gamePlayers = [
    {
      id: "<USER ID>",
      displayName: "Hello",
      gameCode: "<GAME CODE>"
    },
    {
      id: "<USER ID 2>",
      displayName: "World",
      gameCode: "<GAME CODE>"
    },
    {
      id: "<USER ID>",
      displayName: "Foo",
      gameCode: "<GAME CODE>"
    },
  ]

  it("retrieves and returns players when user is authorized", async () => {
    const authenticateStub = sinon.stub(dynamodb, "authenticate").returns(asPromise("<USER ID>"))
    const getPlayersForGameStub = sinon.stub(dynamodb, "getPlayersInGame").returns(asPromise(gamePlayers))

    const response = await handler(...createMockBody({
      authToken: "<AUTH TOKEN>",
      gameCode: "<GAME CODE>"
    }))

    const body = JSON.parse(response.body)

    expect(response.statusCode).to.equal(200)
    expect(body.players).to.deep.equal(gamePlayers)

    expect(authenticateStub.calledOnceWith("<AUTH TOKEN>")).to.be.true
    expect(getPlayersForGameStub.calledOnceWith("<GAME CODE>"))
  })

  it("rejects request when user doesn't have a player in the game", async () => {
    const authenticateStub = sinon.stub(dynamodb, "authenticate").returns(asPromise("<USER ID NOT IN GAME>"))
    const getPlayersForGameStub = sinon.stub(dynamodb, "getPlayersInGame").returns(asPromise(gamePlayers))

    const response = await handler(...createMockBody({
      authToken: "<AUTH TOKEN>",
      gameCode: "<GAME CODE>"
    }))

    const body = JSON.parse(response.body)

    expect(response.statusCode).to.equal(400)
    expect(body.message).to.equal(constants.strings.noAccessToGame)

    expect(authenticateStub.calledOnceWith("<AUTH TOKEN>")).to.be.true
    expect(getPlayersForGameStub.calledOnceWith("<GAME CODE>"))
  })
})