const AddUserUseCase = require('../../../../applications/use_case/add-user-use-case')
const DetailUserUseCase = require('../../../../applications/use_case/detail-user-use-case')
const EditUserUseCase = require('../../../../applications/use_case/edit-user-use-case')
const EditUserPasswordUseCase = require('../../../../applications/use_case/edit-user-password-use-case')
const createLog = require('../../../../infrastructures/logging/winston')

const log = createLog('users')

class UsersHandler {
  constructor(container) {
    this._container = container

    this.postUserHandler = this.postUserHandler.bind(this)
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this)
    this.putUserByIdHandler = this.putUserByIdHandler.bind(this)
    this.putUserPasswordByIdHandler = this.putUserPasswordByIdHandler.bind(this)
  }

  async postUserHandler(request, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name)
    log.info('start request post user, payload => ', JSON.stringify(request.payload))

    const registeredUser = await addUserUseCase.execute(request.payload)
    log.info('user registered successfully')
    const response = h.response({
      status: 'success',
      message: 'user registered successfully.',
      data: {
        user: registeredUser
      }
    })
    response.code(201)
    return response
  }

  async getUserByIdHandler(request, h) {
    const params = { id: request.params.userId }
    const userId = request.auth.credentials.id
    log.info('start request get user by id', params)
    const detailUserUseCase = this._container.getInstance(DetailUserUseCase.name)
    const detailUser = await detailUserUseCase.execute(params, userId)

    log.info('user retrieved successfully')
    const response = h.response({
      status: 'success',
      message: 'user retrieved successfully.',
      data: {
        user: detailUser
      }
    })
    response.code(200)
    return response
  }

  async putUserByIdHandler(request, h) {
    const userId = request.auth.credentials.id
    const { payload } = request
    log.info('start request put user by id, payload =>', JSON.stringify(payload))

    const params = { id: request.params.userId }
    const editUserUseCase = this._container.getInstance(EditUserUseCase.name)
    const editedUser = await editUserUseCase.execute(params, userId, payload)

    log.info('user updated successfully')
    const response = h.response({
      status: 'success',
      message: 'user updated successfully.',
      data: {
        user: editedUser
      }
    })
    response.code(200)
    return response
  }

  async putUserPasswordByIdHandler(request, h) {
    const userId = request.auth.credentials.id
    const { payload } = request
    log.info('start request put user password by id, payload =>', JSON.stringify(payload))

    const params = { id: request.params.userId }
    const editUserPasswordUseCase = this._container.getInstance(EditUserPasswordUseCase.name)
    await editUserPasswordUseCase.execute(params, userId, payload)

    log.info('user password updated successfully')
    const response = h.response({
      status: 'success',
      message: 'user password updated successfully.'
    })
    response.code(200)
    return response
  }
}

module.exports = UsersHandler
