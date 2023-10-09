import jwt from '@hapi/jwt'
import bell from '@hapi/bell'

import { config } from '~/src/config'

const tenant = config.get('defraIdentityTenant')
const policy = config.get('defraIdentityPolicy')
const serviceId = config.get('defraIdentityServiceId')
const clientId = config.get('defraIdentityClientId')
const clientSecret = config.get('defraIdentityClientSecret')
const oAuthTokenUrl = `https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/token`
const oAuthAuthorizeUrl = `https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/authorize`
const authCallbackUrl =
  config.get('appBaseUrl') + config.get('appPathPrefix') + '/auth/callback'

const azureOidc = {
  plugin: {
    name: 'azure-oidc',
    register: async (server) => {
      await server.register(bell)

      server.auth.strategy('azure-oidc', 'bell', {
        location: (request) => {
          if (request.info.referrer) {
            request.yar.flash('referrer', request.info.referrer)
          }

          return authCallbackUrl
        },
        provider: {
          name: 'azure-oidc',
          protocol: 'oauth2',
          useParamsAuth: true,
          auth: oAuthAuthorizeUrl,
          token: oAuthTokenUrl,
          scope: [clientId, 'openid', 'profile', 'email', 'offline_access'],
          profile: async function (credentials, params, get) {
            const payload = jwt.token.decode(credentials.token).decoded.payload

            credentials.profile = {
              id: payload.sub,
              displayName: `${payload.firstName} ${payload.lastName}`,
              email: payload.email,
              groups: payload.roles,
              loginHint: params.id_token
            }
          }
        },
        password: config.get('sessionCookiePassword'),
        clientId,
        clientSecret,
        cookie: 'bell-azure-oidc',
        isSecure: false,
        providerParams: {
          serviceId
        }
      })
    }
  }
}

export { azureOidc }
