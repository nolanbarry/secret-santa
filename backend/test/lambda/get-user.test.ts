import { describe, it } from 'mocha'
import { expect } from 'chai'
import sinon from 'sinon'
import * as dynamodb from '../../src/services/dynamodb'
import handler from '../../src/lambda/get-user'
import { asPromise, createMockBody } from '../testing-utils'
import constants from '../../src/utils/constants'

describe("get user lambda", () => {
  afterEach(() => {
    sinon.restore()
  })

  it("returns user", async () => {
    const authenticateStub = sinon.stub(dynamodb, "authenticate").returns(asPromise("<USER ID>"))
    const getUserStub = sinon.stub(dynamodb, "getUser").returns(asPromise({
      id: "<USER ID>",
      email: "hello@email.com",
      phoneNumber: "phone-number"
    }))

    const response = await handler(...createMockBody({ authToken: "<AUTH TOKEN>"}))
    const body = JSON.parse(response.body)

    expect(response.statusCode).to.equal(200)
    expect(body.user).to.not.be.undefined
    expect(body.success).to.be.undefined

    expect(authenticateStub.calledOnceWith("<AUTH TOKEN>")).to.be.true
    expect(getUserStub.calledOnceWith("<USER ID>")).to.be.true
  })
})