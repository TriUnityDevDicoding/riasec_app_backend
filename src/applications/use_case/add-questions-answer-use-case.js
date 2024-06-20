class AddQuestionsAnswerUseCase {
  constructor({ questionsAnswerRepository, questionRepository, sessionRepository, quizResultRepository }) {
    this._questionsAnswerRepository = questionsAnswerRepository
    this._questionRepository = questionRepository
    this._sessionRepository = sessionRepository
    this._quizResultRepository = quizResultRepository
  }

  async execute(useCasePayload, credentialId) {
    await this._questionRepository.verifyQuestionExist(useCasePayload)
    const addedSession = await this._sessionRepository.addSession(credentialId)
    const addedQuestionsAnswers = await this._questionsAnswerRepository.addQuestionsAnswers(credentialId, useCasePayload, addedSession.id)
    const countedScores = await this._questionsAnswerRepository.countScores(addedSession.id)
    const mappedCategory = this._createCategoryMap(countedScores)
    const addedQuizResult = await this._quizResultRepository.addQuizResult(credentialId, mappedCategory, addedSession.id)
    await this._sessionRepository.putQuizResultId(addedSession.id, addedQuizResult.id)

    return addedQuestionsAnswers
  }

  _createCategoryMap(data) {
    const categoryMap = {}
    data.forEach(item => {
      const { _sum: { score }, category_name } = item
      categoryMap[category_name] = score
    })
    return categoryMap
  }
}

module.exports = AddQuestionsAnswerUseCase
