import hapiPino from 'hapi-pino'

import { appConfig } from '~/src/config'
const ecsFormat = require('@elastic/ecs-pino-format')

const requestLogger = {
  plugin: hapiPino,
  options: {
    enabled: !appConfig.get('isTest'),
    redact: ['req.headers.authorization', 'req.headers.cookie', 'res.headers'],
    level: appConfig.get('logLevel'),
    ...(appConfig.get('isDevelopment')
      ? { transport: { target: 'pino-pretty' } }
      : ecsFormat())
  }
}

export { requestLogger }
