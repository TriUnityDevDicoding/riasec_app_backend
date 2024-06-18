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

module.exports = { mapDBToRegisteredUser }
