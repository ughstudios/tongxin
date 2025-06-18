import { readData, writeData } from '../../lib/data'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  const users = await readData('users.json')
  if (req.method === 'POST') {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).end()
    if (users.find(u => u.username === username)) return res.status(409).end()
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = { id: Date.now(), username, passwordHash, following: [] }
    users.push(newUser)
    await writeData('users.json', users)
    res.status(201).json({ id: newUser.id, username })
  } else if (req.method === 'GET') {
    if (req.query.id) {
      const user = users.find(u => String(u.id) === String(req.query.id))
      if (!user) return res.status(404).end()
      return res
        .status(200)
        .json({ id: user.id, username: user.username, following: user.following })
    }
    res.status(200).json(users.map(u => ({ id: u.id, username: u.username })))
  } else {
    res.status(405).end()
  }
}
