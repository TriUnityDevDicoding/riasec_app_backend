const RegisterUser = require('../register-user')

describe('A RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      fullname: 'John Doe',
      email: 'johndoe@email.com',
      dateOfBirth: '2000-03-05',
      gender: 'Male'
    }

    expect(() => new RegisterUser(payload)).toThrow(Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      fullname: true,
      email: true,
      password: 'johndoe123',
      dateOfBirth: 'March 5th',
      gender: 'Man'
    }

    expect(() => new RegisterUser(payload)).toThrow(Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should throw error when email does not contain proper domain', () => {
    const payload = {
      fullname: 'John Doe',
      email: 'johndoe',
      password: 'johndoe123',
      dateOfBirth: '2000-03-05',
      gender: 'Male'
    }

    expect(() => new RegisterUser(payload)).toThrow(Error('REGISTER_USER.INVALID_EMAIL_FORMAT'))
  })

  it('should create resgisterUser object correctly', () => {
    const payload = {
      fullname: 'John Doe',
      email: 'johndoe@email.com',
      password: 'johndoe123',
      dateOfBirth: '2000-03-05',
      gender: 'Male'
    }

    const { fullname, email, password, dateOfBirth, gender } = new RegisterUser(payload)

    expect(fullname).toEqual(payload.fullname)
    expect(email).toEqual(payload.email)
    expect(password).toEqual(payload.password)
    expect(dateOfBirth).toEqual(payload.dateOfBirth)
    expect(gender).toEqual(payload.gender)
  })
})
