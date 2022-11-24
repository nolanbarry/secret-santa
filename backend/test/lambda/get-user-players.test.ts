import { describe, it } from 'mocha'
import { expect } from 'chai'
import sinon from 'sinon'
import * as dynamodb from '../../src/services/dynamodb'
import handler from '../../src/lambda/get-user-players'
import { asPromise, createMockBody } from '../testing-utils'

describe("get user players lambda", () => {
  afterEach(() => {
    sinon.restore()
  })

  it("retrieves and returns players", async () => {
    const players = [
      {
        id: "<USER ID>",
        displayName: "Foo",
        gameCode: "<GAME CODE>"
      },
      {
        id: "<USER ID>",
        displayName: "Bar",
        gameCode: "<GAME CODE 2>"
      }
    ]
    const authenticateStub = sinon.stub(dynamodb, "authenticate").returns(asPromise("<USER ID>"))
    const getPlayersForUserStub = sinon.stub(dynamodb, "getPlayersForUser").returns(asPromise(players))

    const response = await handler(...createMockBody({
      authToken: "<AUTH TOKEN>"
    }))

    const body = JSON.parse(response.body)

    expect(response.statusCode).to.equal(200)
    expect(body.players).to.deep.equal(players)

    expect(authenticateStub.calledOnceWith("<AUTH TOKEN>")).to.be.true
    expect(getPlayersForUserStub.calledOnceWith("<USER ID>")).to.be.true
  })
})