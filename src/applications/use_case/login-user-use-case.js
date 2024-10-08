const UserLogin = require('../../domains/users/entities/user-login')
const NewAuthentication = require('../../domains/authentications/entities/new-auth')

class LoginUserUseCase {
  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
    dateOfBirthParse
  }) {
    this._userRepository = userRepository
    this._authenticationRepository = authenticationRepository
    this._authenticationTokenManager = authenticationTokenManager
    this._passwordHash = passwordHash
    this._dateOfBirthParse = dateOfBirthParse
  }

  async execute(useCasePayload) {
    const { email, password } = new UserLogin(useCasePayload)
    const user = await this._userRepository.getUserByEmail(email)
    const encryptedPassword = user.password
    await this._passwordHash.compare(password, encryptedPassword)
    const dateOfBirth = await this._dateOfBirthParse.parseToString(user.dateOfBirth)
    const { id, fullname, gender, role } = user

    const accessToken = await this._authenticationTokenManager.createAccessToken({
      email,
      id,
      fullname,
      dateOfBirth,
      gender,
      role
    })
    const refreshToken = await this._authenticationTokenManager.createRefreshToken({
      email,
      id,
      fullname,
      dateOfBirth,
      gender,
      role
    })

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken
    })

    await this._authenticationRepository.addToken(newAuthentication.refreshToken)

    return newAuthentication
  }
}

module.exports = LoginUserUseCase
