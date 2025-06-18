'use strict'
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    followId: { type: DataTypes.INTEGER, allowNull: false }
  })
  return Follow
}
