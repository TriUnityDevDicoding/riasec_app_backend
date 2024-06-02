const UpdateUser = require('../update-user')

describe('A UpdateUser entites', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      fullname: 'John Doe',
      gender: 'Male'
    }

    expect(() => new UpdateUser(payload)).toThrow(Error('UPDATE_USER.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specification', async () => {
    const payload = {
      fullname: true,
      dateOfBirth: 'March 5th',
      gender: 'Woman'
    }

    expect(() => new UpdateUser(payload)).toThrow(Error('UPDATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create UpdateUser object correctly with all payload', () => {
    const payload = {
      fullname: 'John Doe',
      dateOfBirth: '2000-03-05',
      gender: 'Male'
    }

    const { fullname, dateOfBirth, gender } = new UpdateUser(payload)

    expect(fullname).toEqual(payload.fullname)
    expect(dateOfBirth).toEqual(payload.dateOfBirth)
    expect(gender).toEqual(payload.gender)
  })
})
