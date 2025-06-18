import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'
import { readData } from '../../lib/data'
import bcrypt from 'bcryptjs'

async function handler(req, res) {
  const users = await readData('users.json')
  if (req.method === 'POST') {
    const { username, password } = req.body
    const user = users.find(u => u.username === username)
    if (!user) return res.status(401).end()
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).end()
    req.session.user = { id: user.id, username: user.username }
    await req.session.save()
    res.status(200).json({ id: user.id, username: user.username })
  } else if (req.method === 'GET') {
    res.status(200).json(req.session.user || null)
  } else if (req.method === 'DELETE') {
    req.session.destroy()
    res.status(204).end()
  } else {
    res.status(405).end()
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
