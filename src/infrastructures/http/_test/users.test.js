const prisma = require('../../database/client/prisma-client')
const UsersTableTestHelper = require('../../../../tests/users-table-test-helper')
const container = require('../../container')
const createServer = require('../create-server')

describe('/users endpoint', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      const requestPayload = {
        fullname: 'John Doe',
        email: 'johndoe@email.com',
        password: 'johndoe123',
        dateOfBirth: '2000-03-05',
        gender: 'Male'
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.registeredUser).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        fullname: 'John Doe',
        email: 'johndoe@email.com',
        dateOfBirth: '2000-03-05',
        gender: 'Male'
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('cannot create a new user: the required properties are missing.')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        fullname: true,
        email: true,
        password: 'johndoe123',
        dateOfBirth: 'March 5th',
        gender: 'Man'
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('cannot create a new user: the data type does not match.')
    })

    it('should response 400 when email does not contain proper domain', async () => {
      const requestPayload = {
        fullname: 'John Doe',
        email: 'johndoe',
        password: 'johndoe123',
        dateOfBirth: '2000-03-05',
        gender: 'Male'
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('cannot create a new user: the email is invalid.')
    })

    it('should response 400 when username unavailable', async () => {
      await UsersTableTestHelper.addUser({ email: 'johndoe@email.com' })
      const requestPayload = {
        fullname: 'John Doe',
        email: 'johndoe@email.com',
        password: 'johndoe123',
        dateOfBirth: '2000-03-05',
        gender: 'Male'
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('email is not available.')
    })
  })
})
