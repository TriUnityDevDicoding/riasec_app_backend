const NewQuestionsAnswer = require('../../domains/questions-answers/entities/new-questions-answer')

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
    const questionsAnswers = useCasePayload.map(item => new NewQuestionsAnswer(item))
    // return the array of questions if the questions is exist, containing id and categoryName
    const questions = await this._questionRepository.verifyQuestionExist(questionsAnswers)
    const addedSession = await this._sessionRepository.addSession(credentialId)
    // combine the arrays of questions (id, categoryName) with the arrays of questionsAnswer (questionId, score)
    // to avoid having categoryName in payload
    const combinedQuestionsAnswers = this._combineArrays(questionsAnswers, questions)
    const addedQuestionsAnswers = await this._questionsAnswerRepository.addQuestionsAnswers(
      credentialId,
      useCasePayload,
      addedSession.id
    )
    const countedScores = await this._questionsAnswerRepository.countScores(addedSession.id)
    // map the array of counted scores into a callable function to retrieve the score easily for the addQuizResult
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

  _combineArrays(array1, array2) {
    return array1.map((item1) => {
      const matchedItem = array2.find((item2) => item1.questionId === item2.id)
      if (matchedItem) {
        return {
          questionId: item1.questionId,
          score: item1.score,
          categoryName: matchedItem.categoryName
        }
      } else {
        return item1
      }
    })
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
