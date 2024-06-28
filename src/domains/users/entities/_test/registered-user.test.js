const RegisteredUser = require('../registered-user')

describe('A RegisteredUser entitites', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {}

    expect(() => new RegisteredUser(payload)).toThrow(Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123
    }

    expect(() => new RegisteredUser(payload)).toThrow(Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create registeredUser object correctly', () => {
    const payload = {
      id: 'user-123'
    }

    const registeredUser = new RegisteredUser(payload)

    expect(registeredUser.id).toEqual(payload.id)
  })
})
