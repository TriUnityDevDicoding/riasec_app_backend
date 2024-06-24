class NewQuestionsAnswer {
  constructor(payload) {
    this._verifyPayload(payload)

    this.questionId = payload.questionId
    this.score = payload.score
  }

  _verifyPayload({ questionId, score }) {
    if (!questionId || !score) {
      throw new Error('NEW_QUESTIONS_ANSWER.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof questionId !== 'string' || typeof score !== 'number') {
      throw new Error('NEW_QUESTIONS_ANSWER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = NewQuestionsAnswer
