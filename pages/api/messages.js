import { withSessionRoute } from '../../lib/session'
import db from '../../models'

export default withSessionRoute(async function handler(req, res) {
  await db.sync()
  const { Message, Sequelize } = db
  const user = req.session.user
  if (!user) return res.status(401).end()

  if (req.method === 'GET') {
    const { userId } = req.query
    if (!userId) return res.status(400).end()
    const messages = await Message.findAll({
      where: {
        [Sequelize.Op.or]: [
          { senderId: user.id, receiverId: userId },
          { senderId: userId, receiverId: user.id }
        ]
      },
      order: [['createdAt', 'ASC']]
    })
    return res.status(200).json(messages)
  }

  if (req.method === 'POST') {
    const { to, content } = req.body
    if (!to || !content || !content.trim()) return res.status(400).end()
    const message = await Message.create({
      senderId: user.id,
      receiverId: to,
      content
    })
    return res.status(201).json(message)
  }

  res.status(405).end()
})
