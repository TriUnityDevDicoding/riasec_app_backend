const AddQuestionUseCase = require('../../../../applications/use_case/add-question-use-case')
const GetQuestionsUseCase = require('../../../../applications/use_case/get-questions-use-case')

class QuestionsHandler {
  constructor (container) {
    this._container = container

    this.postQuestionHandler = this.postQuestionHandler.bind(this)
    this.getQuestionsHandler = this.getQuestionsHandler.bind(this)
  }

  async postQuestionHandler (request, h) {
    const addQuestionUseCase = this._container.getInstance(AddQuestionUseCase.name)
    const addedQuestion = await addQuestionUseCase.execute(request.payload, request.auth.credentials.role)

    const response = h.response({
      status: 'success',
      message: 'question added successfully.',
      data: {
        question: addedQuestion
      }
    })
    response.code(201)
    return response
  }

  async getQuestionsHandler (request, h) {
    const getQuestionsUseCase = this._container.getInstance(GetQuestionsUseCase.name)
    const questions = await getQuestionsUseCase.execute()

    const response = h.response({
      status: 'success',
      message: 'questions retrieved successfully.',
      data: {
        question: questions
      }
    })
    response.code(200)
    return response
  }
}

module.exports = QuestionsHandler
