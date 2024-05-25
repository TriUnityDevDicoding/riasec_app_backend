const InvariantError = require('./invariant-error')

const DomainErrorTranslator = {
  translate (error) {
    return DomainErrorTranslator._directories[error.message] || error
  }
}

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('cannot create a new user: the required properties are missing.'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('cannot create a new user: the data type does not match.'),
  'REGISTER_USER.INVALID_EMAIL_FORMAT': new InvariantError('cannot create a new user: the email is invalid.')
}

module.exports = DomainErrorTranslator
