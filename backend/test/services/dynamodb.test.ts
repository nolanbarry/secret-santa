import { describe, it, beforeEach } from 'mocha'
import { use, expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { AwsStub, mockClient } from 'aws-sdk-client-mock'
import { DynamoDBClient, PutItemCommand, QueryCommand, ServiceInputTypes, ServiceOutputTypes, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb';
import { authenticate, getUserIdByContactString, login } from '../../src/services/dynamodb'
import sinon from 'sinon'
import * as modeOfContact from '../../src/model/modeofcontact'
import * as utils from '../../src/utils/utils'
import constants from '../../src/utils/constants'
import { HTTPError } from '../../src/model/error'

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
  it("Returns user id when auth token does exist", async () => {
    dynamodbMock.on(QueryCommand).resolves({
      Items: [marshall({
        id: "<USER ID>",
        otp: "123456",
        "auth-token": "<AUTH TOKEN>",
        "expiration-date": "123456789" 
      })]
    })

    await expect(authenticate('<AUTH TOKEN>')).to.eventually.equal("<USER ID>")
    expect(dynamodbMock.commandCalls(QueryCommand).length, "query called once").to.equal(1)
    expect(dynamodbMock.commandCalls(UpdateItemCommand).length, "expiration date updated called once").to.equal(1)
  })

  it("Returns null when auth token doesn't exist", async () => {
    dynamodbMock.on(QueryCommand).resolves({ Items: [] })

    await expect(authenticate('an auth token')).to.eventually.equal(null)
    expect(dynamodbMock.commandCalls(QueryCommand).length, "query called once").to.equal(1)
    expect(dynamodbMock.commandCalls(UpdateItemCommand).length, "update item not called").to.equal(0)
  })

})

