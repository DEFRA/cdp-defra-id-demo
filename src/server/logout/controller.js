import { config } from '~/src/config'
import { provideAuthedUser } from '~/src/server/logout/prerequisites/provide-authed-user'

const logoutController = {
  options: {
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser

    if (!authedUser) {
      return h.redirect(config.get('appPathPrefix'))
    }

    const referrer = request.info.referrer
    const idTokenHint = authedUser.idToken

    const logoutUrl = encodeURI(
      `https://your-account.cpdev.cui.defra.gov.uk/idphub/b2c/b2c_1a_cui_cpdev_signupsignin/signout?id_token_hint=${idTokenHint}&post_logout_redirect_uri=${referrer}`
    )

    request.dropUserSession()
    request.cookieAuth.clear()

    return h.redirect(logoutUrl)
  }
}

export { logoutController }
