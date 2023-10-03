import path from 'path'

import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

const logger = createLogger()
const appPathPrefix = appConfig.get('appPathPrefix')
const manifestPath = path.resolve(
  appConfig.get('root'),
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

function context(request) {
  return {
    version: appConfig.get('version'),
    serviceName: appConfig.get('serviceName'),
    serviceUrl: appConfig.get('appPathPrefix'),
    breadcrumbs: [],
    navigation: buildNavigation(request),
    getAssetPath: function (asset) {
      const webpackAssetPath = webpackManifest[asset]

      return `${appPathPrefix}/public/${webpackAssetPath}`
    }
  }
}

export { context }
