class UpdatedUser {
  constructor (payload) {
    this._verifyPayload(payload)
    const { id, fullname, email, dateOfBirth, gender, role } = payload

    this.id = id
    this.fullname = fullname
    this.email = email
    this.dateOfBirth = dateOfBirth
    this.gender = gender
    this.role = role
  }

  _verifyPayload ({ id, fullname, email, dateOfBirth, gender, role }) {
    const checkGender = !!(gender !== 'Male' && gender !== 'Female')
    const checkRole = !!(role !== 'Admin' && role !== 'User')

    if (!id || !fullname || !email || !dateOfBirth || !gender) {
      throw new Error('UPDATED_USER.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof fullname !== 'string' || typeof email !== 'string' || typeof dateOfBirth !== 'string' || checkGender || checkRole) {
      throw new Error('UPDATED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = UpdatedUser