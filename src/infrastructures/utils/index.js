/* eslint-disable camelcase */
const mapDBToRegisteredUser = ({
  id,
  full_name,
  email,
  password,
  date_of_birth,
  gender,
  role
}) => ({
  id,
  fullname: full_name,
  email,
  password,
  dateOfBirth: date_of_birth,
  gender,
  role
})

const mapDBToUpdatedUser = ({
  id,
  full_name,
  date_of_birth,
  gender,
}) => ({
  id,
  fullname: full_name,
  dateOfBirth: date_of_birth,
  gender,
})

module.exports = { mapDBToRegisteredUser, mapDBToUpdatedUser }
