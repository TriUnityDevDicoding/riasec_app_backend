const UpdateUser = require('../update-user')

describe('A UpdateUser entites', () => {
  it('should throw error when payload did not meet data type specification', async () => {
    const payload = {
      fullname: true,
      password: 'johndoe123',
      dateOfBirth: 'March 5th',
      gender: 'Woman'
    }

    expect(() => new UpdateUser(payload)).toThrow(Error('UPDATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create UpdateUser object correctly with partial payload', async () => {
    const payload = {
      fullname: 'John Doe',
      dateOfBirth: '2000-03-05'
    }

    const { fullname, dateOfBirth } = new UpdateUser(payload)

    expect(fullname).toEqual(payload.fullname)
    expect(dateOfBirth).toEqual(payload.dateOfBirth)
  })

  it('should create UpdateUser object correctly with all payload', () => {
    const payload = {
      fullname: 'John Doe',
      password: 'johndoe123',
      dateOfBirth: '2000-03-05',
      gender: 'Male'
    }

    const { fullname, password, dateOfBirth, gender } = new UpdateUser(payload)

    expect(fullname).toEqual(payload.fullname)
    expect(password).toEqual(payload.password)
    expect(dateOfBirth).toEqual(payload.dateOfBirth)
    expect(gender).toEqual(payload.gender)
  })
})
