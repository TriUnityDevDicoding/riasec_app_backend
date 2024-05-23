/* istanbul ignore file */
const dotenv = require('dotenv')
const path = require('path')

if (process.env.NODE_ENV === 'test') {
  dotenv.config({
    path: path.resolve(process.cwd(), '.test.env')
  })
} else {
  dotenv.config()
}

const config = {
  app: {
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : process.env.HOST,
    port: process.env.PORT,
    debug: process.env.NODE_ENV === 'development' ? { request: ['error'] } : {}
  },
  jwt: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_KEY
  }
}

module.exports = config
