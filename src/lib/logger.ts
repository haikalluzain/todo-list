import winston from 'winston'
import config from '@config'

const transports: Array<any> = []
if (config.env === config.app.stage.test) {
  transports.push(
    new winston.transports.Console({
      silent: true
    })
  )
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat(),
      )
    })
  )
}

const myFormatter = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

transports.push(
  new winston.transports.File({
    filename: "logs/server.log"
  }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error"
  })
)

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    myFormatter,
    // winston.format.errors({stack: true}),
    // winston.format.simple(),
  ),
  transports
})

export default LoggerInstance
