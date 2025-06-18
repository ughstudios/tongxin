'use strict'
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    content: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    videoUrl: DataTypes.STRING,
    likes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  })
  Post.associate = models => {
    Post.belongsTo(models.User, { foreignKey: 'userId' })
    Post.hasMany(models.Comment, { foreignKey: 'postId' })
  }
  return Post
}
