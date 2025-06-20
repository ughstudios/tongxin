import { withSessionRoute } from '../../lib/session'
import db from '../../models'

export default withSessionRoute(async function handler(req, res) {
  await db.sync()
  const { Message } = db
  const user = req.session.user
  if (!user) return res.status(401).end()
  const count = await Message.count({
    where: { receiverId: user.id, read: false }
  })
  res.status(200).json({ count })
})
