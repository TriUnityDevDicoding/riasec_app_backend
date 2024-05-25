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
  })

  it('should return original error when error message is not needed to translate', () => {
    const error = new Error('some_error_message')

    const translatedError = DomainErrorTranslator.translate(error)

    expect(translatedError).toStrictEqual(error)
  })
})
