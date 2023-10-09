import { config } from '~/src/config'

const loginController = {
  options: {
    auth: 'defra-id'
  },
  handler: async (request, h) => h.redirect(config.get('appPathPrefix'))
}

export { loginController }
