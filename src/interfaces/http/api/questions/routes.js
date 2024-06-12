const routes = handler => ([
  {
    method: 'POST',
    path: '/questions',
    handler: handler.postQuestionHandler
  },
  {
    method: 'GET',
    path: '/questions',
    handler: handler.getQuestionsHandler
  }
])

module.exports = routes
