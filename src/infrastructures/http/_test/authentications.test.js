const prisma = require('../../database/client/prisma-client')
const UsersTableTestHelper = require('../../../../tests/users-table-test-helper')
const AuthenticationsTableTestHelper = require('../../../../tests/authentications-table-test-helper')
const container = require('../../container')
const createServer = require('../create-server')
const AuthenticationTokenManager = require('../../../applications/security/authentication-token-manager')

describe('/authentications endpoint', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      // Arrange
      const requestPayload = {
        email: 'johndoe@email.com',
        password: 'johndoe123'
      }
      const server = await createServer(container)
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          fullname: 'John Doe',
          email: 'johndoe@email.com',
          password: 'johndoe123',
          dateOfBirth: '2000-03-05',
          gender: 'Male'
        }
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.accessToken).toBeDefined()
      expect(responseJson.data.refreshToken).toBeDefined()
    })

    it('should response 400 if email not found.', async () => {
      // Arrange
      const requestPayload = {
        email: 'johndoe@email.com',
        password: 'secret'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('user data not found.')
    })

    it('should response 401 if password wrong', async () => {
      // Arrange
      const requestPayload = {
        email: 'johndoe@email.com',
        password: 'wrong_password'
      }
      const server = await createServer(container)
      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          fullname: 'John Doe',
          email: 'johndoe@email.com',
          password: 'johndoe123',
          dateOfBirth: '2000-03-05',
          gender: 'Male'
        }
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('the credentials you entered are incorrect.')
    })

    it('should response 400 if login payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        email: 'johndoe@email.com'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('must send username and password.')
    })

    it('should response 400 if login payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        email: 123,
        password: 'secret'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('username and password must be string.')
    })
  })

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      // Arrange
      const server = await createServer(container)
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          fullname: 'John Doe',
          email: 'johndoe@email.com',
          password: 'johndoe123',
          dateOfBirth: '2000-03-05',
          gender: 'Male'
        }
      })
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          email: 'johndoe@email.com',
          password: 'johndoe123'
        }
      })
      const { data: { refreshToken } } = JSON.parse(loginResponse.payload)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.accessToken).toBeDefined()
    })

    it('should return 400 payload not contain refresh token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {}
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('must send refresh token.')
    })

    it('should return 400 if refresh token not string', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 123
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token must be string.')
    })

    it('should return 400 if refresh token not valid', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 'invalid_refresh_token'
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token is not valid.')
    })

    it('should return 400 if refresh token not registered in database', async () => {
      // Arrange
      const server = await createServer(container)
      const refreshToken = await container.getInstance(AuthenticationTokenManager.name).createRefreshToken({ email: 'johndoe@email.com' })

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token not found in database.')
    })
  })

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      // Arrange
      const server = await createServer(container)
      const refreshToken = 'refresh_token'
      await AuthenticationsTableTestHelper.addToken(refreshToken)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })

    it('should response 400 if refresh token not registered in database', async () => {
      // Arrange
      const server = await createServer(container)
      const refreshToken = 'refresh_token'

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token not found in database.')
    })

    it('should response 400 if payload not contain refresh token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {}
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('must send refresh token.')
    })

    it('should response 400 if refresh token not string', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: 123
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token must be string.')
    })
  })
})
