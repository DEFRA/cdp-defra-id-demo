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
            const displayName = [payload.firstName, payload.lastName]
              .filter((part) => part)
              .join(' ')

            credentials.profile = {
              id: payload.sub,
              correlationId: payload.correlationId,
              sessionId: payload.sessionId,
              contactId: payload.contactId,
              serviceId: payload.serviceId,
              firstName: payload.firstName,
              lastName: payload.lastName,
              displayName,
              email: payload.email,
              uniqueReference: payload.uniqueReference,
              loa: payload.loa,
              aal: payload.aal,
              enrolmentCount: payload.enrolmentCount,
              enrolmentRequestCount: payload.enrolmentRequestCount,
              currentRelationshipId: payload.currentRelationshipId,
              relationships: payload.relationships,
              roles: payload.roles,
              idToken: params.id_token
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
