const NewQuestionsAnswer = require('../../domains/questions-answers/entities/new-questions-answer')

class AddQuestionsAnswerUseCase {
  constructor({ questionsAnswerRepository, questionRepository, sessionRepository, quizResultRepository }) {
    this._questionsAnswerRepository = questionsAnswerRepository
    this._questionRepository = questionRepository
    this._sessionRepository = sessionRepository
    this._quizResultRepository = quizResultRepository
  }

  async execute(useCasePayload, credentialId) {
    const questionsAnswers = useCasePayload.map(item => new NewQuestionsAnswer(item))
    // return the array of questions if the questions is exist, containing id and categoryName
    const questions = await this._questionRepository.verifyQuestionExist(questionsAnswers)
    const addedSession = await this._sessionRepository.addSession(credentialId)
    // combine the arrays of questions (id, categoryName) with the arrays of questionsAnswer (questionId, score)
    // to avoid having categoryName in payload
    const combinedQuestionsAnswers = this._combineArrays(questionsAnswers, questions)
    const addedQuestionsAnswers = await this._questionsAnswerRepository.addQuestionsAnswers(credentialId, combinedQuestionsAnswers, addedSession.id)
    const countedScores = await this._questionsAnswerRepository.countScores(addedSession.id)
    // map the array of counted scores into a callable function to retrieve the score easily for the addQuizResult
    const mappedCategory = this._createCategoryMap(countedScores)
    const addedQuizResult = await this._quizResultRepository.addQuizResult(credentialId, mappedCategory, addedSession.id)
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
}

module.exports = AddQuestionsAnswerUseCase
