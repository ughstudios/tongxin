'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables()
    if (!tables.includes('Hashtags')) {
      await queryInterface.createTable('Hashtags', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        tag: { type: Sequelize.STRING, allowNull: false },
        postId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Posts', key: 'id' }
        },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false }
      })
    }
  },
  async down(queryInterface) {
    const tables = await queryInterface.showAllTables()
    if (tables.includes('Hashtags')) {
      await queryInterface.dropTable('Hashtags')
    }
  }
}
