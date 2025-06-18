import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'
import { readData, writeData } from '../../lib/data'

async function handler(req, res) {
  if (!req.session.user) return res.status(401).end()
  const posts = await readData('posts.json')
  const { id } = req.body
  const post = posts.find(p => p.id === id)
  if (!post) return res.status(404).end()
  post.likes = (post.likes || 0) + 1
  await writeData('posts.json', posts)
  res.status(200).json(post)
}

export default withIronSessionApiRoute(handler, sessionOptions)
