import bcrypt from 'bcryptjs'
import db from '../../models'

export default async function handler(req, res) {
  const { User, Follow } = db

  if (req.method === 'POST') {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).end()
    const existing = await User.findOne({ where: { username } })
    if (existing) return res.status(409).end()
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password: passwordHash })
    return res.status(201).json({ id: user.id, username: user.username })
  }

  if (req.method === 'GET') {
    if (req.query.id) {
      const user = await User.findByPk(req.query.id)
      if (!user) return res.status(404).end()
      const follows = await Follow.findAll({ where: { userId: user.id } })
      return res
        .status(200)
        .json({
          id: user.id,
          username: user.username,
          following: follows.map(f => f.followId)
        })
    }
    const users = await User.findAll()
    return res
      .status(200)
      .json(users.map(u => ({ id: u.id, username: u.username })))
  }

  res.status(405).end()
}
