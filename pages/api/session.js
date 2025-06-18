import { withSessionRoute, sessionOptions } from '../../lib/session'
import bcrypt from 'bcryptjs'
import db from '../../models'

async function handler(req, res) {
  const { User } = db
  if (req.method === 'POST') {
    const { username, password } = req.body
    const user = await User.findOne({ where: { username } })
    if (!user) return res.status(401).end()
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).end()
    req.session.user = { id: user.id, username: user.username }
    await req.session.save()
    return res.status(200).json({ id: user.id, username: user.username })
  } else if (req.method === 'GET') {
    res.status(200).json(req.session.user || null)
  } else if (req.method === 'DELETE') {
    req.session.destroy()
    res.status(204).end()
  } else {
    res.status(405).end()
  }
}

export default withSessionRoute(handler)
