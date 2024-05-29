const ParsingDateOfBirth = require('../parsing-date-of-birth')

describe('ParsingDateOfBirth', () => {
  describe('parseToDate function', () => {
    it('should parsing dateOfBirth to Date() correctly', async () => {
      const dateOfBirth = '2000-03-05'
      const parsingDateOfBirth = new ParsingDateOfBirth()

      const parsedDateOfBirth = await parsingDateOfBirth.parseToDate(dateOfBirth)

      expect(typeof dateOfBirth).toStrictEqual('string')
      expect(parsedDateOfBirth).toBeInstanceOf(Date)
    })
  })

  describe('parseToString function', () => {
    it('should parsing dateOfBirth to String correctly', async () => {
      const dateOfBirth = new Date('2000-03-05')
      const parsingDateOfBirth = new ParsingDateOfBirth()

      const parsedDateOfBirth = await parsingDateOfBirth.parseToString(dateOfBirth)

      expect(typeof parsedDateOfBirth).toStrictEqual('string')
      expect(dateOfBirth).toBeInstanceOf(Date)
    })
  })
})
