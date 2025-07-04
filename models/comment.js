'use strict'
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    postId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    parentId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  })
  Comment.associate = models => {
    Comment.belongsTo(models.Post, { foreignKey: 'postId' })
    Comment.belongsTo(models.User, { foreignKey: 'userId' })
    Comment.belongsTo(models.Comment, { foreignKey: 'parentId', as: 'parent' })
    Comment.hasMany(models.Comment, { foreignKey: 'parentId', as: 'replies' })
  }
  return Comment
}
