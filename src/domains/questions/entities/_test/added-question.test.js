const AddedQuestion = require('../added-question')

describe('A AddedQuestion entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {}

    expect(() => new AddedQuestion(payload)).toThrow(Error('ADDED_QUESTION.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: true
    }

    expect(() => new AddedQuestion(payload)).toThrow(Error('ADDED_QUESTION.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create addedQuestion object correctly', () => {
    const payload = {
      id: 'question-123'
    }

    const addedQuestion = new AddedQuestion(payload)

    expect(addedQuestion).toBeInstanceOf(AddedQuestion)
    expect(addedQuestion.id).toEqual(payload.id)
  })
})
