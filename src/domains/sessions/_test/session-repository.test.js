const SessionRepository = require('../session-repository')

describe('SessionRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const questionRepository = new SessionRepository()

    // Action & Assert
    await expect(questionRepository.addSession('')).rejects.toThrow(Error('SESSION_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
    await expect(questionRepository.putQuizResultId('', '')).rejects.toThrow(Error('SESSION_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
  })
})
