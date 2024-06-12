const NewQuestion = require('../new-question')

describe('A NewQuestion entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain'
    }

    expect(() => new NewQuestion(payload)).toThrow(Error('NEW_QUESTION.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain',
      category: 'Socialism'
    }

    expect(() => new NewQuestion(payload)).toThrow(Error('NEW_QUESTION.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create newQuestion object correctly', () => {
    const payload = {
      question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain',
      category: 'Social'
    }

    const newQuestion = new NewQuestion(payload)

    expect(newQuestion).toBeInstanceOf(NewQuestion)
    expect(newQuestion.question).toEqual(payload.question)
    expect(newQuestion.category).toEqual(payload.category)
  })
})
