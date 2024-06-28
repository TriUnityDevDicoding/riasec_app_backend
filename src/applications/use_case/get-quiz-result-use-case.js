class GetQuizResultUseCase {
  constructor({ quizResultRepository }) {
    this._quizResultRepository = quizResultRepository
  }

  async execute(credentialId) {
    return this._quizResultRepository.getQuizResults(credentialId)
  }
}

module.exports = GetQuizResultUseCase
