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
    const mockedUserDateOfBirth = new Date('2000-03-05')
    const mockDateofBirthParse = new DateofBirthParse()

    // Mocking
    mockDateofBirthParse.parseToString = jest.fn(() => Promise.resolve('2000-03-05'))
    mockUserRepository.getPasswordByEmail = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'))
    mockPasswordHash.compare = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.accessToken))
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.refreshToken))
    mockUserRepository.getIdByEmail = jest.fn()
      .mockImplementation(() => Promise.resolve('user-123'))
    mockUserRepository.getFullNameByEmail = jest.fn()
      .mockImplementation(() => Promise.resolve('John Doe'))
    mockUserRepository.getDateOfBirthByEmail = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedUserDateOfBirth))
    mockUserRepository.getGenderByEmail = jest.fn()
      .mockImplementation(() => Promise.resolve('Male'))
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
    expect(mockDateofBirthParse.parseToString).toHaveBeenCalledWith(mockedUserDateOfBirth)
    expect(mockUserRepository.getPasswordByEmail)
      .toHaveBeenCalledWith('johndoe@email.com')
    expect(mockPasswordHash.compare)
      .toHaveBeenCalledWith('secret', 'encrypted_password')
    expect(mockUserRepository.getIdByEmail)
      .toHaveBeenCalledWith('johndoe@email.com')
    expect(mockUserRepository.getFullNameByEmail)
      .toHaveBeenCalledWith('johndoe@email.com')
    expect(mockUserRepository.getDateOfBirthByEmail)
      .toHaveBeenCalledWith('johndoe@email.com')
    expect(mockUserRepository.getGenderByEmail)
      .toHaveBeenCalledWith('johndoe@email.com')
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toHaveBeenCalledWith({ email: 'johndoe@email.com', id: 'user-123', fullname: 'John Doe', dateOfBirth: '2000-03-05', gender: 'Male' })
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toHaveBeenCalledWith({ email: 'johndoe@email.com', id: 'user-123', fullname: 'John Doe', dateOfBirth: '2000-03-05', gender: 'Male' })
    expect(mockAuthenticationRepository.addToken)
      .toHaveBeenCalledWith(mockedAuthentication.refreshToken)
  })
})
