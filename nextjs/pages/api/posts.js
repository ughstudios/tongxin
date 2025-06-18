import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'
import { readData, writeData } from '../../lib/data'

async function handler(req, res) {
  const posts = await readData('posts.json')
  const users = await readData('users.json')
  if (req.method === 'GET') {
    if (req.query.id) {
      const post = posts.find(p => String(p.id) === String(req.query.id))
      return res.status(post ? 200 : 404).json(post || null)
    }
    let result = posts
    if (req.query.q) {
      const q = req.query.q.toLowerCase()
      result = result.filter(p => p.content.toLowerCase().includes(q))
    }
    if (req.query.feed && req.session.user) {
      const me = users.find(u => u.id === req.session.user.id)
      const ids = [req.session.user.id, ...(me?.following || [])]
      result = result.filter(p => ids.includes(p.userId))
    }
    if (req.query.userId) {
      result = result.filter(p => String(p.userId) === String(req.query.userId))
    }
    if (req.query.trending) {
      result = [...result].sort((a, b) => (b.likes || 0) - (a.likes || 0))
    }
    res.status(200).json(result)
  } else if (req.method === 'POST') {
    if (!req.session.user) return res.status(401).end()
    const { content, imageUrl, videoUrl } = req.body
    const newPost = {
      id: Date.now(),
      userId: req.session.user.id,
      content,
      imageUrl,
      videoUrl,
      likes: 0,
      createdAt: Date.now()
    }
    posts.push(newPost)
    await writeData('posts.json', posts)
    res.status(201).json(newPost)
  } else if (req.method === 'PUT') {
    if (!req.session.user) return res.status(401).end()
    const { id, content, imageUrl, videoUrl } = req.body
    const post = posts.find(p => p.id === id)
    if (!post || post.userId !== req.session.user.id) return res.status(404).end()
    post.content = content
    post.imageUrl = imageUrl
    post.videoUrl = videoUrl
    await writeData('posts.json', posts)
    res.status(200).json(post)
  } else if (req.method === 'DELETE') {
    if (!req.session.user) return res.status(401).end()
    const { id } = req.body
    const index = posts.findIndex(p => p.id === id && p.userId === req.session.user.id)
    if (index === -1) return res.status(404).end()
    posts.splice(index, 1)
    await writeData('posts.json', posts)
    res.status(204).end()
  } else {
    res.status(405).end()
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
