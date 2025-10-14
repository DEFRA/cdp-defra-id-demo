import { isEmpty } from 'lodash'

import { removeUserSession } from '~/src/server/common/helpers/auth/user-session'
import { provideAuthedUser } from '~/src/server/logout/prerequisites/provide-authed-user'

const logoutController = {
  options: {
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser

    if (isEmpty(authedUser)) {
      return h.redirect('/')
    }

    const referrer = request.info.referrer
    const idTokenHint = authedUser.idToken

    const logoutUrl = encodeURI(
      `${authedUser.logoutUrl}?id_token_hint=${idTokenHint}&post_logout_redirect_uri=${referrer}`
    )

    await removeUserSession(request)

    return h.redirect(logoutUrl)
  }
}

export { logoutController }
