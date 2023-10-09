import { v4 as uuidv4 } from 'uuid'
import { addSeconds } from 'date-fns'

import { config } from '~/src/config'

const authCallbackController = {
  options: {
    auth: 'azure-oidc'
  },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const { profile } = request.auth.credentials
      const expiresInSeconds = request.auth.credentials.expiresIn
      const expiresInMilliSeconds = expiresInSeconds * 1000
      const expiresAt = addSeconds(new Date(), expiresInSeconds)

      const sessionId = uuidv4()
      await request.server.app.cache.set(sessionId, {
        id: profile.id,
        email: profile.email,
        displayName: profile.displayName,
        loginHint: profile.loginHint,
        isAuthenticated: request.auth.isAuthenticated,
        token: request.auth.credentials.token,
        refreshToken: request.auth.credentials.refreshToken,
        scope: request.auth.credentials.roles,
        expiresIn: expiresInMilliSeconds,
        expiresAt
      })

      request.cookieAuth.set({ sessionId })

      request.logger.info('User has been successfully authenticated')
      request.logger.info(`expiresIn: ${expiresInSeconds}`)
    }

    const redirect =
      request.yar.flash('referrer')?.at(0) ?? config.get('appPathPrefix')

    return h.redirect(redirect)
  }
}

export { authCallbackController }