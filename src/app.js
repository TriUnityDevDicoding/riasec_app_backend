const Hapi = require('@hapi/hapi')
require('dotenv').config()

const init = async () => {
  const server = Hapi.server({
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
    port: 3000
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello world! again'
    }
  })

  await server.start()
  console.log('Server running on %s...', server.info.uri)
}

init()
