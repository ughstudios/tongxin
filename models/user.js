'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
  })
  User.associate = models => {
    User.hasMany(models.Post, { foreignKey: 'userId' })
    User.hasMany(models.Comment, { foreignKey: 'userId' })
  }
  return User
}
