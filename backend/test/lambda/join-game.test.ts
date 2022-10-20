import { describe, it } from 'mocha'
import { expect } from 'chai'
import sinon from 'sinon'
import * as dynamodb from '../../src/services/dynamodb'
import handler from '../../src/lambda/join-game'
import { asPromise, createMockBody } from '../testing-utils'
import constants from '../../src/utils/constants'

const game = { gameCode: "", code: "", displayName: "", hostName: "", started: false }

describe("join game lambda", () => {

  beforeEach(() => {
    sinon.stub(dynamodb, "putPlayer").returns(asPromise(undefined))
    sinon.stub(dynamodb, "authenticate").returns(asPromise("<USER ID>"))
  })

  afterEach(() => {
    sinon.restore()
  })

  it("Succeeds with correct input", async () => {
    sinon.stub(dynamodb, "getGame").returns(asPromise(game))
    sinon.stub(dynamodb, "displayNameTaken").returns(asPromise(false))

    const response = await handler(...createMockBody({
      authToken: "<AUTH TOKEN>",
      gameCode: "<GAME CODE>",
      displayName: "valid display name"
    }))
    const body = JSON.parse(response.body)

    expect(response.statusCode).to.equal(200)
    expect(body.message).to.be.undefined
    expect(body.success).to.be.true
  })

  it("Throws error when game doesn't exist", async () => {
    sinon.stub(dynamodb, "getGame").returns(asPromise(null))
    sinon.stub(dynamodb, "displayNameTaken").returns(asPromise(false))

    const response = await handler(...createMockBody({
      authToken: "<AUTH TOKEN>",
      gameCode: "<GAME CODE>",
      displayName: "<DISPLAY NAME>"
    }))

    expect(response.statusCode).to.equal(400)
  })

  it("Throws error when game is in progress already", async () => {
    sinon.stub(dynamodb, "getGame").returns(asPromise({ ...game, started: true }))
    sinon.stub(dynamodb, "displayNameTaken").returns(asPromise(false))

    const response = await handler(...createMockBody({
      authToken: "<AUTH TOKEN>",
      gameCode: "<GAME CODE>",
      displayName: "<DISPLAY NAME>"
    }))

    const body = JSON.parse(response.body)

    expect(body.message).to.equal(constants.strings.gameHasStarted)
    expect(body.success).to.be.false
    expect(response.statusCode).to.equal(200)
  })

  it("Throws expected error when display name is invalid", async () => {
    sinon.stub(dynamodb, "getGame").returns(asPromise(game))
    sinon.stub(dynamodb, "displayNameTaken").returns(asPromise(false))

    const response = await handler(...createMockBody({
      authToken: "<AUTH TOKEN>",
      gameCode: "<GAME CODE>",
      displayName: ";"
    }))

    const body = JSON.parse(response.body)

    expect(body.message).to.equal(constants.strings.displayNameInvalid)
    expect(body.success).to.be.false
    expect(response.statusCode).to.equal(200)
  })

  it("Throws expected error when display name is too long", async () => {
    sinon.stub(dynamodb, "getGame").returns(asPromise(game))
    sinon.stub(dynamodb, "displayNameTaken").returns(asPromise(false))

    const response = await handler(...createMockBody({
      authToken: "<AUTH TOKEN>",
      gameCode: "<GAME CODE>",
      displayName: "a".repeat(100)
    }))


    const body = JSON.parse(response.body)

    expect(body.message).to.equal(constants.strings.displayNameInvalid)
    expect(body.success).to.be.false
    expect(response.statusCode).to.equal(200)
  })

  it("Throws expected error when display name is taken", async () => {
    sinon.stub(dynamodb, "getGame").returns(asPromise(game))
    sinon.stub(dynamodb, "displayNameTaken").returns(asPromise(true))

    const response = await handler(...createMockBody({
      authToken: "<AUTH TOKEN>",
      gameCode: "<GAME CODE>",
      displayName: "<DISPLAY NAME>"
    }))


    const body = JSON.parse(response.body)

    expect(body.message).to.equal(constants.strings.displayNameTaken)
    expect(body.success).to.be.false
    expect(response.statusCode).to.equal(200)
  })
})