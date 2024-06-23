class NewQuestionsAnswer {
  constructor(payload) {
    this._verifyPayload(payload)

    this.questionId = payload.questionId
    this.score = payload.score
    this.categoryName = payload.categoryName
  }

  _verifyPayload({ questionId, score, categoryName }) {
    if (!questionId || !score || !categoryName) {
      throw new Error('NEW_QUESTIONS_ANSWER.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof questionId !== 'string' || typeof score !== 'number' || typeof categoryName !== 'string') {
      throw new Error('NEW_QUESTIONS_ANSWER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = NewQuestionsAnswer
