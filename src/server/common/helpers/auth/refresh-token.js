import fetch from 'node-fetch'

import { config } from '~/src/config'

async function refreshAccessToken(request) {
  const authedUser = await request.getUserSession()
  const refreshToken = authedUser?.refreshToken ?? null
  const tenant = config.get('defraIdentityTenant')
  const policy = config.get('defraIdentityPolicy')
  const clientId = config.get('defraIdentityClientId')
  const clientSecret = config.get('defraIdentityClientSecret')

  const params = new URLSearchParams()

  params.append('client_id', clientId)
  params.append('client_secret', clientSecret)
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', refreshToken)
  params.append('scope', `${clientId}, openid, profile, email', offline_access`)

  request.logger.info('Access token expired, refreshing...')

  return await fetch(
    `https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/token`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: params
    }
  )
}

export { refreshAccessToken }
