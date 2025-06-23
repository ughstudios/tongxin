'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    avatarUrl: DataTypes.STRING,
    verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  })
  User.associate = models => {
    User.hasMany(models.Post, { foreignKey: 'userId' })
    User.hasMany(models.Comment, { foreignKey: 'userId' })
    User.hasMany(models.Message, { as: 'sentMessages', foreignKey: 'senderId' })
    User.hasMany(models.Message, { as: 'receivedMessages', foreignKey: 'receiverId' })
  }
  return User
}
