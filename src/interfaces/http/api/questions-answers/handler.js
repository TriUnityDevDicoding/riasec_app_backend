const AddQuestionsAnswerUseCase = require('../../../../applications/use_case/add-questions-answer-use-case')

class QuestionsAnswersHandler {
  constructor (container) {
    this._container = container

    this.postQuestionsAnswersHandler = this.postQuestionsAnswersHandler.bind(this)
  }

  async postQuestionsAnswersHandler (request, h) {
    const addQuestionsAnswerUseCase = this._container.getInstance(AddQuestionsAnswerUseCase.name)
    const addedQuestionsAnswers = await addQuestionsAnswerUseCase.execute(request.payload, request.auth.credentials.id)

    const response = h.response({
      status: 'success',
      message: 'questions answers added successfully.',
      data: {
        questionsAnswers: addedQuestionsAnswers
      }
    })
    response.code(201)
    return response
  }
}

module.exports = QuestionsAnswersHandler
