import { withSessionRoute } from '../../lib/session'
import db from '../../models'

export default withSessionRoute(async function handler(req, res) {
  await db.sync()
  const { User } = db
  const sessionUser = req.session.user
  if (!sessionUser) return res.status(401).end()

  if (req.method === 'GET') {
    const user = await User.findByPk(sessionUser.id)
    return res.status(200).json({ id: user.id, username: user.username, avatarUrl: user.avatarUrl, verified: user.verified })
  }

  if (req.method === 'PUT') {
    const { avatarUrl, verified } = req.body
    await User.update({ avatarUrl, verified }, { where: { id: sessionUser.id } })
    return res.status(200).json({ avatarUrl, verified })
  }

  res.status(405).end()
})
