import { withSessionRoute } from '../../lib/session'
import db from '../../models'

async function handler(req, res) {
  const { Comment } = db
  if (req.method === 'GET') {
    const { postId } = req.query
    const where = postId ? { postId } : {}
    const result = await Comment.findAll({ where })
    return res.status(200).json(result)
  }

  if (req.method === 'POST') {
    if (!req.session.user) return res.status(401).end()
    const { postId, content } = req.body
    const comment = await Comment.create({ postId, userId: req.session.user.id, content })
    return res.status(201).json(comment)
  }

  res.status(405).end()
}

export default withSessionRoute(handler)
