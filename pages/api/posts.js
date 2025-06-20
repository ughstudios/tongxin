import { withSessionRoute } from '../../lib/session'
import db from '../../models'

async function handler(req, res) {
  await db.sync()
  const { Post, Follow } = db

  if (req.method === 'GET') {
    if (req.query.id) {
      const post = await Post.findByPk(req.query.id)
      return res.status(post ? 200 : 404).json(post || null)
    }

    let where = {}
    if (req.query.userId) where.userId = req.query.userId
    let result = await Post.findAll({ where, order: [['createdAt', 'DESC']] })

    if (req.query.q) {
      const q = req.query.q.toLowerCase()
      result = result.filter(p => (p.content || '').toLowerCase().includes(q))
    }

    if (req.query.feed && req.session.user) {
      const follows = await Follow.findAll({ where: { userId: req.session.user.id } })
      const ids = [req.session.user.id, ...follows.map(f => f.followId)]
      result = result.filter(p => ids.includes(p.userId))
    }

    if (req.query.video) {
      result = result.filter(p => p.videoUrl)
    }

    if (req.query.trending) {
      result = [...result].sort((a, b) => (b.likes || 0) - (a.likes || 0))
    }

    const offset = parseInt(req.query.offset || '0', 10)
    const limit = parseInt(req.query.limit || result.length, 10)
    const slice = result.slice(offset, offset + limit)

    return res.status(200).json(slice)
  }

  if (req.method === 'POST') {
    if (!req.session.user) return res.status(401).end()
    const { content, imageUrl, videoUrl, location, repostId } = req.body
    if (repostId) {
      const orig = await Post.findByPk(repostId)
      if (!orig) return res.status(404).end()
      const post = await Post.create({
        userId: req.session.user.id,
        content: orig.content,
        imageUrl: orig.imageUrl,
        videoUrl: orig.videoUrl,
        location: orig.location,
        repostId
      })
      return res.status(201).json(post)
    }
    const post = await Post.create({
      userId: req.session.user.id,
      content,
      imageUrl,
      videoUrl,
      location
    })
    return res.status(201).json(post)
  }

  if (req.method === 'PUT') {
    if (!req.session.user) return res.status(401).end()
    const { id, content, imageUrl, videoUrl, location } = req.body
    const post = await Post.findByPk(id)
    if (!post || post.userId !== req.session.user.id) return res.status(404).end()
    post.content = content
    post.imageUrl = imageUrl
    post.videoUrl = videoUrl
    post.location = location
    await post.save()
    return res.status(200).json(post)
  }

  if (req.method === 'DELETE') {
    if (!req.session.user) return res.status(401).end()
    const { id } = req.body
    const post = await Post.findByPk(id)
    if (!post || post.userId !== req.session.user.id) return res.status(404).end()
    await post.destroy()
    return res.status(204).end()
  }

  res.status(405).end()
}

export default withSessionRoute(handler)

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}
