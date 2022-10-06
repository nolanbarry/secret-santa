import { expect } from 'chai'
import { describe, it } from 'mocha'
import { getModeOfContact, ModeOfContact} from '../../src/model/modeofcontact'

const validEmails = [
  "banana@apple.com",
  "bruce.shark@pixar.org",
  "shrek$@example.me",
  "yo#soy#email@a.it",
  "#!%$'&+*-/=?^_.@email.com" // all valid characters in an email
]

const invalidEmails = [
  '"hello"@example.com',
  "@",
  "world@",
  "soy@.sauce",
  "@notanemail.",
  "@spunchbob",
]

const validPhoneNumbers = [
  "+11234567890",
  "+441234567890"
]

const invalidPhoneNumbers = [
  "+1123456789",
  "44123456",
  "1234567890"
]


// email/phone number validation just needs to be good enough: it shouldn't have ANY 
// false negatives (a user with a valid email should never have problems), but a few
// false positives are fine
describe("modeofcontact: getModeOfContact()", () => {
  it("correctly identifies emails", function() {
    for (let validEmail of validEmails) {
      expect(getModeOfContact(validEmail)).to.equal(ModeOfContact.Email)
    }
  })
  it("correctly throws out clearly invalid emails", function() {
    for (let invalidEmail of invalidEmails) {
      expect(getModeOfContact(invalidEmail)).to.equal(ModeOfContact.Invalid)
    }
  })
  it("correctly identifies phone numbers", function() {
    for (let validPhoneNumber of validPhoneNumbers) {
      expect(getModeOfContact(validPhoneNumber)).to.equal(ModeOfContact.PhoneNumber)
    }
  })
  it("correctly throws out clearly invalid phone numbers", function() {
    for (let invalidPhoneNumber of invalidPhoneNumbers) {
      expect(getModeOfContact(invalidPhoneNumber)).to.equal(ModeOfContact.Invalid)
    }
  })
})