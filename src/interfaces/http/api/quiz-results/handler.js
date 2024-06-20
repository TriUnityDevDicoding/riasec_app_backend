const GetQuizResultUseCase = require('../../../../applications/use_case/get-quiz-result-use-case')

class QuizResultsHandler {
  constructor (container) {
    this._container = container

    this.getQuizResultsHandler = this.getQuizResultsHandler.bind(this)
  }

  async getQuizResultsHandler (request, h) {
    const getQuizResultUseCase = this._container.getInstance(GetQuizResultUseCase.name)
    const quizResults = await getQuizResultUseCase.execute(request.auth.credentials.id)

    const response = h.response({
      status: 'success',
      message: 'quiz results retrieved successfully.',
      data: {
        quizResults: quizResults
      }
    })
    response.code(201)
    return response
  }
}

module.exports = QuizResultsHandler
