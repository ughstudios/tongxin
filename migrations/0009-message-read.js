'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Messages', 'read', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Messages', 'read')
  }
}
