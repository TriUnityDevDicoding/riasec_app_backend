const DateOfBirthParse = require('../date-of-birth-parse')

describe('DateOfBirthParse interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const dateOfBirthParse = new DateOfBirthParse()

    await expect(dateOfBirthParse.parseToDate('')).rejects.toThrow(Error('DATE_OF_BIRTH_PARSE.METHOD_NOT_IMPLEMENTED'))
    await expect(dateOfBirthParse.parseToString({})).rejects.toThrow(Error('DATE_OF_BIRTH_PARSE.METHOD_NOT_IMPLEMENTED'))
  })
})
