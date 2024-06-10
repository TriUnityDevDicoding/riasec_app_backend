const prisma = require('../../database/client/prisma-client')
const UsersTableTestHelper = require('../../../../tests/users-table-test-helper')
const AuthenticationsTableTestHelper = require('../../../../tests/authentications-table-test-helper')
const container = require('../../container')
const createServer = require('../create-server')

describe('/users endpoint', () => {
  let server
  let accessToken
  let addedUser
  const userPayload = {
    fullname: 'Michael Doe',
    email: 'michael@email.com',
    password: 'michaeldoe123',
    dateOfBirth: '2000-09-15',
    gender: 'Male'
  }

  beforeEach(async () => {
    server = await createServer(container)

    const users = await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload
    })
    addedUser = JSON.parse(users.payload).data.user
    const authentications = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        email: userPayload.email,
        password: userPayload.password
      }
    })
    accessToken = JSON.parse(authentications.payload).data.accessToken
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
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

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.user.id).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        fullname: 'John Doe',
        email: 'johndoe@email.com',
        dateOfBirth: 'johndoe123',
        gender: 'Male'
      }

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
        dateOfBirth: 'johndoe123',
        gender: 'Male'
      }

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

    it('should response 400 when email unavailable', async () => {
      await UsersTableTestHelper.addUser({ email: 'johndoe@email.com' })
      const requestPayload = {
        fullname: 'John Doe',
        email: 'johndoe@email.com',
        password: 'johndoe123',
        dateOfBirth: 'johndoe123',
        gender: 'Male'
      }

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

  describe('when GET /users', () => {
    it('should response 200 and persisted detail user', async () => {
      // const user = {
      //   id: 'user-123'
      // }
      // await UsersTableTestHelper.addUser({ ...user })

      const response = await server.inject({
        method: 'GET',
        url: `/users/${addedUser.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toBeDefined()
      expect(responseJson.data.user).toBeDefined()
    })

    it('should response 403 when user does not belong to credential user', async () => {
      const userDummy = {
        id: 'user-111'
      }
      await UsersTableTestHelper.addUser({ ...userDummy })

      const response = await server.inject({
        method: 'GET',
        url: `/users/${userDummy.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('this user does not belong to credential user.')
    })

    it('should response 401 when user does not login', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/users/userId',
        headers: {
          Authorization: 'Bearer accessToken'
        }
      })

      expect(response.statusCode).toStrictEqual(401)
    })

    it('should response 404 when user not found', async () => {
      await UsersTableTestHelper.deleteUserByid(addedUser.id)
      const response = await server.inject({
        method: 'GET',
        url: `/users/${addedUser.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('user data not found.')
    })
  })

  describe('when PUT /users', () => {
    it('should response 200 and persisted update user', async () => {
      const requestPayload = {
        fullname: 'Maria Doe',
        dateOfBirth: '1999-03-05',
        gender: 'Female'
      }

      const response = await server.inject({
        method: 'PUT',
        url: `/users/${addedUser.id}`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toBeDefined()
      expect(responseJson.data.user).toBeDefined()
    })

    it('should response 403 when user does not belong to credential user', async () => {
      const requestPayload = {
        fullname: 'Maria Doe',
        dateOfBirth: '1999-03-05',
        gender: 'Female'
      }
      const userDummy = {
        id: 'user-111'
      }
      await UsersTableTestHelper.addUser({ ...userDummy })

      const response = await server.inject({
        method: 'PUT',
        url: `/users/${userDummy.id}`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('this user does not belong to credential user.')
    })

    it('should response 401 when user does not login', async () => {
      const requestPayload = {
        fullname: 'Maria Doe',
        dateOfBirth: '1999-03-05',
        gender: 'Female'
      }

      const response = await server.inject({
        method: 'PUT',
        url: `/users/${addedUser.id}`,
        payload: requestPayload,
        headers: {
          Authorization: 'Bearer accessToken'
        }
      })

      expect(response.statusCode).toStrictEqual(401)
    })

    it('should response 404 when user not found', async () => {
      await UsersTableTestHelper.deleteUserByid(addedUser.id)
      const requestPayload = {
        fullname: 'Maria Doe',
        dateOfBirth: '1999-03-05',
        gender: 'Female'
      }

      const response = await server.inject({
        method: 'PUT',
        url: `/users/${addedUser.id}`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('user failed to update, id not found.')
    })

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        fullname: 'Maria Doe',
        dateOfBirth: '1999-03-05'
      }

      const response = await server.inject({
        method: 'PUT',
        url: `/users/${addedUser.id}`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('cannot update user: the required properties are missing.')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        fullname: true,
        dateOfBirth: '1999-03-05',
        gender: 'FEMALE'
      }

      const response = await server.inject({
        method: 'PUT',
        url: `/users/${addedUser.id}`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('cannot update user: the data type does not match.')
    })
  })
})
