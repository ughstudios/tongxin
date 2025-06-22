'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables()
    if (!tables.includes('Messages')) {
      await queryInterface.createTable('Messages', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        senderId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Users', key: 'id' }
        },
      receiverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
      },
      content: { type: Sequelize.TEXT, allowNull: false },
      read: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
      })
    }
  },
  async down(queryInterface) {
    const tables = await queryInterface.showAllTables()
    if (tables.includes('Messages')) {
      await queryInterface.dropTable('Messages')
    }
  }
}
