const Hapi = require('@hapi/hapi')

const init = async () => {
  const server = Hapi.server({
    host: 'localhost',
    port: 3000
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello world!'
    }
  })

  await server.start()
  console.log('Server running on %s...', server.info.uri)
}

init()