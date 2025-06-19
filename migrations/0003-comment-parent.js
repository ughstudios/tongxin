'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Comments', 'parentId', {
      type: Sequelize.INTEGER,
      references: { model: 'Comments', key: 'id' },
      allowNull: true
    })
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Comments', 'parentId')
  }
}
