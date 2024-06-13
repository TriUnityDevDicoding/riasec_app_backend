class UpdateUser {
  constructor (payload) {
    this._verifyPayload(payload)
    const { fullname, dateOfBirth, gender } = payload

    this.fullname = fullname
    this.dateOfBirth = dateOfBirth
    this.gender = gender
  }

  _verifyPayload({ fullname, dateOfBirth, gender }) {
    const checkGender = !!(gender !== 'Male' && gender !== 'Female')

    if (!fullname || !dateOfBirth || !gender) {
      throw new Error('UPDATE_USER.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof fullname !== 'string' || typeof dateOfBirth !== 'string' || checkGender) {
      throw new Error('UPDATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = UpdateUser
