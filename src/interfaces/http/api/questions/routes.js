const routes = handler => ([
  {
    method: 'POST',
    path: '/questions',
    handler: handler.postQuestionHandler,
    options: {
      auth: 'riasec_app_backend'
    }
  },
  {
    method: 'GET',
    path: '/questions',
    handler: handler.getQuestionsHandler
  }
])

module.exports = routes
