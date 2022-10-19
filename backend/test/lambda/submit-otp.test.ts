import { describe, it } from 'mocha'
import { expect } from 'chai'
import sinon from 'sinon'
import * as dynamodb from '../../src/services/dynamodb'
import handler from '../../src/lambda/submit-otp'
import { createMockBody } from './testing-utils'
import constants from '../../src/utils/constants'

afterEach(() => {
  sinon.restore()
})

describe("lambda: submit-otp", () => {
  it("Returns auth token when given correct input", async () => {
    sinon.stub(dynamodb, "verifyOtp").callsFake(async (id: string, otp: string) => {
      expect(id).to.equal("<USER ID>")
      expect(otp).to.equal("<OTP>")
      return "<AUTH TOKEN>"
    })
    const response = await handler(...createMockBody({ id: "<USER ID>", otp: "<OTP>"}))
    const body = JSON.parse(response.body)
    expect(response.statusCode).to.equal(200)
    expect(body).to.deep.equal({
      success: true,
      authToken: "<AUTH TOKEN>"
    })
  })

  it("Returns nothing when not given correct input", async () => {
    sinon.stub(dynamodb, "verifyOtp").returns((async () => null)())
    const response = await handler(...createMockBody({ id: "<USER ID>", otp: "<OTP>"}))
    const body = JSON.parse(response.body)
    expect(response.statusCode).to.equal(200)
    expect(body).to.deep.equal({
      success: false,
      message: constants.strings.otpDne
    })
  })
})