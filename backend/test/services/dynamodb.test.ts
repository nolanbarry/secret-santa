import { describe, it, beforeEach } from 'mocha'
import { use, expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { AwsStub, mockClient } from 'aws-sdk-client-mock'
import { DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand, ServiceInputTypes, ServiceOutputTypes, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb';
import { authenticate, getPlayers, getUserIdByContactString, login, verifyOtp, createGame, getPlayersByGame, startGame } from '../../src/services/dynamodb'
import * as modeOfContact from '../../src/model/mode-of-contact'
import * as utils from '../../src/utils/utils'
import constants from '../../src/utils/constants'
import { ExpectedError, HTTPError } from '../../src/model/error'
import { AuthEntry, entryToModel, GameModel, PlayerEntry } from '../../src/model/database-model'

/*
 * Helpful Documentation:
 * AWS SDK Client Mocks: https://m-radzikowski.github.io/aws-sdk-client-mock/#usage
 * Chai as promised plugin: https://www.chaijs.com/plugins/chai-as-promised/
 * Mocking imports: https://railsware.com/blog/mocking-es6-module-import-without-dependency-injection/
 */

use(chaiAsPromised)

let dynamodbMock: AwsStub<ServiceInputTypes, ServiceOutputTypes>

beforeEach(() => {
  dynamodbMock = mockClient(DynamoDBClient)
})

afterEach(() => {
  sinon.restore()
})

describe("dynamodb: getUserIdByContactString()", () => {
  it("Calls email index", async () => {
    const getModeOfContactStub = sinon.stub(modeOfContact, 'getModeOfContact').returns('email')
    dynamodbMock.on(QueryCommand, { IndexName: constants.tables.users.indexes.byEmail.name }).resolvesOnce({
      Items: [
        marshall({ [constants.tables.users.partitionKey]: '<USER-ID>' })
      ]
    })
    // shouldn't use phone number index
    dynamodbMock.on(QueryCommand, { IndexName: constants.tables.users.indexes.byPhoneNumber.name }).rejectsOnce()
    await expect(getUserIdByContactString("email@email.com"), "returns user id").to.eventually.equal('<USER-ID>')
    expect(getModeOfContactStub.calledOnceWithExactly("email@email.com"), "getModeOfContact called once").to.be.true
  })

  it("Calls phone number index", async () => {
    const getModeOfContactStub = sinon.stub(modeOfContact, 'getModeOfContact').returns('phone-number')
    dynamodbMock.on(QueryCommand, { IndexName: constants.tables.users.indexes.byPhoneNumber.name }).resolvesOnce({
      Items: [
        marshall({ [constants.tables.users.partitionKey]: '<USER-ID>' })
      ]
    })
    // shouldn't use phone number index
    dynamodbMock.on(QueryCommand, { IndexName: constants.tables.users.indexes.byEmail.name }).rejectsOnce()
    await expect(getUserIdByContactString("+p (hon)-enu-mber"), "returns user id").to.eventually.equal('<USER-ID>')
    expect(getModeOfContactStub.calledOnceWithExactly("+p (hon)-enu-mber"), "getModeOfContact called once").to.be.true
  })

  it("Throws error if mode of contact is invalid", async () => {
    const getModeOfContactStub = sinon.stub(modeOfContact, 'getModeOfContact').returns('invalid')
    await expect(getUserIdByContactString("not valid"), "throws error").to.eventually.be.rejectedWith(HTTPError)
    expect(getModeOfContactStub.calledOnceWithExactly("not valid"), "getModeOfContact called once").to.be.true
  })

  it("Creates user if one doesn't exist", async () => {
    sinon.stub(modeOfContact, 'getModeOfContact').returns('email')
    sinon.stub(utils, "generateUserId").returns("<GENERATED-USER-ID>")
    dynamodbMock.on(QueryCommand).resolvesOnce({
      Items: []
    })
    dynamodbMock.on(PutItemCommand).resolvesOnce({})
    await expect(getUserIdByContactString('email@email.com'), "returns generated user id").to.eventually.equal('<GENERATED-USER-ID>')
    expect(dynamodbMock.calls().length, "ddb called twice").to.equal(2)
  })
})

describe("dynamodb: login()", () => {
  it("Creates table entry", async () => {
    sinon.stub(utils, "generateRandomString").returns('123456')
    dynamodbMock.on(PutItemCommand).resolves({})
    await expect(login('<USER-ID>')).to.eventually.equal('123456')
    expect(dynamodbMock.commandCalls(PutItemCommand).length, "put item called once").to.equal(1)
  })
})

describe("dynamodb: authenticate()", () => {
  it("Returns user id when auth token exists", async () => {
    dynamodbMock.on(QueryCommand).resolves({
      Items: [marshall({
        id: "<USER ID>",
        otp: "123456",
        "auth-token": "<AUTH TOKEN>",
        "expiration-date": "123456789"
      } as AuthEntry)]
    })

    await expect(authenticate('<AUTH TOKEN>')).to.eventually.equal("<USER ID>")
    expect(dynamodbMock.commandCalls(QueryCommand).length, "query called once").to.equal(1)
    expect(dynamodbMock.commandCalls(UpdateItemCommand).length, "expiration date updated called once").to.equal(1)
  })

  it("Throws error when auth token doesn't exist", async () => {
    dynamodbMock.on(QueryCommand).resolves({ Items: [] })

    await expect(authenticate('an auth token')).to.eventually.be.rejectedWith(ExpectedError)
    expect(dynamodbMock.commandCalls(QueryCommand).length, "query called once").to.equal(1)
    expect(dynamodbMock.commandCalls(UpdateItemCommand).length, "update item not called").to.equal(0)
  })
})

describe("dynamodb: verifyOtp()", () => {
  it("Generates, sets, and returns an auth token", async () => {
    sinon.stub(utils, "generateRandomString").returns("<AUTH TOKEN>")
    dynamodbMock.on(GetItemCommand).resolves({
      Item: marshall({
        id: "<USER ID>",
        otp: "<OTP>",
        "expiration-date": "<EXPIRATION DATE>"
      } as AuthEntry)
    })

    await expect(verifyOtp("<USER ID>", "<OTP>")).to.eventually.equal("<AUTH TOKEN>")
    expect(dynamodbMock.commandCalls(GetItemCommand).length).to.equal(1)
    expect(dynamodbMock.commandCalls(UpdateItemCommand).length).to.equal(1)
  })

  it("Returns null if database entry doesn't exit", async () => {
    dynamodbMock.on(GetItemCommand).resolves({})

    await expect(verifyOtp("<NONEXISTENT USER ID>", "<OTP>")).to.eventually.be.null
    expect(dynamodbMock.commandCalls(GetItemCommand).length).to.equal(1)
    expect(dynamodbMock.commandCalls(UpdateItemCommand).length).to.equal(0)
  })
})

describe("dynamodb: getPlayers()", () => {
  it("Returns players", async () => {
    const samplePlayers: PlayerEntry[] = [
      {
        "display-name": "Player 1",
        "game-code": "<GAME CODE>",
        id: "<USER ID>"
      },
      {
        "display-name": "Player 2",
        "game-code": "<GAME CODE 2>",
        id: "<USER ID>"
      }
    ]
    dynamodbMock.on(QueryCommand).resolves({
      Items: samplePlayers.map(p => marshall(p))
    })

    await expect(getPlayers("<USER ID>")).to.eventually.deep.equal(samplePlayers.map(p => entryToModel(p)))
    expect(dynamodbMock.commandCalls(QueryCommand).length).to.equal(1)
  })

  it("Returns no players", async () => {
    dynamodbMock.on(QueryCommand).resolvesOnce({})
    await expect(getPlayers("<USER ID>")).to.eventually.deep.equal([])
    expect(dynamodbMock.commandCalls(QueryCommand).length).to.equal(1)
    dynamodbMock.reset()

    dynamodbMock.on(QueryCommand).resolvesOnce({ Items: [] })
    await expect(getPlayers("<USER ID>")).to.eventually.deep.equal([])
    expect(dynamodbMock.commandCalls(QueryCommand).length).to.equal(1)
  })
})

describe("dynamodb: createGame()", () => {
  it("Creates a game and player", async () => {
    sinon.stub(utils, "generateRandomString").callsFake((validCharacters: string, length: number) => {
      expect(validCharacters).to.equal(constants.gameCode.validCharacters)
      expect(length).to.equal(constants.gameCode.length)
      return "ABCDEFG"
    })
    dynamodbMock.on(GetItemCommand).resolvesOnce({})

    await expect(createGame("<GAME NAME>", 0, "<HOST ID>", "<HOST DISPLAY NAME>")).to.eventually.equal("ABCDEFG")
    expect(dynamodbMock.commandCalls(GetItemCommand).length).to.equal(1)
    expect(dynamodbMock.commandCalls(PutItemCommand).length).to.equal(2)
  })

  it("Generates game codes until a valid one is found", async () => {
    let calls = 0
    sinon.stub(utils, "generateRandomString").callsFake(() => {
      return (++calls).toString()
    })
    dynamodbMock.on(GetItemCommand).resolvesOnce({Item: {}}).resolvesOnce({Item: {}}).resolvesOnce({Item: {}}).resolves({})

    await expect(createGame("<GAME NAME>", 0, "<HOST ID>", "<HOST DISPLAY NAME>")).to.eventually.equal("4")
    expect(dynamodbMock.commandCalls(GetItemCommand).length).to.equal(4)
  })

  it("Abandons code generation after several successive failures", async () => {
    sinon.stub(utils, "generateRandomString").returns("<GAME CODE>")
    dynamodbMock.on(GetItemCommand).resolves({ Item: {} })

    await expect(createGame("<GAME NAME>", 0, "<HOST ID>", "<HOST DISPLAY NAME>")).to.eventually.be.rejectedWith(HTTPError)
    expect(dynamodbMock.commandCalls(GetItemCommand).length).to.be.greaterThan(10) // don't need to test exact number of calls
  })
})

describe("dynamodb: getPlayersByGame()", () => {
  it("Succeeds when there are multiple players in a game", async () => {
    const samplePlayers: PlayerEntry[] = [
      {
        "display-name": "Player 1",
        "game-code": "<GAME CODE>",
        id: "<USER ID>"
      },
      {
        "display-name": "Player 2",
        "game-code": "<GAME CODE>",
        id: "<USER ID>"
      }
    ]
    dynamodbMock.on(QueryCommand).resolves({
      Items: samplePlayers.map(p => marshall(p))
    })

    await expect(getPlayersByGame("<GAME CODE>")).to.eventually.deep.equal(samplePlayers.map(p => entryToModel(p)))
    expect(dynamodbMock.commandCalls(QueryCommand).length).to.equal(1)
  })
})

describe("dynamodb: startGame()", () => {
  it("Updates game to started", async () => {
    const samplePlayers: PlayerEntry[] = [
      {
        "display-name": "Player 1",
        "game-code": "<GAME CODE>",
        id: "<USER ID>"
      },
      {
        "display-name": "Player 2",
        "game-code": "<GAME CODE>",
        id: "<USER ID>"
      }
    ]
    dynamodbMock.on(QueryCommand).resolves({
      Items: samplePlayers.map(p => marshall(p))
    })

    const sampleGame : GameModel = {
      "displayName" : "<DISPLAY NAME>",
      "code" : "<GAME CODE>",
      "started" : false,
      "hostName": "<HOST NAME>"
    }

    await expect(startGame(sampleGame)).to.eventually.deep.equal(true)
    expect(dynamodbMock.commandCalls(UpdateItemCommand).length, "update item called once").to.equal(1)
  })

})

