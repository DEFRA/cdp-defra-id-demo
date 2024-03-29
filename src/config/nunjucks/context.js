import path from 'path'

import { config } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

const logger = createLogger()
const assetPath = config.get('assetPath')
const appPathPrefix = config.get('appPathPrefix')

const manifestPath = path.resolve(
  config.get('root'),
  '.public',
  'manifest.json'
)
let webpackManifest

try {
  webpackManifest = require(manifestPath)
} catch (error) {
  logger.error('Webpack Manifest assets file not found')
}

function buildNavigation(request) {
  return [
    {
      text: 'Home',
      url: appPathPrefix,
      isActive: request.path === `${appPathPrefix}`
    }
  ]
}

async function context(request) {
  const authedUser = await request.getUserSession()
  return {
    authedUser,
    version: config.get('version'),
    serviceName: config.get('serviceName'),
    serviceUrl: config.get('appPathPrefix'),
    breadcrumbs: [],
    navigation: buildNavigation(request),
    getAssetPath: function (asset) {
      const webpackAssetPath = webpackManifest[asset]
      if (!appPathPrefix || appPathPrefix === '/') {
        return `${assetPath}/${webpackAssetPath}`
      } else {
        return `${appPathPrefix}${assetPath}/${webpackAssetPath}`
      }
    }
  }
}

export { context }
