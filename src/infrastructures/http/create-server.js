const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const ClientError = require('../../commons/exceptions/client-error')
const DomainErrorTranslator = require('../../commons/exceptions/domain-error-translator')
const users = require('../../interfaces/http/api/users')
const authentications = require('../../interfaces/http/api/authentications')
const config = require('../../commons/config')

const createServer = async container => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    debug: config.app.debug
  })

  await server.register([
    {
      plugin: Jwt
    }
  ])

  server.auth.strategy('riasec_app_backend', 'jwt', {
    keys: config.jwt.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.accessTokenAge
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
    {
      plugin: users,
      options: { container }
    },
    {
      plugin: authentications,
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
