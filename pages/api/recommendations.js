import { withSessionRoute } from '../../lib/session'
import db from '../../models'
import { addRepostInfo } from '../../lib/postHelpers'

async function handler(req, res) {
  await db.sync()
  const { Post, Follow } = db
  const limit = parseInt(req.query.limit || '20', 10)
  const offset = parseInt(req.query.offset || '0', 10)
  const trendingLimit = offset === 0 ? Math.min(5, limit) : 0
  const trending = trendingLimit
    ? await Post.findAll({ order: [['likes', 'DESC']], limit: trendingLimit })
    : []
  if (trending.length) await addRepostInfo(trending, Post)

  if (req.session.user) {
    const follows = await Follow.findAll({ where: { userId: req.session.user.id } })
    const ids = [req.session.user.id, ...follows.map(f => f.followId)]
    const feedLimit = limit - trending.length
    const feed = feedLimit > 0
      ? await Post.findAll({
          where: { userId: ids },
          order: [['createdAt', 'DESC']],
          offset,
          limit: feedLimit
        })
      : []
    await addRepostInfo(feed, Post)
    const map = new Map()
    ;[...feed, ...trending].forEach(p => map.set(p.id, p))
    return res.status(200).json(Array.from(map.values()))
  }

  res.status(200).json(trending)
}

export default withSessionRoute(handler)
