'use strict'
const Sequelize = require('sequelize')
const path = require('path')

const dbFile = process.env.NODE_ENV === 'production'
  ? path.join(process.cwd(), 'data', 'prod.db')
  : path.join(process.cwd(), 'data', 'test.db')

console.log('Using SQLite file', dbFile)
const sequelize = new Sequelize({ dialect: 'sqlite', storage: dbFile })

const User = require('./user')(sequelize, Sequelize.DataTypes)
const Post = require('./post')(sequelize, Sequelize.DataTypes)
const Comment = require('./comment')(sequelize, Sequelize.DataTypes)
const Follow = require('./follow')(sequelize, Sequelize.DataTypes)
const Like = require('./like')(sequelize, Sequelize.DataTypes)
const Message = require('./message')(sequelize, Sequelize.DataTypes)
const Hashtag = require('./hashtag')(sequelize, Sequelize.DataTypes)

const db = {
  Sequelize,
  User,
  Post,
  Comment,
  Follow,
  Like,
  Message,
  Hashtag,
  sequelize
}

const globalForSync = globalThis
let syncPromise = globalForSync._syncPromise
db.sync = () => {
  if (!syncPromise) {
    syncPromise = sequelize.sync()
    globalForSync._syncPromise = syncPromise
  }
  return syncPromise
}

Object.values(db).forEach(model => {
  if (model && model.associate) model.associate(db)
})

module.exports = db
