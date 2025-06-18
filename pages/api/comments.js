import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'
import { readData, writeData } from '../../lib/data'

async function handler(req, res) {
  const comments = await readData('comments.json')
  if (req.method === 'GET') {
    const { postId } = req.query
    const result = postId ? comments.filter(c => String(c.postId) === String(postId)) : comments
    res.status(200).json(result)
  } else if (req.method === 'POST') {
    if (!req.session.user) return res.status(401).end()
    const { postId, content } = req.body
    const newComment = { id: Date.now(), postId, userId: req.session.user.id, content, createdAt: Date.now() }
    comments.push(newComment)
    await writeData('comments.json', comments)
    res.status(201).json(newComment)
  } else {
    res.status(405).end()
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
