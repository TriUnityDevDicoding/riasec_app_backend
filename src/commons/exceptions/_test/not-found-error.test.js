const NotFoundError = require('../not-found-error')

describe('NotFoundError', () => {
  it('should create error correctly', () => {
    const notFoundError = new NotFoundError('not found!')

    expect(notFoundError.statusCode).toEqual(404)
    expect(notFoundError.message).toEqual('not found!')
    expect(notFoundError.name).toEqual('NotFoundError')
  })
})
