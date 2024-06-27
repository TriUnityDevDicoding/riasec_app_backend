const NewQuestionsAnswer = require('../../../domains/questions-answers/entities/new-questions-answer')
const AddedQuestionsAnswer = require('../../../domains/questions-answers/entities/added-questions-answer')
const QuestionsAnswerRepository = require('../../../domains/questions-answers/questions-answer-repository')
const QuestionRepository = require('../../../domains/questions/question-repository')
const SessionRepository = require('../../../domains/sessions/session-repository')
const QuizResultRepository = require('../../../domains/quiz-results/quiz-result-repository')
const GroqRepository = require('../../../domains/groq/groq-repository')
const AddQuestionsAnswerUseCase = require('../add-questions-answer-use-case')

describe('AddQuestionsAnswerUseCase', () => {
  it('should orchestrate the add questions and answers action correctly', async () => {
    // Arrange
    const useCasePayload = [
      { questionId: 'question-123', score: 3 },
      { questionId: 'question-234', score: 4 }
    ]
    const credentialId = 'user-123'

    // Mocked entities and repositories
    const mockQuestionsAnswerRepository = new QuestionsAnswerRepository()
    const mockQuestionRepository = new QuestionRepository()
    const mockSessionRepository = new SessionRepository()
    const mockQuizResultRepository = new QuizResultRepository()
    const mockGroqRepository = new GroqRepository()

    // Mock repository methods
    mockQuestionRepository.verifyQuestionExist = jest.fn(() =>
      Promise.resolve([
        { id: 'question-123', categoryName: 'Artistic' },
        { id: 'question-234', categoryName: 'Investigative' }
      ])
    )
    mockSessionRepository.addSession = jest.fn(() => Promise.resolve({ id: 'session-123' }))
    mockQuestionsAnswerRepository.addQuestionsAnswers = jest.fn(() => Promise.resolve([
      { id: 'questions-answer-123'},
      { id: 'questions-answer-234'}
    ]))
    mockQuestionsAnswerRepository.countScores = jest.fn(() =>
      Promise.resolve([
        { _sum: { score: 3 }, category_name: 'Artistic' },
        { _sum: { score: 4 }, category_name: 'Investigative' }
      ])
    )
    mockGroqRepository.beginPrompt = jest.fn(() => Promise.resolve('mocked groq response'))
    mockQuizResultRepository.addQuizResult = jest.fn(() => Promise.resolve({ id: 'quiz-result-123' }))
    mockSessionRepository.putQuizResultId = jest.fn(() => Promise.resolve())

    // Create instance of the use case with mocked dependencies
    const addQuestionsAnswerUseCase = new AddQuestionsAnswerUseCase({
      questionsAnswerRepository: mockQuestionsAnswerRepository,
      questionRepository: mockQuestionRepository,
      sessionRepository: mockSessionRepository,
      quizResultRepository: mockQuizResultRepository,
      groqRepository: mockGroqRepository
    })

    // Act
    const addedQuestionsAnswers = await addQuestionsAnswerUseCase.execute(useCasePayload, credentialId)

    // Assert
    expect(mockQuestionRepository.verifyQuestionExist).toHaveBeenCalledWith(useCasePayload.map(item => new NewQuestionsAnswer(item)))
    expect(mockSessionRepository.addSession).toHaveBeenCalledWith(credentialId)
    expect(mockQuestionsAnswerRepository.addQuestionsAnswers).toHaveBeenCalledWith(
      credentialId,
      expect.any(Array),
      'session-123'
    )
    expect(mockQuestionsAnswerRepository.countScores).toHaveBeenCalledWith('session-123')
    expect(mockGroqRepository.beginPrompt).toHaveBeenCalled()
    expect(mockQuizResultRepository.addQuizResult).toHaveBeenCalledWith(
      credentialId,
      expect.any(Object),
      'mocked groq response',
      'session-123'
    )
    expect(mockSessionRepository.putQuizResultId).toHaveBeenCalledWith('session-123', 'quiz-result-123')
    expect(addedQuestionsAnswers.map(item => new AddedQuestionsAnswer(item))).toEqual([
      new AddedQuestionsAnswer({ id: 'questions-answer-123' }),
      new AddedQuestionsAnswer({ id: 'questions-answer-234' })
    ])
  })
})
