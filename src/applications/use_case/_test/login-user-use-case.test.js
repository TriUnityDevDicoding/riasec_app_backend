const UserRepository = require('../../../domains/users/user-repository')
const AuthenticationRepository = require('../../../domains/authentications/authentication-repository')
const AuthenticationTokenManager = require('../../security/authentication-token-manager')
const PasswordHash = require('../../security/password-hash')
const DateofBirthParse = require('../../security/date-of-birth-parse')
const LoginUserUseCase = require('../login-user-use-case')
const NewAuth = require('../../../domains/authentications/entities/new-auth')

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      email: 'johndoe@email.com',
      password: 'secret'
    }
    const mockedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token'
    })
    const mockUserRepository = new UserRepository()
    const mockAuthenticationRepository = new AuthenticationRepository()
    const mockAuthenticationTokenManager = new AuthenticationTokenManager()
    const mockPasswordHash = new PasswordHash()
    const mockDateofBirthParse = new DateofBirthParse()

    // Mocking
    mockDateofBirthParse.parseToString = jest.fn(() => Promise.resolve('2000-03-05'))
    mockUserRepository.getUserByEmail = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'user-123',
        fullname: 'John Doe',
        email: 'johndoe@email.com',
        password: 'encrypted_password',
        dateOfBirth: '2000-03-05',
        gender: 'Male'
      }))
    mockPasswordHash.compare = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.accessToken))
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.refreshToken))
    mockAuthenticationRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve())

    // create use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
      dateOfBirthParse: mockDateofBirthParse
    })

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload)

    // Assert
    expect(actualAuthentication).toEqual(new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token'
    }))
    expect(mockDateofBirthParse.parseToString).toHaveBeenCalledWith('2000-03-05')
    expect(mockUserRepository.getUserByEmail)
      .toHaveBeenCalledWith('johndoe@email.com')
    expect(mockPasswordHash.compare)
      .toHaveBeenCalledWith('secret', 'encrypted_password')
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toHaveBeenCalledWith({
        email: 'johndoe@email.com',
        id: 'user-123',
        fullname: 'John Doe',
        dateOfBirth: '2000-03-05',
        gender: 'Male'
      })
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toHaveBeenCalledWith({
        email: 'johndoe@email.com',
        id: 'user-123',
        fullname: 'John Doe',
        dateOfBirth: '2000-03-05',
        gender: 'Male'
      })
    expect(mockAuthenticationRepository.addToken)
      .toHaveBeenCalledWith(mockedAuthentication.refreshToken)
  })
})
