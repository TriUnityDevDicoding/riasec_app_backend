/* eslint-disable camelcase */
const mapDBToRegisteredUser = ({
  id,
  full_name,
  email,
  date_of_birth,
  gender
}) => ({
  id,
  fullname: full_name,
  email,
  dateOfBirth: date_of_birth,
  gender
})

module.exports = { mapDBToRegisteredUser }
