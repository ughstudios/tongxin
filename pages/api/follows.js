import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'
import { readData, writeData } from '../../lib/data'

async function handler(req, res) {
  if (!req.session.user) return res.status(401).end()
  const users = await readData('users.json')
  const me = users.find(u => u.id === req.session.user.id)
  if (!me) return res.status(401).end()
  if (req.method === 'GET') {
    res.status(200).json(me.following)
  } else if (req.method === 'POST') {
    const { id } = req.body
    if (!users.find(u => u.id === id)) return res.status(404).end()
    if (!me.following.includes(id)) me.following.push(id)
    await writeData('users.json', users)
    res.status(200).json(me.following)
  } else if (req.method === 'DELETE') {
    const { id } = req.body
    me.following = me.following.filter(f => f !== id)
    await writeData('users.json', users)
    res.status(200).json(me.following)
  } else {
    res.status(405).end()
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
