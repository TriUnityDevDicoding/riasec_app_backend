const routes = handler => ([
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler
  },
  {
    method: 'GET',
    path: '/users/{userId}',
    handler: handler.getUserByIdHandler
  },
  {
    method: 'PUT',
    path: '/users/{userId}',
    handler: handler.putUserByIdHandler
  }
])

module.exports = routes
