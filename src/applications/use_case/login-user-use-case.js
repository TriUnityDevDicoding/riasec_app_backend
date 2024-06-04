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
    const encryptedPassword = await this._userRepository.getPasswordByEmail(email)
    await this._passwordHash.compare(password, encryptedPassword)
    const id = await this._userRepository.getIdByEmail(email)
    const fullname = await this._userRepository.getFullNameByEmail(email)
    const dateOfBirth = await this._userRepository.getDateOfBirthByEmail(email)
    const parsedToStringDateOfBirth = await this._dateOfBirthParse.parseToString(dateOfBirth)
    const gender = await this._userRepository.getGenderByEmail(email)

    const accessToken = await this._authenticationTokenManager
      .createAccessToken({ email, id, fullname, dateOfBirth: parsedToStringDateOfBirth, gender })
    const refreshToken = await this._authenticationTokenManager
      .createRefreshToken({ email, id, fullname, dateOfBirth: parsedToStringDateOfBirth, gender })

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken
    })

    await this._authenticationRepository.addToken(newAuthentication.refreshToken)

    return newAuthentication
  }
}

module.exports = LoginUserUseCase
