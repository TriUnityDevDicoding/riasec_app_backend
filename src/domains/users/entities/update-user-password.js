class UpdateUserPassword {
  constructor (payload) {
    this._verifyPayload(payload)
    const { currentPassword, newPassword } = payload

    this.currentPassword = currentPassword
    this.newPassword = newPassword
  }

  _verifyPayload({ currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
      throw new Error('UPDATE_USER_PASSWORD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      throw new Error('UPDATE_USER_PASSWORD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = UpdateUserPassword
