const Hapi = require('@hapi/hapi')
const ClientError = require('../../commons/exceptions/client-error')
const DomainErrorTranslator = require('../../commons/exceptions/domain-error-translator')
const users = require('../../interfaces/http/api/users')
const config = require('../../commons/config')

const createServer = async container => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    debug: config.app.debug
  })

  await server.register([
    {
      plugin: users,
      options: { container }
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response)

      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message
        })
        newResponse.code(translatedError.statusCode)
        return newResponse
      }

      if (!translatedError.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'error',
        message: 'server failure.'
      })
      newResponse.code(500)
      return newResponse
    }

    return h.continue
  })

  return server
}

module.exports = createServer
