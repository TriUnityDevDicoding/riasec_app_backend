const RegisteredUser = require('../registered-user')

describe('A RegisteredUser entitites', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      fullname: 'John Doe',
      email: 'johndoe@email.com',
      dateOfBirth: '2000-03-05',
      gender: 'Male'
    }

    expect(() => new RegisteredUser(payload)).toThrow(Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      fullname: 'John Doe',
      email: 'johndoe@email.com',
      dateOfBirth: '2000-03-05',
      gender: 'Man',
      role: 'Root'
    }

    expect(() => new RegisteredUser(payload)).toThrow(Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create registeredUser object correctly', () => {
    const payload = {
      id: 'user-123',
      fullname: 'John Doe',
      email: 'johndoe@email.com',
      dateOfBirth: '2000-03-05',
      gender: 'Male',
      role: 'User'
    }

    const registeredUser = new RegisteredUser(payload)

    expect(registeredUser.id).toEqual(payload.id)
    expect(registeredUser.fullname).toEqual(payload.fullname)
    expect(registeredUser.email).toEqual(payload.email)
    expect(registeredUser.dateOfBirth).toEqual(payload.dateOfBirth)
    expect(registeredUser.gender).toEqual(payload.gender)
    expect(registeredUser.role).toEqual(payload.role)
  })
})
