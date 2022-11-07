import { describe, it } from 'mocha'
import { expect } from 'chai'
import sinon from 'sinon'
import * as dynamodb from '../../src/services/dynamodb'
import handler from '../../src/lambda/get-player'
import { asPromise, createMockBody } from '../testing-utils'
import constants from '../../src/utils/constants'

describe("get player lambda", () => {
  afterEach(() => {
    sinon.restore()
  })

  const playerBeingRetrieved = {
    displayName: "Foo bar",
    gameCode: "<GAME CODE>",
    id: "<USER ID 2>"
  }

  it("returns player belonging to different user", async () => {
    const authenticateStub = sinon.stub(dynamodb, "authenticate").returns(asPromise("<USER ID>"))
    const getPlayerStub = sinon.stub(dynamodb, "getPlayer").returns(asPromise(playerBeingRetrieved))
    const getPlayersForUserStub = sinon.stub(dynamodb, "getPlayersForUser").returns(asPromise([
      {
        id: "<USER ID>",
        gameCode: "<GAME CODE>",
        displayName: "<GAME CODE PLAYER>"
      },
      {
        id: "<USER ID>",
        gameCode: "<GAME CODE 2>",
        displayName: "<GAME CODE 2 PLAYER>"
      },
    ]))

    const response = await handler(...createMockBody({ authToken: "<AUTH TOKEN>", gameCode: "<GAME CODE>", displayName: "Foo bar" }))

    const body = JSON.parse(response.body)
    
    expect(body.player).to.deep.equal(playerBeingRetrieved)
    expect(response.statusCode).to.equal(200)
    
    expect(authenticateStub.calledOnceWith("<AUTH TOKEN>")).to.be.true
    expect(getPlayerStub.calledOnceWith(playerBeingRetrieved.gameCode, playerBeingRetrieved.displayName)).to.be.true
    expect(getPlayersForUserStub.calledOnceWith("<USER ID>"))
  })

  it("rejects request when player doesn't have access", async () => {
    const authenticateStub = sinon.stub(dynamodb, "authenticate").returns(asPromise("<USER ID>"))
    const getPlayerStub = sinon.stub(dynamodb, "getPlayer").returns(asPromise(playerBeingRetrieved))
    const getPlayersForUserStub = sinon.stub(dynamodb, "getPlayersForUser").returns(asPromise([
      {
        id: "<USER ID>",
        gameCode: "<GAME CODE 2>",
        displayName: "<GAME CODE 2 PLAYER>"
      },
    ]))

    const response = await handler(...createMockBody({ authToken: "<AUTH TOKEN>", gameCode: "<GAME CODE>", displayName: "Foo bar" }))

    const body = JSON.parse(response.body)
    
    expect(body.message).to.equal(constants.strings.noAccessToPlayer)
    expect(response.statusCode).to.equal(400)
    
    expect(authenticateStub.calledOnceWith("<AUTH TOKEN>")).to.be.true
    expect(getPlayerStub.calledOnceWith(playerBeingRetrieved.gameCode, playerBeingRetrieved.displayName)).to.be.true
    expect(getPlayersForUserStub.calledOnceWith("<USER ID>"))
  })

  it("rejects request when player doesn't exist", async () => {
    const authenticateStub = sinon.stub(dynamodb, "authenticate").returns(asPromise("<USER ID>"))
    const getPlayerStub = sinon.stub(dynamodb, "getPlayer").returns(asPromise(null))
    const getPlayersForUserStub = sinon.stub(dynamodb, "getPlayersForUser")

    const response = await handler(...createMockBody({ authToken: "<AUTH TOKEN>", gameCode: "<GAME CODE>", displayName: "Foo bar" }))

    const body = JSON.parse(response.body)
    
    expect(body.message).to.equal(constants.strings.playerDne("<GAME CODE>", "Foo bar"))
    expect(response.statusCode).to.equal(400)
    
    expect(authenticateStub.calledOnceWith("<AUTH TOKEN>")).to.be.true
    expect(getPlayerStub.calledOnceWith(playerBeingRetrieved.gameCode, playerBeingRetrieved.displayName)).to.be.true
    expect(getPlayersForUserStub.called).to.be.false
  })
})