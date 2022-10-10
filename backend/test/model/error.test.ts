import { expect } from "chai";
import { describe, it } from "mocha";
import { ExpectedError } from "../../src/model/error";

describe("error: ExpectedError class", () => {
  it("ExpectedError.body property is correct", () => {
    let error = new ExpectedError("You did it wrong!")
    expect(error.body, "body is correct").to.deep.equal({
      message: "You did it wrong!",
      success: false
    })
    expect(error.statusCode, "status code is 200").to.equal(200)
  })
})