import path from 'path'
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'data', 'test.db'),
  logging: false
})

export default sequelize
