const createServer = require('../create-server')

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    const server = await createServer({})

    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute'
    })

    expect(response.statusCode).toEqual(404)
  })

  it('should handle server error correctly', async () => {
    const requestPayload = {
      fullname: 'John Doe',
      email: 'johndoe@email.com',
      password: 'johndoe123',
      dateOfBirth: new Date('2000-03-05'),
      gender: 'Male'
    }
    const server = await createServer({})

    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload
    })

    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(500)
    expect(responseJson.status).toEqual('error')
    expect(responseJson.message).toEqual('server failure.')
  })
})
