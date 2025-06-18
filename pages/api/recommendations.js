import { withSessionRoute } from '../../lib/session'
import db from '../../models'

async function handler(req, res) {
  const { Post } = db
  const posts = await Post.findAll()
  const result = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5)
  res.status(200).json(result)
}

export default withSessionRoute(handler)
