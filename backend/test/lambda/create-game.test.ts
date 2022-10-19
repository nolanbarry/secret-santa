import { describe, it } from 'mocha'
import { expect } from 'chai'
import sinon from 'sinon'
import * as dynamodb from '../../src/services/dynamodb'
import handler from '../../src/lambda/create-game'
import { asPromise, createMockBody } from './testing-utils'
import constants from '../../src/utils/constants'

afterEach(() => {
  sinon.restore()
})

describe("lambda: create-game", () => {
  it("Calls create game and returns game code", async () => {
    const authenticateStub = sinon.stub(dynamodb, "authenticate").returns(asPromise("<USER ID>"))
    const createGameStub = sinon.stub(dynamodb, "createGame").returns(asPromise("<GAME CODE>"))

    const response = await handler(...createMockBody({
      authToken: "<AUTH TOKEN>",
      gameName: "<GAME NAME>",
      hostDisplayName: "<HOST DISPLAY NAME>",
      exchangeDate: 8
    }))
    const body = JSON.parse(response.body)
    expect(body.gameCode).to.equal("<GAME CODE>")
    authenticateStub.calledOnceWith("<AUTH TOKEN>")
    createGameStub.calledOnceWith("<GAME NAME>", 8, "<USER ID>", "<HOST DISPLAY NAME>")
  })
})