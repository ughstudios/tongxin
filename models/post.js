'use strict'
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    content: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    videoUrl: DataTypes.STRING,
    location: DataTypes.STRING,
    likes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    repostId: { type: DataTypes.INTEGER, allowNull: true }
  })
  Post.associate = models => {
    Post.belongsTo(models.User, { foreignKey: 'userId' })
    Post.belongsTo(models.Post, { foreignKey: 'repostId', as: 'repost' })
    Post.hasMany(models.Comment, { foreignKey: 'postId' })
    Post.hasMany(models.Like, { foreignKey: 'postId' })
    Post.hasMany(models.Hashtag, { foreignKey: 'postId' })
  }
  return Post
}
