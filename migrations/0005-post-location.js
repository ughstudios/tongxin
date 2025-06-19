'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Posts', 'location', Sequelize.STRING)
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Posts', 'location')
  }
}
