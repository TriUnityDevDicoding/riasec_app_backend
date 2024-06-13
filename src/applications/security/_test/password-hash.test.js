const PasswordHash = require('../password-hash')

describe('PasswordHash interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const passwordHash = new PasswordHash()

    await expect(passwordHash.hash('dummy_password')).rejects.toThrow(Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED'))
    await expect(passwordHash.compare('plain_passaword', 'encrypted_password')).rejects.toThrow(Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED'))
  })
})
