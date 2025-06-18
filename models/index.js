'use strict'
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config.js')[env]

const sequelize = new Sequelize(config)

const User = require('./user')(sequelize, Sequelize.DataTypes)
const Post = require('./post')(sequelize, Sequelize.DataTypes)
const Comment = require('./comment')(sequelize, Sequelize.DataTypes)
const Follow = require('./follow')(sequelize, Sequelize.DataTypes)

const db = { User, Post, Comment, Follow, sequelize }

Object.values(db).forEach(model => {
  if (model && model.associate) model.associate(db)
})

module.exports = db
