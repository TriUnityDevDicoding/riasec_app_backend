const AddUserUseCase = require('../../../../applications/use_case/add-user-use-case')
const DetailUserUseCase = require('../../../../applications/use_case/detail-user-use-case')

class UsersHandler {
  constructor (container) {
    this._container = container

    this.postUserHandler = this.postUserHandler.bind(this)
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this)
  }

  async postUserHandler (request, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name)
    const registeredUser = await addUserUseCase.execute(request.payload)

    const response = h.response({
      status: 'success',
      data: {
        registeredUser
      }
    })
    response.code(201)
    return response
  }

  async getUserByIdHandler (request, h) {
    const params = { id: request.params.userId }
    const detailUserUseCase = this._container.getInstance(DetailUserUseCase.name)
    const detailUser = await detailUserUseCase.execute(params)

    const response = h.response({
      status: 'success',
      data: {
        user: detailUser
      }
    })
    response.code(200)
    return response
  }
}

module.exports = UsersHandler
