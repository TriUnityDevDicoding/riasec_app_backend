const GetQuizResultUseCase = require('../../../../applications/use_case/get-quiz-result-use-case')
const createLog = require('../../../../infrastructures/logging/winston')

const log = createLog('quiz-result')
class QuizResultsHandler {
  constructor(container) {
    this._container = container

    this.getQuizResultsHandler = this.getQuizResultsHandler.bind(this)
  }

  async getQuizResultsHandler(request, h) {
    const getQuizResultUseCase = this._container.getInstance(GetQuizResultUseCase.name)
    log.info('start request get quiz result')

    const quizResultsData = await getQuizResultUseCase.execute(request.auth.credentials.id)
    log.info('quiz results retrieved successfully')
    const response = h.response({
      status: 'success',
      message: 'quiz results retrieved successfully.',
      data: {
        quizResults: quizResultsData
      }
    })
    response.code(200)
    return response
  }
}

module.exports = QuizResultsHandler
