const NewQuestion = require('../../../domains/questions/entities/new-question')
const AddedQuestion = require('../../../domains/questions/entities/added-question')
const QuestionRepository = require('../../../domains/questions/question-repository')
const AddQuestionUseCase = require('../add-question-use-case')

describe('AddQuestionUseCase', () => {
  it('should orchestrating the add question action correctly', async () => {
    // Arrange
    const useCasePayload = {
      question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain',
      category: 'Social'
    }

    const mockAddedQuestion = new AddedQuestion({
      id: 'question-123'
    })

    /** creating dependency of use case */
    const mockQuestionRepository = new QuestionRepository()

    /** mocking needed function */
    mockQuestionRepository.addQuestion = jest.fn(() => Promise.resolve(mockAddedQuestion))

    /** creating use case instance */
    const getAddQuestionUseCase = new AddQuestionUseCase({
      questionRepository: mockQuestionRepository
    })

    // Action
    const addedQuestion = await getAddQuestionUseCase.execute(useCasePayload)

    // Assert
    expect(addedQuestion).toStrictEqual(new AddedQuestion({
      id: 'question-123'
    }))
    expect(mockQuestionRepository.addQuestion).toHaveBeenCalledWith(new NewQuestion({
      question: useCasePayload.question,
      category: useCasePayload.category
    }))
  })
})
