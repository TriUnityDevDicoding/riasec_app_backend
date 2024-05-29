const DateOfBirthParse = require('../../applications/security/date-of-birth-parse')

class BcryptPasswordHash extends DateOfBirthParse {
  async parseToDate (dateOfBirthString) {
    return new Date(dateOfBirthString)
  }

  async parseToString (dateOfBirthObj) {
    const year = dateOfBirthObj.getFullYear()
    const month = String(dateOfBirthObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateOfBirthObj.getDate()).padStart(2, '0')

    const formattedDate = `${year}-${month}-${day}`

    return formattedDate
  }
}

module.exports = BcryptPasswordHash
