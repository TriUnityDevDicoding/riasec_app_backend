const AddedQuestionsAnswer = require('../added-questions-answer')

describe('A AddedQuestionsAnswer entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {}

    expect(() => new AddedQuestionsAnswer(payload)).toThrow(Error('ADDED_QUESTIONS_ANSWER.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: true
    }

    expect(() => new AddedQuestionsAnswer(payload)).toThrow(Error('ADDED_QUESTIONS_ANSWER.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create addedQuestion object correctly', () => {
    const payload = {
      id: 'questions-answer-123'
    }

    const addedQuestion = new AddedQuestionsAnswer(payload)

    expect(addedQuestion).toBeInstanceOf(AddedQuestionsAnswer)
    expect(addedQuestion.id).toEqual(payload.id)
  })
})
