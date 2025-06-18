'use strict'
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config.js')[env]

const db = {}
const sequelize = new Sequelize(config)

db.User = require('./user')(sequelize, Sequelize.DataTypes)
db.Post = require('./post')(sequelize, Sequelize.DataTypes)
db.Comment = require('./comment')(sequelize, Sequelize.DataTypes)
db.Follow = require('./follow')(sequelize, Sequelize.DataTypes)

Object.keys(db).forEach(name => {
  if (db[name].associate) db[name].associate(db)
})

db.sequelize = sequelize
module.exports = db
