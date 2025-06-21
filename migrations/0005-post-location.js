'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Posts')
    if (!table.location) {
      await queryInterface.addColumn('Posts', 'location', Sequelize.STRING)
    }
  },
  async down(queryInterface) {
    const table = await queryInterface.describeTable('Posts')
    if (table.location) {
      await queryInterface.removeColumn('Posts', 'location')
    }
  }
}
