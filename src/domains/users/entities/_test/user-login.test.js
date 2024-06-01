const UserLogin = require('../user-login')

describe('UserLogin entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      email: 'johndoe@email.com'
    }

    // Action & Assert
    expect(() => new UserLogin(payload)).toThrow(Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      email: 'johndoe@email.com',
      password: 12345
    }

    // Action & Assert
    expect(() => new UserLogin(payload)).toThrow(Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create UserLogin entities correctly', () => {
    // Arrange
    const payload = {
      email: 'johndoe@email.com',
      password: '12345'
    }

    // Action
    const userLogin = new UserLogin(payload)

    // Assert
    expect(userLogin).toBeInstanceOf(UserLogin)
    expect(userLogin.email).toEqual(payload.email)
    expect(userLogin.password).toEqual(payload.password)
  })
})
