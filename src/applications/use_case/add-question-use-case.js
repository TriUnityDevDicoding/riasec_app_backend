const NewQuestion = require('../../domains/questions/entities/new-question')

class AddQuestionUseCase {
  constructor({ questionRepository }) {
    this._questionRepository = questionRepository
  }

  async execute(useCasePayload) {
    const newQuestion = new NewQuestion(useCasePayload)
    return this._questionRepository.addQuestion(newQuestion)
  }
}

module.exports = AddQuestionUseCase
