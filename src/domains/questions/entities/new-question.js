class NewQuestion {
  constructor(payload) {
    this._verifyPayload(payload)

    this.question = payload.question
    this.category = payload.category
  }

  _verifyPayload({ question, category }) {
    const checkCategory = !!(
      category !== 'Realistic' &&
      category !== 'Investigative' &&
      category !== 'Artistic' &&
      category !== 'Social' &&
      category !== 'Enterprising' &&
      category !== 'Conventional'
    )

    if (!question || !category) {
      throw new Error('NEW_QUESTION.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof question !== 'string' || checkCategory) {
      throw new Error('NEW_QUESTION.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = NewQuestion
