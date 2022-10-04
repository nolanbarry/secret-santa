import { describe, it } from 'mocha'
import { validateRequestBody } from '../../src/utils/utils'
import { expect } from 'chai'
import { HTTPError } from '../../src/model/error'

describe('validateRequestBody()', () => {
  it('Throws error for no body', function() {
    expect(() => validateRequestBody(null, [])).to.throw(HTTPError)
  })

  it('Throws error for missing attributes', function() {
    expect(() => validateRequestBody("{}", ['foo'])).to.throw(HTTPError)
  })

  it('Throws error for invalid json body', function() {
    expect(() => validateRequestBody("bar", ['foo'])).to.throw(HTTPError)
  })

  it('Returns parsed body with valid input', function() {
    expect(validateRequestBody('{"bar": "foo"}', ["bar"])).deep.equals({bar: "foo"})
  })
})