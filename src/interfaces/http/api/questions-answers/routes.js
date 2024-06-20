const routes = handler => ([
  {
    method: 'POST',
    path: '/questions/answers',
    handler: handler.postQuestionsAnswersHandler,
    options: {
      auth: 'riasec_app_backend'
    }
  }
])

module.exports = routes
