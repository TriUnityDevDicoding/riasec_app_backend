const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const ClientError = require('../../commons/exceptions/client-error')
const DomainErrorTranslator = require('../../commons/exceptions/domain-error-translator')
const users = require('../../interfaces/http/api/users')
const authentications = require('../../interfaces/http/api/authentications')
const questions = require('../../interfaces/http/api/questions')
const questionsAnswers = require('../../interfaces/http/api/questions-answers')
const quizResults = require('../../interfaces/http/api/quiz-results')
const config = require('../../commons/config')

const createServer = async (container) => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    debug: config.app.debug,
    routes: {
      cors: {
        origin: [config.app.corsOrigin],
        headers: ['Accept', 'Content-Type', 'Authorization']
      }
    }
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
        id: artifacts.decoded.payload.id,
        role: artifacts.decoded.payload.role
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
    },
    {
      plugin: questions,
      options: { container }
    },
    {
      plugin: questionsAnswers,
      options: { container }
    },
    {
      plugin: quizResults,
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

    const { origin } = request.headers

    if (origin && origin === config.app.corsOrigin) {
      return h.continue
    }

    const newResponse = h.response({
      status: 'fail',
      message: 'Origin not allowed.'
    })
    newResponse.code(403)
    return newResponse
  })

  return server
}

module.exports = createServer
