const NewQuestionsAnswer = require('../new-questions-answer')

describe('A NewQuestionsAnswer entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      questionId: 'question-123'
    }

    expect(() => new NewQuestionsAnswer(payload)).toThrow(Error('NEW_QUESTIONS_ANSWER.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      questionId: 'question-123',
      score: true,
      categoryName: 'Social'
    }

    expect(() => new NewQuestionsAnswer(payload)).toThrow(Error('NEW_QUESTIONS_ANSWER.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create newQuestion object correctly', () => {
    const payload = {
      questionId: 'question-123',
      score: 3,
      categoryName: 'Social'
    }

    const newQuestion = new NewQuestionsAnswer(payload)

    expect(newQuestion).toBeInstanceOf(NewQuestionsAnswer)
    expect(newQuestion.questionId).toEqual(payload.questionId)
    expect(newQuestion.score).toEqual(payload.score)
    expect(newQuestion.categoryName).toEqual(payload.categoryName)
  })
})
