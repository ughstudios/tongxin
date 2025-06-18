import { withSessionRoute } from '../../lib/session'
import db from '../../models'

async function handler(req, res) {
  if (!req.session.user) return res.status(401).end()
  const { Post } = db
  const { id } = req.body
  const post = await Post.findByPk(id)
  if (!post) return res.status(404).end()
  post.likes += 1
  await post.save()
  res.status(200).json(post)
}

export default withSessionRoute(handler)
