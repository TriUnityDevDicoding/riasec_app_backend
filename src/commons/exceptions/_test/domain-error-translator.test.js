const DomainErrorTranslator = require('../domain-error-translator')
const InvariantError = require('../invariant-error')

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('cannot create a new user: the required properties are missing.'))
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('cannot create a new user: the data type does not match.'))
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.INVALID_EMAIL_FORMAT')))
      .toStrictEqual(new InvariantError('cannot create a new user: the email is invalid.'))
    expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('must send username and password.'))
    expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('username and password must be string.'))
    expect(DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')))
      .toStrictEqual(new InvariantError('must send refresh token.'))
    expect(DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('refresh token must be string.'))
    expect(DomainErrorTranslator.translate(new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')))
      .toStrictEqual(new InvariantError('must send refresh token.'))
    expect(DomainErrorTranslator.translate(new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('refresh token must be string.'))
  })

  it('should return original error when error message is not needed to translate', () => {
    const error = new Error('some_error_message')

    const translatedError = DomainErrorTranslator.translate(error)

    expect(translatedError).toStrictEqual(error)
  })
})
