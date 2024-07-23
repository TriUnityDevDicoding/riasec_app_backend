const QuizResultRepository = require('../../../domains/quiz-results/quiz-result-repository')
const GetQuizResultUseCase = require('../get-quiz-result-use-case')

describe('GetQuizResultUseCase', () => {
  it('should fetch quiz results correctly', async () => {
    // Arrange
    const credentialId = 'user-123'

    const mockQuizResults = [
      {
        id: 'quiz-result-123',
        owner: 'user-123',
        realistic_score: 5,
        investigative_score: 5,
        artistic_score: 5,
        social_score: 5,
        enterprising_score: 5,
        conventional_score: 5,
        session_id: 'session-123',
        groq_response: 'mocked groq response',
        created_at: '2024-06-22'
      },
      {
        id: 'quiz-result-234',
        owner: 'user-123',
        realistic_score: 5,
        investigative_score: 5,
        artistic_score: 5,
        social_score: 5,
        enterprising_score: 5,
        conventional_score: 5,
        session_id: 'session-234',
        groq_response: 'mocked groq response',
        created_at: '2024-06-22'
      },
    ]

    // Mocking quiz result repository
    const mockQuizResultRepository = new QuizResultRepository()
    mockQuizResultRepository.getQuizResults = jest.fn(() => Promise.resolve(mockQuizResults))

    // Creating use case instance
    const getQuizResultUseCase = new GetQuizResultUseCase({
      quizResultRepository: mockQuizResultRepository
    })

    // Action
    const fetchedResults = await getQuizResultUseCase.execute(credentialId)

    // Assert
    expect(mockQuizResultRepository.getQuizResults).toHaveBeenCalledWith(credentialId)
    expect(fetchedResults).toEqual(mockQuizResults)
  })
})
