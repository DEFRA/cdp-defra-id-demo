import convict from 'convict'
import path from 'path'

import { version } from '~/package.json'

const oneDay = 1000 * 60 * 60 * 24
const oneWeek = 7 * 24 * 60 * 60 * 1000
const oneMonth = 30 * 7 * 24 * 60 * 60 * 1000

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  staticCacheTimeout: {
    doc: 'Static cache timeout in milliseconds',
    format: Number,
    default: oneWeek,
    env: 'STATIC_CACHE_TIMEOUT'
  },
  version: {
    doc: 'Application version',
    format: String,
    default: version
  },
  serviceName: {
    doc: 'Applications Service Name',
    format: String,
    default: 'cdp-defra-id-demo'
  },
  root: {
    doc: 'Project root',
    format: String,
    default: path.normalize(path.join(__dirname, '..', '..'))
  },
  assetPath: {
    doc: 'Asset path',
    format: String,
    default: '/public',
    env: 'ASSET_PATH'
  },
  appPathPrefix: {
    doc: 'Application url path prefix this is needed only until we have host based routing',
    format: String,
    default: '/cdp-defra-id-demo',
    env: 'APP_PATH_PREFIX'
  },
  isProduction: {
    doc: 'If this application running in the production environment',
    format: Boolean,
    default: process.env.NODE_ENV === 'production'
  },
  isDevelopment: {
    doc: 'If this application running in the development environment',
    format: Boolean,
    default: process.env.NODE_ENV !== 'production'
  },
  isTest: {
    doc: 'If this application running in the test environment',
    format: Boolean,
    default: process.env.NODE_ENV === 'test'
  },
  logLevel: {
    doc: 'Logging level',
    format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
    default: 'info',
    env: 'LOG_LEVEL'
  },
  appBaseUrl: {
    doc: 'Application base URL for after we login',
    format: String,
    default: 'http://localhost:3000',
    env: 'APP_BASE_URL'
  },
  redisHost: {
    doc: 'Redis cache host',
    format: String,
    default: '127.0.0.1',
    env: 'REDIS_HOST'
  },
  redisUsername: {
    doc: 'Redis cache username',
    format: String,
    default: '',
    env: 'REDIS_USERNAME'
  },
  redisPassword: {
    doc: 'Redis cache password',
    format: '*',
    default: '',
    sensitive: true,
    env: 'REDIS_PASSWORD'
  },
  redisKeyPrefix: {
    doc: 'Redis cache key prefix name used to isolate the cached results across multiple clients',
    format: String,
    default: 'cdp-defra-id-demo',
    env: 'REDIS_KEY_PREFIX'
  },
  redisTtl: {
    doc: 'Redis cache global ttl',
    format: Number,
    default: oneDay,
    env: 'REDIS_TTL'
  },
  useSingleInstanceCache: {
    doc: 'Enable the use of a single instance Redis Cache',
    format: Boolean,
    default: process.env.NODE_ENV !== 'production',
    env: 'USE_SINGLE_INSTANCE_CACHE'
  },
  sessionCookiePassword: {
    doc: 'Session cookie password',
    format: '*',
    default: 'beepBoopBeepDevelopmentOnlyBeepBoop',
    sensitive: true,
    env: 'SESSION_COOKIE_PASSWORD'
  },
  sessionCookieTtl: {
    doc: 'Session cookie ttl',
    format: Number,
    default: oneMonth,
    env: 'SESSION_COOKIE_TTL'
  },
  defraIdOidcConfigurationUrl: {
    doc: 'DEFRA ID OIDC Configuration URL',
    format: String,
    env: 'DEFRA_ID_OIDC_CONFIGURATION_URL',
    default:
      'https://dcidmtest.b2clogin.com/dcidmtest.onmicrosoft.com/b2c_1a_cui_signin_stub/.well-known/openid-configuration'
  },
  defraIdServiceId: {
    doc: 'DEFRA ID Service ID',
    format: String,
    env: 'DEFRA_ID_SERVICE_ID',
    default: 'd7d72b79-9c62-ee11-8df0-000d3adf7047'
  },
  defraIdClientId: {
    doc: 'DEFRA ID Client ID',
    format: String,
    env: 'DEFRA_ID_CLIENT_ID',
    default: '2fb0d715-affa-4bf1-836e-44a464e3fbea'
  },
  defraIdClientSecret: {
    doc: 'DEFRA ID Client Secret',
    format: String,
    sensitive: true,
    env: 'DEFRA_ID_CLIENT_SECRET',
    default: ''
  }
})

config.validate({ allowed: 'strict' })

export { config }
