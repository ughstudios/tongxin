import { withSessionRoute } from '../../lib/session'
import db from '../../models'

async function handler(req, res) {
  if (!req.session.user) return res.status(401).end()
  const { Post, Like } = db
  const { id } = req.body
  const post = await Post.findByPk(id)
  if (!post) return res.status(404).end()
  if (post.userId === req.session.user.id) return res.status(403).end()
  const [like, created] = await Like.findOrCreate({
    where: { userId: req.session.user.id, postId: id },
    defaults: { userId: req.session.user.id, postId: id }
  })
  if (created) {
    post.likes += 1
    await post.save()
  }
  res.status(200).json(post)
}

export default withSessionRoute(handler)
