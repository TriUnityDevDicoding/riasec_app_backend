const QuestionRepository = require('../question-repository')

describe('QuestionRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const questionRepository = new QuestionRepository()

    // Action & Assert
    await expect(questionRepository.addQuestion({})).rejects.toThrow(Error('QUESTION_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
    await expect(questionRepository.getQuestionsByCategory('')).rejects.toThrow(Error('QUESTION_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
    await expect(questionRepository.verifyQuestionExist({})).rejects.toThrow(Error('QUESTION_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
  })
})
