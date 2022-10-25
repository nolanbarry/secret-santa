import { describe, it } from 'mocha'
import { expect } from 'chai'
import sinon from 'sinon'
import * as dynamodb from '../../src/services/dynamodb'
import handler from '../../src/lambda/end-game'
import { asPromise, createMockBody } from '../testing-utils'
import constants from '../../src/utils/constants'

describe("end game lambda", () => {
  afterEach(() => {
    sinon.restore()
  })

  it("calls end game after passing checks", async () => {
    const authenticateStub = sinon.stub(dynamodb, "authenticate").resolves("<USER ID>")
    const getUserStub = sinon.stub(dynamodb, "getUser").resolves({
      id: "<USER ID>",
    })
    const getGameStub = sinon.stub(dynamodb, "getGame").resolves({
      code: "<GAME CODE>",
      displayName: "A game",
      hostName: "Foobar",
      started: true
    })
    const getPlayerStub = sinon.stub(dynamodb, "getPlayer").resolves({
      id: "<USER ID>",
      displayName: "Foobar",
      gameCode: "<GAME CODE>"
    })
    const endGameStub = sinon.stub(dynamodb, "endGame")

    const response = await handler(...createMockBody({ authToken: "<AUTH TOKEN>", gameCode: "<GAME CODE>" }))
    const body = JSON.parse(response.body)

    expect(body.message).to.be.undefined
    expect(response.statusCode).to.equal(200)
    expect(body.success).to.be.true

    expect(authenticateStub.calledOnceWith("<AUTH TOKEN>")).to.be.true
    expect(getGameStub.calledOnceWith("<GAME CODE>")).to.be.true
    expect(getUserStub.calledOnceWith("<USER ID>")).to.be.true
    expect(getPlayerStub.calledOnceWith("<GAME CODE>", "Foobar")).to.be.true
    expect(endGameStub.calledOnceWith("<GAME CODE>")).to.be.true
  })

  it("rejects when game doesn't exist", async () => {
    const authenticateStub = sinon.stub(dynamodb, "authenticate").resolves("<USER ID>")
    const getUserStub = sinon.stub(dynamodb, "getUser").resolves({
      id: "<USER ID>",
    })
    const getGameStub = sinon.stub(dynamodb, "getGame").resolves(null)
    const getPlayerStub = sinon.stub(dynamodb, "getPlayer").resolves({
      id: "<USER ID>",
      displayName: "Foobar",
      gameCode: "<GAME CODE>"
    })
    const endGameStub = sinon.stub(dynamodb, "endGame")

    const response = await handler(...createMockBody({ authToken: "<AUTH TOKEN>", gameCode: "<GAME CODE>" }))
    const body = JSON.parse(response.body)

    expect(body.message).to.equal(constants.strings.gameDne('<GAME CODE>'))
    expect(response.statusCode).to.equal(400)

    expect(authenticateStub.calledOnceWith("<AUTH TOKEN>")).to.be.true
    expect(getGameStub.calledOnceWith("<GAME CODE>")).to.be.true
    expect(getUserStub.calledOnceWith("<USER ID>")).to.be.true
    expect(endGameStub.calledOnce).to.be.false
    expect(getPlayerStub.calledOnce).to.be.false
  })

  it("rejects when user doesn't exist", async () => {
    const authenticateStub = sinon.stub(dynamodb, "authenticate").resolves("<USER ID>")
    const getUserStub = sinon.stub(dynamodb, "getUser").resolves(null)
    const getGameStub = sinon.stub(dynamodb, "getGame").resolves({
      code: "<GAME CODE>",
      displayName: "A game",
      hostName: "Foobar",
      started: true
    })
    const getPlayerStub = sinon.stub(dynamodb, "getPlayer").resolves({
      id: "<USER ID>",
      displayName: "Foobar",
      gameCode: "<GAME CODE>"
    })
    const endGameStub = sinon.stub(dynamodb, "endGame")

    const response = await handler(...createMockBody({ authToken: "<AUTH TOKEN>", gameCode: "<GAME CODE>" }))
    const body = JSON.parse(response.body)

    expect(body.message).to.equal(constants.strings.authorizedUserDne)
    expect(response.statusCode).to.equal(500)

    expect(authenticateStub.calledOnceWith("<AUTH TOKEN>")).to.be.true
    expect(getGameStub.calledOnceWith("<GAME CODE>")).to.be.true
    expect(getUserStub.calledOnceWith("<USER ID>")).to.be.true
    expect(endGameStub.calledOnce).to.be.false
    expect(getPlayerStub.calledOnce).to.be.false
  })

  it("rejects when user is unauthorized", async () => {
    const authenticateStub = sinon.stub(dynamodb, "authenticate").resolves("<USER ID>")
    const getUserStub = sinon.stub(dynamodb, "getUser").resolves({
      id: "<USER ID>",
    })
    const getGameStub = sinon.stub(dynamodb, "getGame").resolves({
      code: "<GAME CODE>",
      displayName: "A game",
      hostName: "Foobar",
      started: true
    })
    const getPlayerStub = sinon.stub(dynamodb, "getPlayer").resolves({
      id: "<DIFFERENT USER ID>",
      displayName: "Foobar",
      gameCode: "<GAME CODE>"
    })
    const endGameStub = sinon.stub(dynamodb, "endGame")

    const response = await handler(...createMockBody({ authToken: "<AUTH TOKEN>", gameCode: "<GAME CODE>" }))
    const body = JSON.parse(response.body)

    expect(body.message).to.equal(constants.strings.userIsNotHost)
    expect(response.statusCode).to.equal(401)

    expect(authenticateStub.calledOnceWith("<AUTH TOKEN>")).to.be.true
    expect(getGameStub.calledOnceWith("<GAME CODE>")).to.be.true
    expect(getUserStub.calledOnceWith("<USER ID>")).to.be.true
    expect(endGameStub.calledOnce).to.be.false
    expect(getPlayerStub.calledOnce).to.be.true
  })
})