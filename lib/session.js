export const sessionOptions = {
  password: 'complex_password_at_least_32_characters_long',
  cookieName: 'tongxin_session',
  // Only set the Secure flag when explicitly enabled. In local production
  // builds served over plain HTTP the previous NODE_ENV check prevented the
  // cookie from being stored which caused unauthorized requests.
  cookieOptions: { secure: process.env.COOKIE_SECURE === 'true' }
}

import { getIronSession } from 'iron-session'

export function withSessionRoute(handler) {
  return async (req, res) => {
    req.session = await getIronSession(req, res, sessionOptions)
    return handler(req, res)
  }
}
