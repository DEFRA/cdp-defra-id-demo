import qs from 'qs'
import path from 'path'
import hapi from '@hapi/hapi'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'

import { router } from './router'
import { config } from '~/src/config'
import { nunjucksConfig } from '~/src/config/nunjucks'
import { requestLogger } from '~/src/server/common/helpers/request-logger'
import { catchAll } from '~/src/server/common/helpers/errors'
import { defraId } from '~/src/server/common/helpers/auth/defra-id'
import { sessionManager } from '~/src/server/common/helpers/session-manager'
import { sessionCookie } from '~/src/server/common/helpers/auth/session-cookie'
import { buildRedisClient } from '~/src/server/common/helpers/redis-client'
import { getUserSession } from '~/src/server/common/helpers/auth/get-user-session'
import { dropUserSession } from '~/src/server/common/helpers/auth/drop-user-session'

const client = buildRedisClient()
const appPathPrefix = config.get('appPathPrefix')

async function createServer() {
  const server = hapi.server({
    port: config.get('port'),
    routes: {
      auth: {
        mode: 'try'
      },
      cors: true,
      validate: {
        options: {
          abortEarly: false
        }
      },
      files: {
        relativeTo: path.resolve(config.get('root'), '.public')
      }
    },
    router: {
      stripTrailingSlash: true
    },
    query: {
      parser: (query) => qs.parse(query)
    },
    cache: [
      {
        name: 'session',
        engine: new CatboxRedis({
          client,
          segment: 'session'
        })
      }
    ]
  })

  server.app.cache = server.cache({
    cache: 'session',
    expiresIn: config.get('redisTtl'),
    segment: 'session'
  })

  server.decorate('request', 'getUserSession', getUserSession)
  server.decorate('request', 'dropUserSession', dropUserSession)

  await server.register(sessionManager)
  await server.register(defraId)
  await server.register(sessionCookie)
  await server.register(requestLogger)
  await server.register(nunjucksConfig)

  if (!appPathPrefix || appPathPrefix === '/') {
    await server.register(router)
  } else {
    await server.register(router, {
      routes: { prefix: appPathPrefix }
    })
  }

  server.ext('onPreResponse', catchAll)

  return server
}

export { createServer }
