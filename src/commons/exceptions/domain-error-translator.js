const InvariantError = require('./invariant-error')

const DomainErrorTranslator = {
  translate (error) {
    return DomainErrorTranslator._directories[error.message] || error
  }
}

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('cannot create a new user: the required properties are missing.'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('cannot create a new user: the data type does not match.'),
  'REGISTER_USER.INVALID_EMAIL_FORMAT': new InvariantError('cannot create a new user: the email is invalid.'),
  'UPDATE_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('cannot update user: the required properties are missing.'),
  'UPDATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('cannot update user: the data type does not match.'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('must send username and password.'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username and password must be string.'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('must send refresh token.'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token must be string.'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('must send refresh token.'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token must be string.'),
  'NEW_QUESTION.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('cannot create a new question: the required properties are missing.'),
  'NEW_QUESTION.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('cannot create a new question: the data type does not match.'),
  'UPDATE_USER_PASSWORD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('cannot update user password: the required properties are missing.'),
  'UPDATE_USER_PASSWORD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('cannot update user password: the data type does not match.')
}

module.exports = DomainErrorTranslator
