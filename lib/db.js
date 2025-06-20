import path from 'path'
import fs from 'fs'
import { Sequelize } from 'sequelize'

const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dataDir, 'test.db'),
  logging: false
})

export default sequelize
