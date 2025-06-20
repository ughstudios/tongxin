import { withSessionRoute } from '../../lib/session'
import db from '../../models'

async function handler(req, res) {
  await db.sync()
  const { Post, Follow } = db
  const posts = await Post.findAll()

  if (req.session.user) {
    const follows = await Follow.findAll({ where: { userId: req.session.user.id } })
    const ids = [req.session.user.id, ...follows.map(f => f.followId)]
    const feed = posts.filter(p => ids.includes(p.userId))
    const trending = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5)
    const map = new Map()
    ;[...feed, ...trending].forEach(p => map.set(p.id, p))
    return res.status(200).json(Array.from(map.values()))
  }

  const result = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5)
  res.status(200).json(result)
}

export default withSessionRoute(handler)
