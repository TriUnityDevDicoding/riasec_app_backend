class QuestionRepository {
  async addQuestion(newQuestion) {
    throw new Error('QUESTION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getQuestionsByCategory(category) {
    throw new Error('QUESTION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = QuestionRepository
