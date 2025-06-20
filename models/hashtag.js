'use strict'
module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define('Hashtag', {
    tag: { type: DataTypes.STRING, allowNull: false },
    postId: { type: DataTypes.INTEGER, allowNull: false }
  })
  Hashtag.associate = models => {
    Hashtag.belongsTo(models.Post, { foreignKey: 'postId' })
  }
  return Hashtag
}
