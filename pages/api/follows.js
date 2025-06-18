import { withSessionRoute } from '../../lib/session'
import db from '../../models'

async function handler(req, res) {
  if (!req.session.user) return res.status(401).end()
  const { User, Follow } = db
  const me = await User.findByPk(req.session.user.id)
  if (!me) return res.status(401).end()

  if (req.method === 'GET') {
    const follows = await Follow.findAll({ where: { userId: me.id } })
    return res.status(200).json(follows.map(f => f.followId))
  }

  if (req.method === 'POST') {
    const { id } = req.body
    const target = await User.findByPk(id)
    if (!target) return res.status(404).end()
    await Follow.findOrCreate({ where: { userId: me.id, followId: id } })
    const follows = await Follow.findAll({ where: { userId: me.id } })
    return res.status(200).json(follows.map(f => f.followId))
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    await Follow.destroy({ where: { userId: me.id, followId: id } })
    const follows = await Follow.findAll({ where: { userId: me.id } })
    return res.status(200).json(follows.map(f => f.followId))
  }

  res.status(405).end()
}

export default withSessionRoute(handler)
