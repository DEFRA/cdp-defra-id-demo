import path from 'path'

import { config } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

const logger = createLogger()
const assetPath = config.get('assetPath')

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
      url: '/',
      isActive: request.path === '/' || request.path === ''
    }
  ]
}

async function context(request) {
  const authedUser = await request.getUserSession()
  return {
    authedUser,
    version: config.get('version'),
    serviceName: config.get('serviceName'),
    serviceUrl: '/',
    breadcrumbs: [],
    navigation: buildNavigation(request),
    getAssetPath: function (asset) {
      const webpackAssetPath = webpackManifest[asset]
      return `${assetPath}/${webpackAssetPath}`
    }
  }
}

export { context }
