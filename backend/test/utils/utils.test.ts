import { describe, it } from 'mocha'
import { fetchJson, generateRandomString, generateUserId, lambda, response, validateRequestBody } from '../../src/utils/utils'
import { expect, use } from 'chai'
import { HTTPError } from '../../src/model/error'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'
import * as sinon from 'sinon'
import * as fetch from 'node-fetch'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import constants from '../../src/utils/constants'

use(sinonChai)
use(chaiAsPromised)

afterEach(() => {
  sinon.restore()
})

describe('utils: validateRequestBody()', () => {
  it('Throws error for no body', function () {
    expect(() => validateRequestBody(null, [])).to.throw(HTTPError)
  })

  it('Throws error for missing attributes', function () {
    expect(() => validateRequestBody("{}", ['foo'])).to.throw(HTTPError)
  })

  it('Throws error for invalid json body', function () {
    expect(() => validateRequestBody("bar", ['foo'])).to.throw(HTTPError)
  })

  it('Returns parsed body with valid input', function () {
    expect(validateRequestBody('{"bar": "foo"}', ["bar"])).deep.equals({ bar: "foo" })
  })
})

describe('utils: generateRandomString()', () => {
  const characters = 'abcdefghijklmnoprstuvwxyz'
  it('Returns a different string every time', () => {
    expect(generateRandomString(characters, 24), 'different across invocations')
      .to.not.equal(generateRandomString(characters, 24))
  })

  it('Returns a string with characters only from given character set', () => {
    let characterSet = new Set(characters.split(""))
    for (let i = 0; i < 25; i++) {
      let randomString = generateRandomString(characters, 100)
      for (let c of randomString) {
        expect(characterSet.has(c), `character ${c} in randomString ${randomString}`).to.be.true
      }
    }
  })

  it('Returns a string of specified length', () => {
    for (let i = 0; i < 1024; i = (i + 1) * 2) {
      expect(generateRandomString(characters, i).length, "length of random string matches input").to.equal(i)
    }
  })
})

describe('utils: generateUserId()', () => {
  it('Returns a different id every time', () => {
    expect(generateUserId()).to.not.equal(generateUserId())
  })
})

describe('utils: fetchJson()', () => {
  it('Returns body on success', async () => {
    sinon.stub(fetch.Response.prototype, 'json').returns(new Promise(resolve => resolve({ hello: 'world' })))

    const fetchStub = sinon.stub(fetch, 'default').returns(new Promise(resolve => {
      resolve(new fetch.Response())
    }))
    await expect(fetchJson('', {}), "fetchJson() returns response").to.eventually.deep.equal({ hello: 'world' })
  })

  it('Throw HTTP error if request fails', async () => {
    sinon.stub(fetch.Response.prototype, 'json').returns(new Promise(resolve => resolve({})))
    sinon.stub(fetch.Response.prototype, 'ok').value(false)
    sinon.stub(fetch.Response.prototype, 'statusText').value('<STATUS-TEXT>')
    sinon.stub(fetch, 'default').returns(new Promise(resolve => resolve(new fetch.Response())))
    await expect(fetchJson('', {}), "fetchJson() throws error").to.eventually.be.rejectedWith(HTTPError)
  })
})

describe('utils: response()', () => {
  it("Creates response with body", () => {
    expect(response(999, { hello: 'world!' })).to.deep.equal({
      statusCode: 999,
      body: JSON.stringify({ hello: 'world!' }),
      headers: constants.corsHeaders
    })
  })

  it("Creates response with no body", () => {
    expect(response(1000)).to.deep.equal({
      statusCode: 1000,
      body: JSON.stringify({}),
      headers: constants.corsHeaders
    })
  })
})

describe('utils: lambda()', () => {
  it("Handles successful return", async () => {
    const handler = async () => { return response(200, { hello: 'world' }) }
    const wrapper = lambda(handler)

    await expect(wrapper({} as APIGatewayProxyEvent, {} as Context), "returns correct response")
      .to.eventually.deep.equal(response(200, { hello: 'world' }))
  })

  it("Handles HTTPError", async () => {
    const handler = async () => { throw new HTTPError(500, "error") }
    const wrapper = lambda(handler)

    await expect(wrapper({} as APIGatewayProxyEvent, {} as Context), "returns correct response")
      .to.eventually.deep.equal(response(500, { message: 'error' }))
  })

  it("Handles unexpected error", async () => {
    const handler = async () => { throw new Error("error") }
    const wrapper = lambda(handler)

    await expect(wrapper({} as APIGatewayProxyEvent, {} as Context), "returns correct response")
      .to.eventually.deep.equal(response(500, { message: "Internal Server Error" }))
  })
})