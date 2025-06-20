import { withSessionRoute } from '../../lib/session'
import db from '../../models'

async function handler(req, res) {
  if (!req.session.user) return res.status(401).end()
  const { Post, Like } = db
  const { id } = req.body
  const post = await Post.findByPk(id)
  if (!post) return res.status(404).end()
  const existing = await Like.findOne({
    where: { userId: req.session.user.id, postId: id }
  })
  if (existing) {
    await existing.destroy()
    post.likes = Math.max(0, (post.likes || 0) - 1)
    await post.save()
    return res.status(200).json({ ...post.toJSON(), liked: false })
  }

  await Like.create({ userId: req.session.user.id, postId: id })
  post.likes += 1
  await post.save()
  res.status(200).json({ ...post.toJSON(), liked: true })
}

export default withSessionRoute(handler)
