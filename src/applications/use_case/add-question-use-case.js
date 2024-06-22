const NewQuestion = require('../../domains/questions/entities/new-question')

class AddQuestionUseCase {
  constructor({ questionRepository, authorizationCheck }) {
    this._questionRepository = questionRepository
    this._authorizationCheck = authorizationCheck
  }

  async execute(useCasePayload, credentialRole) {
    await this._authorizationCheck.verifyRole(credentialRole)
    const newQuestion = new NewQuestion(useCasePayload)
    return this._questionRepository.addQuestion(newQuestion)
  }
}

module.exports = AddQuestionUseCase
