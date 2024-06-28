const QuestionsAnswerRepository = require('../questions-answer-repository')

describe('QuestionsAnswerRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const questionRepository = new QuestionsAnswerRepository()

    // Action & Assert
    await expect(questionRepository.addQuestionsAnswers('', {}, '')).rejects.toThrow(Error('QUESTIONS_ANSWER_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
    await expect(questionRepository.countScores('')).rejects.toThrow(Error('QUESTIONS_ANSWER_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
  })
})
