import inert from '@hapi/inert'

import { health } from '~/src/server/health'
import { home } from '~/src/server/home'
import { serveStaticFiles } from '~/src/server/common/helpers/serve-static-files'
import { login } from '~/src/server/login'
import { logout } from '~/src/server/logout'
import { auth } from '~/src/server/auth'

const router = {
  plugin: {
    name: 'router',
    register: async (server) => {
      await server.register([inert])
      await server.register([
        health,
        home,
        auth,
        login,
        logout,
        serveStaticFiles
      ])
    }
  }
}

export { router }
