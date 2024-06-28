class AddedQuestion {
  constructor(payload) {
    this._verifyPayload(payload)

    this.id = payload.id
  }

  _verifyPayload({ id }) {
    if (!id) {
      throw new Error('ADDED_QUESTION.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string') {
      throw new Error('ADDED_QUESTION.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddedQuestion
