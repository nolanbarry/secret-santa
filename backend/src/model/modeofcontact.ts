/** A medium is a mode of communication with a user - either through email or phone number */
export const ModeOfContact = {
  Email: "email",
  PhoneNumber: "phone-number",
  Invalid: "invalid"
} as const

export type ModeOfContact = typeof ModeOfContact[keyof typeof ModeOfContact]

const matching: {[Property in ModeOfContact]?: RegExp} = {
  [ModeOfContact.Email]: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  [ModeOfContact.PhoneNumber]: /\+[0-9]{11,}/,
}

export function getModeOfContact(candidate: string): ModeOfContact {
  for (let [mode, regex] of Object.entries(matching)) {
    if (candidate.match(regex)) {
      return mode as ModeOfContact
    }
  }
  return ModeOfContact.Invalid
}