class RegisterUser {
  constructor (payload) {
    this._verifyPayload(payload)
    const { fullname, email, password, dateOfBirth, gender, role } = payload

    this.fullname = fullname
    this.email = email
    this.password = password
    this.dateOfBirth = dateOfBirth
    this.gender = gender
    this.role = role
  }

  _verifyPayload ({ fullname, email, password, dateOfBirth, gender, role }) {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/
    const checkGender = !!(gender !== 'Male' && gender !== 'Female')
    const checkRole = !!(role !== 'Admin' && role !== 'User')

    if (!fullname || !email || !password || !dateOfBirth || !gender || !role) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof fullname !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof dateOfBirth !== 'string' || checkGender || checkRole) {
      throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    if (!emailRegex.test(email)) {
      throw new Error('REGISTER_USER.INVALID_EMAIL_FORMAT')
    }
  }
}

module.exports = RegisterUser
