import hapiPino from 'hapi-pino'
import ecsFormat from '@elastic/ecs-pino-format'

import { config } from '~/src/config'

const requestLogger = {
  plugin: hapiPino,
  options: {
    enabled: !config.get('isTest'),
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers'],
      remove: true
    },
    level: config.get('logLevel'),
    ...(config.get('isDevelopment')
      ? { transport: { target: 'pino-pretty' } }
      : ecsFormat())
  }
}

export { requestLogger }
