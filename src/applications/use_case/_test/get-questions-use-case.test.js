const GetQuestionsUseCase = require('../get-questions-use-case') // Adjust the path as needed
const QuestionRepository = require('../../../domains/questions/question-repository')

describe('GetQuestionsUseCase', () => {
  it('should retrieve and shuffle questions correctly', async () => {
    // Arrange
    const mockQuestionRepository = new QuestionRepository()
    // Mocking the getQuestionsByCategory method
    mockQuestionRepository.getQuestionsByCategory = jest.fn()
      .mockImplementation(category => Promise.resolve([
        { category, question: 'Question 1' },
        { category, question: 'Question 2' },
        { category, question: 'Question 3' },
        { category, question: 'Question 4' }
      ]))

    const getQuestionsUseCase = new GetQuestionsUseCase({
      questionRepository: mockQuestionRepository
    })

    // Act
    const questions = await getQuestionsUseCase.execute()

    // Assert
    expect(mockQuestionRepository.getQuestionsByCategory).toHaveBeenCalledTimes(6)
    expect(questions.length).toBe(12)
  })
})
