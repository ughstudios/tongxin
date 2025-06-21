'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Comments')
    if (!table.parentId) {
      await queryInterface.addColumn('Comments', 'parentId', {
        type: Sequelize.INTEGER,
        references: { model: 'Comments', key: 'id' },
        allowNull: true
      })
    }
  },
  async down(queryInterface) {
    const table = await queryInterface.describeTable('Comments')
    if (table.parentId) {
      await queryInterface.removeColumn('Comments', 'parentId')
    }
  }
}
