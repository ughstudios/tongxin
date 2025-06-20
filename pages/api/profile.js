import { withSessionRoute } from '../../lib/session'
import db from '../../models'

export default withSessionRoute(async function handler(req, res) {
  await db.sync()
  const { User } = db
  const sessionUser = req.session.user
  if (!sessionUser) return res.status(401).end()

  if (req.method === 'GET') {
    const user = await User.findByPk(sessionUser.id)
    return res
      .status(200)
      .json({
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        verified: user.verified,
        theme: user.theme
      })
  }

  if (req.method === 'PUT') {
    const { avatarUrl, verified, theme } = req.body
    await User.update({ avatarUrl, verified, theme }, { where: { id: sessionUser.id } })
    if (theme) {
      req.session.user.theme = theme
      await req.session.save()
    }
    return res.status(200).json({ avatarUrl, verified, theme })
  }

  res.status(405).end()
})
