class RegisteredUser {
  constructor (payload) {
    this._verifyPayload(payload)
    const { id, fullname, email, dateOfBirth, gender } = payload

    this.id = id
    this.fullname = fullname
    this.email = email
    this.dateOfBirth = dateOfBirth
    this.gender = gender
  }

  _verifyPayload ({ id, fullname, email, dateOfBirth, gender }) {
    const checkGender = !!(gender !== 'Male' && gender !== 'Female')
    const dateOfBirthObj = new Date(dateOfBirth)

    if (!id || !fullname || !email || !dateOfBirth || !gender) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof fullname !== 'string' || typeof email !== 'string' || !(dateOfBirthObj instanceof Date) || checkGender) {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = RegisteredUser
