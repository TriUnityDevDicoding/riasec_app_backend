const bcrypt = require('bcrypt')
const AuthenticationError = require('../../../commons/exceptions/authentication-error')
const BcryptPasswordHash = require('../bcrypt-password-hash')
const InvariantError = require('../../../commons/exceptions/invariant-error')

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      const spyHash = jest.spyOn(bcrypt, 'hash')
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt)

      const encryptedPassword = await bcryptPasswordHash.hash('plain_password')

      expect(typeof encryptedPassword).toEqual('string')
      expect(encryptedPassword).not.toEqual('plain_password')
      expect(spyHash).toHaveBeenCalledWith('plain_password', 10)
    })
  })
  describe('compare function', () => {
    it('should throw AuthenticationError if password not match', async () => {
      // Arrange
      const bcryptEncryptionHelper = new BcryptPasswordHash(bcrypt)

      // Act & Assert
      await expect(bcryptEncryptionHelper.compare('plain_password', 'encrypted_password'))
        .rejects
        .toThrow(AuthenticationError)
    })

    it('should not return AuthenticationError if password match', async () => {
      // Arrange
      const bcryptEncryptionHelper = new BcryptPasswordHash(bcrypt)
      const plainPassword = 'secret'
      const encryptedPassword = await bcryptEncryptionHelper.hash(plainPassword)

      // Act & Assert
      await expect(bcryptEncryptionHelper.compare(plainPassword, encryptedPassword))
        .resolves.not.toThrow(AuthenticationError)
    })
  })

  describe('compareSame function', () => {
    it('should throw InvariantError if password match', async () => {
      // Arrange
      const bcryptEncryptionHelper = new BcryptPasswordHash(bcrypt)
      const plainPassword = 'secret'
      const encryptedPassword = await bcryptEncryptionHelper.hash(plainPassword)

      // Act & Assert
      await expect(bcryptEncryptionHelper.compareSame(plainPassword, encryptedPassword))
        .rejects
        .toThrow(InvariantError)
    })

    it('should not throw InvariantError if password not match', async () => {
      // Arrange
      const bcryptEncryptionHelper = new BcryptPasswordHash(bcrypt)
      const plainPassword = 'secret'
      const encryptedPassword = await bcryptEncryptionHelper.hash('terces')

      // Act & Assert
      await expect(bcryptEncryptionHelper.compareSame(plainPassword, encryptedPassword))
        .resolves.not.toThrow(InvariantError)
    })
  })
})
