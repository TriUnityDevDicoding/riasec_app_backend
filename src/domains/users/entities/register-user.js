class RegisterUser {
  constructor (payload) {
    this._verifyPayload(payload)
    const { fullname, email, password, dateOfBirth, gender } = payload

    this.fullname = fullname
    this.email = email
    this.password = password
    this.dateOfBirth = dateOfBirth
    this.gender = gender
  }

  _verifyPayload ({ fullname, email, password, dateOfBirth, gender }) {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/
    const checkGender = !!(gender !== 'Male' && gender !== 'Female')
    const dateOfBirthObj = new Date(dateOfBirth)

    if (!fullname || !email || !password || !dateOfBirth || !gender) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof fullname !== 'string' || typeof email !== 'string' || typeof password !== 'string' || !(dateOfBirthObj instanceof Date) || checkGender) {
      throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    if (!emailRegex.test(email)) {
      throw new Error('REGISTER_USER.INVALID_EMAIL_FORMAT')
    }
  }
}

module.exports = RegisterUser
