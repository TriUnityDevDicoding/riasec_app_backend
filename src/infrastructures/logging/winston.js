const winston = require('winston')
const Rotate = require('winston-daily-rotate-file')

const NODE_ENV = process.env.NODE_ENV || 'production'
const LOG_LABEL = process.env.LOG_LABEL || 'console_riasec'
const LOG_KEEP = process.env.LOG_KEEP || '15d'
const LIST_ENV = JSON.parse(process.env.LIST_ENV || '["development"]')
const LOG_ONLY_CONSOLE = process.env.LOG_ONLY_CONSOLE || 'true'

const { combine, timestamp, printf, label } = winston.format

const logFormat = printf(({ level, label, message, timestamp, ...meta }) => {
  return `${timestamp} [${label}] ${level}: ${message} ${meta.meta ? meta.meta : ''}`
})

const transform = function transform(info) {
  const args = info[Symbol.for('splat')]
  if (args) {
    info.meta = args
      .map((v) => {
        if (typeof v !== 'string') {
          try {
            return JSON.stringify(v)
          } catch (e) {
            return null
          }
        }
        return v
      })
      .join(' ')
  }
  return info
}

function createLog(filename, isConsole = false) {
  const logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: `${LOG_LABEL} service` },
    format: combine(
      label({ label: LOG_LABEL }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      { transform },
      logFormat
    ),
    transports: [
      new Rotate({
        filename: `${filename}.%DATE%`,
        dirname: './logs',
        datePattern: 'YYYYMMDD',
        maxFiles: LOG_KEEP
      })
    ]
  })

  if (NODE_ENV === 'production') {
    // console saja yang tampil
    if (LIST_ENV.includes(NODE_ENV) && isConsole) {
      logger.add(new winston.transports.Console())
    }
    // else tidak ada yang tampil
  } else {
    if (LIST_ENV.includes(NODE_ENV)) {
      if (LOG_ONLY_CONSOLE) {
        if (isConsole) logger.add(new winston.transports.Console())
      } else logger.add(new winston.transports.Console())
    }
  }
  return logger
}

module.exports = createLog
