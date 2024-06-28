class QuizResultRepository {
  async addQuizResult(credentialId, newQuizResult, groqResponse, sessionId) {
    throw new Error('QUIZ_RESULT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getQuizResults(credentialId) {
    throw new Error('QUIZ_RESULT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = QuizResultRepository
