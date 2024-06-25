const routes = handler => ([
  {
    method: 'GET',
    path: '/quiz-results',
    handler: handler.getQuizResultsHandler,
    options: {
      auth: 'riasec_app_backend'
    }
  }
])

module.exports = routes
