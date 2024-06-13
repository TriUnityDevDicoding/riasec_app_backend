const routes = handler => ([
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler
  },
  {
    method: 'GET',
    path: '/users/{userId}',
    handler: handler.getUserByIdHandler,
    options: {
      auth: 'riasec_app_backend'
    }
  },
  {
    method: 'PUT',
    path: '/users/{userId}',
    handler: handler.putUserByIdHandler,
    options: {
      auth: 'riasec_app_backend'
    }
  }
])

module.exports = routes
