const QuizResultRepository = require('../quiz-result-repository')

describe('QuizResultRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const questionRepository = new QuizResultRepository()

    // Action & Assert
    await expect(questionRepository.addQuizResult('', {}, '')).rejects.toThrow(Error('QUIZ_RESULT_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
  })
})
