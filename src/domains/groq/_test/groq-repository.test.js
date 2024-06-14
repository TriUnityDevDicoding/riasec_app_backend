const GroqRepository = require('../groq-repository')

describe('GroqRepository interface', () => {
  it('should throw an error when invoke abstract behaviour', async () => {
    const groqRepository = new GroqRepository()

    await expect(() => groqRepository.beginPrompt('')).rejects.toThrow(Error('GROQ_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
  })
})
