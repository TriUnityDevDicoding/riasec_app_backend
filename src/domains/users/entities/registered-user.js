class RegisteredUser {
  constructor (payload) {
    this._verifyPayload(payload)
    const { id } = payload

    this.id = id
  }

  _verifyPayload ({ id }) {
    if (!id) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string') {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = RegisteredUser
