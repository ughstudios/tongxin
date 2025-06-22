'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables()
    if (!tables.includes('Likes')) {
      await queryInterface.createTable('Likes', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Users', key: 'id' }
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Posts', key: 'id' }
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
      })
      await queryInterface.addConstraint('Likes', {
        fields: ['userId', 'postId'],
        type: 'unique',
        name: 'likes_user_post_unique'
      })
    }
  },
  async down(queryInterface) {
    const tables = await queryInterface.showAllTables()
    if (tables.includes('Likes')) {
      await queryInterface.dropTable('Likes')
    }
  }
}
