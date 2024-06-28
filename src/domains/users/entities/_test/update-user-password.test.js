const UpdateUserPassword = require('../update-user-password')

describe('A UpdateUserPassword entites', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      currentPassword: '123'
    }

    expect(() => new UpdateUserPassword(payload)).toThrow(Error('UPDATE_USER_PASSWORD.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specification', async () => {
    const payload = {
      currentPassword: true,
      newPassword: '234'
    }

    expect(() => new UpdateUserPassword(payload)).toThrow(Error('UPDATE_USER_PASSWORD.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create UpdateUserPassword object correctly with all payload', () => {
    const payload = {
      currentPassword: '123',
      newPassword: '234',
    }

    const { currentPassword, newPassword } = new UpdateUserPassword(payload)

    expect(currentPassword).toEqual(payload.currentPassword)
    expect(newPassword).toEqual(payload.newPassword)
  })
})
