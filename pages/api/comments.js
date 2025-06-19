import { withSessionRoute } from '../../lib/session'
import db from '../../models'

async function handler(req, res) {
  const { Comment } = db
  if (req.method === 'GET') {
    const { id, postId, parentId } = req.query
    if (id) {
      const comment = await Comment.findByPk(id)
      return res.status(comment ? 200 : 404).json(comment || null)
    }
    const where = {}
    if (postId) where.postId = postId
    if (typeof parentId !== 'undefined') {
      where.parentId = parentId === 'null' ? null : parentId
    } else if (postId) {
      where.parentId = null
    }
    const result = await Comment.findAll({ where })
    return res.status(200).json(result)
  }

  if (req.method === 'POST') {
    if (!req.session.user) return res.status(401).end()
    const { postId, content, parentId } = req.body
    const comment = await Comment.create({
      postId,
      userId: req.session.user.id,
      content,
      parentId: parentId || null
    })
    return res.status(201).json(comment)
  }

  res.status(405).end()
}

export default withSessionRoute(handler)
