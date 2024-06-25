const UpdatedUser = require('../updated-user')

describe('A UpdatedUser entitites', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      fullname: 'John Doe',
      email: 'johndoe@email.com',
      dateOfBirth: '2000-03-05',
      gender: 'Male'
    }

    expect(() => new UpdatedUser(payload)).toThrow(Error('UPDATED_USER.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      fullname: 'John Doe',
      email: 'johndoe@email.com',
      dateOfBirth: '2000-03-05',
      gender: 'Man',
      role: 'User'
    }

    expect(() => new UpdatedUser(payload)).toThrow(Error('UPDATED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create updatedUser object correctly', () => {
    const payload = {
      id: 'user-123',
      fullname: 'John Doe',
      email: 'johndoe@email.com',
      dateOfBirth: '2000-03-05',
      gender: 'Male',
      role: 'Admin'
    }

    const updatedUser = new UpdatedUser(payload)

    expect(updatedUser.id).toEqual(payload.id)
    expect(updatedUser.fullname).toEqual(payload.fullname)
    expect(updatedUser.email).toEqual(payload.email)
    expect(updatedUser.dateOfBirth).toEqual(payload.dateOfBirth)
    expect(updatedUser.gender).toEqual(payload.gender)
    expect(updatedUser.role).toEqual(payload.role)
  })
})