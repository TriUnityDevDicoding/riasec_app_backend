class UpdateUser {
  constructor (payload) {
    this._verifyPayload(payload)
    const { fullname, password, dateOfBirth, gender } = payload

    this.fullname = fullname
    this.password = password
    this.dateOfBirth = dateOfBirth
    this.gender = gender
  }

  _verifyPayload({ fullname, password, dateOfBirth, gender }) {
    if (fullname !== undefined && typeof fullname !== 'string') {
      throw new Error('UPDATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
    if (password !== undefined && typeof password !== 'string') {
      throw new Error('UPDATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
    if (dateOfBirth !== undefined && typeof dateOfBirth !== 'string') {
      throw new Error('UPDATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
    if (gender !== undefined && (gender !== 'Male' && gender !== 'Female')) {
      throw new Error('UPDATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = UpdateUser
