class QuestionsAnswerRepository {
  async addQuestionsAnswers(credentialId, newQuestionsAnswers, sessionId) {
    throw new Error('QUESTIONS_ANSWER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async countScores(sessionId) {
    throw new Error('QUESTIONS_ANSWER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = QuestionsAnswerRepository
