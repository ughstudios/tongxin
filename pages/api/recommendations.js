import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'
import { readData } from '../../lib/data'

async function handler(req, res) {
  const posts = await readData('posts.json')
  const result = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5)
  res.status(200).json(result)
}

export default withIronSessionApiRoute(handler, sessionOptions)
