export const sessionOptions = {
  password: 'complex_password_at_least_32_characters_long',
  cookieName: 'tongxin_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

import { getIronSession } from 'iron-session'

export function withSessionRoute(handler) {
  return async (req, res) => {
    req.session = await getIronSession(req, res, sessionOptions)
    return handler(req, res)
  }
}
