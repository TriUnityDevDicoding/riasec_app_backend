class AddQuestionsAnswerUseCase {
  constructor({
    questionsAnswerRepository,
    questionRepository,
    sessionRepository,
    quizResultRepository,
    groqRepository
  }) {
    this._questionsAnswerRepository = questionsAnswerRepository
    this._questionRepository = questionRepository
    this._sessionRepository = sessionRepository
    this._quizResultRepository = quizResultRepository
    this._groqRepository = groqRepository
  }

  async execute(useCasePayload, credentialId) {
    await this._questionRepository.verifyQuestionExist(useCasePayload)
    const addedSession = await this._sessionRepository.addSession(credentialId)
    const addedQuestionsAnswers = await this._questionsAnswerRepository.addQuestionsAnswers(
      credentialId,
      useCasePayload,
      addedSession.id
    )
    const countedScores = await this._questionsAnswerRepository.countScores(addedSession.id)
    const mappedCategory = this._createCategoryMap(countedScores)

    const realisticPercentage = this._percentageScore(mappedCategory.Realistic, mappedCategory)
    const investigativePercentage = this._percentageScore(mappedCategory.Investigative, mappedCategory)
    const artisticPercentage = this._percentageScore(mappedCategory.Artistic, mappedCategory)
    const socialPercentage = this._percentageScore(mappedCategory.Social, mappedCategory)
    const enterprisingPercentage = this._percentageScore(mappedCategory.Enterprising, mappedCategory)
    const conventionalPercentage = this._percentageScore(mappedCategory.Conventional, mappedCategory)

    let groqResponse
    try {
      groqResponse = await this._groqRepository.beginPrompt(
        realisticPercentage,
        investigativePercentage,
        artisticPercentage,
        socialPercentage,
        enterprisingPercentage,
        conventionalPercentage
      )
    } catch (error) {
      groqResponse = null
    }
    const addedQuizResult = await this._quizResultRepository.addQuizResult(
      credentialId,
      mappedCategory,
      groqResponse,
      addedSession.id
    )
    await this._sessionRepository.putQuizResultId(addedSession.id, addedQuizResult.id)

    return addedQuestionsAnswers
  }

  _createCategoryMap(data) {
    const categoryMap = {}
    data.forEach((item) => {
      const {
        _sum: { score },
        category_name
      } = item
      categoryMap[category_name] = score
    })
    return categoryMap
  }

  _percentageScore(categoryScore, mappedCategory) {
    const sum = Object.values(mappedCategory).reduce((acc, score) => acc + score, 0)
    const percentage = ((categoryScore / sum) * 100).toFixed(1)
    return percentage
  }
}

module.exports = AddQuestionsAnswerUseCase
