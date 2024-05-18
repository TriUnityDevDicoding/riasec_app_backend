require('dotenv').config()
module.exports = [
  {
    script: 'src/app.js',
    name: 'riasec_app_backend',
    exec_mode: 'cluster',
    instances: (process.env.PM2_INSTANCES || '1') * 1,
    env: {
      PORT: (process.env.PORT || '3000') * 1,
      NODE_ENV: process.env.NODE_ENV || 'production'
    }
  }
]
