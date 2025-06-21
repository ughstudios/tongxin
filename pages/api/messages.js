import { withSessionRoute } from '../../lib/session'
import db from '../../models'
import { hasProhibitedKeywords } from "../../lib/moderation"

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
    await Message.update(
      { read: true },
      {
        where: {
          senderId: userId,
          receiverId: user.id,
          read: false
        }
      }
    )
    return res.status(200).json(messages)
  }

  if (req.method === 'POST') {
    const { to, content } = req.body
    if (!to || !content || !content.trim()) {
      return res.status(400).json({ error: "Content required" })
    }
    if (hasProhibitedKeywords(content)) {
      return res.status(400).json({ error: "Prohibited content" })
    }
    const message = await Message.create({
      senderId: user.id,
      receiverId: to,
      content,
      read: false
    })
    return res.status(201).json(message)
  }

  if (req.method === 'PUT') {
    const { id } = req.query
    if (!id || !content || !content.trim()) {
      return res.status(400).json({ error: "Content required" })
    }
    if (hasProhibitedKeywords(content)) {
      return res.status(400).json({ error: "Prohibited content" })
    }
    const message = await Message.findByPk(id)
    if (!message || message.senderId !== user.id) return res.status(403).end()
    await message.update({ content })
    return res.status(200).json(message)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).end()
    const message = await Message.findByPk(id)
    if (!message || message.senderId !== user.id) return res.status(403).end()
    await message.destroy()
    return res.status(204).end()
  }

  res.status(405).end()
})
