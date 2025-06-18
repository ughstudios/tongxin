'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'avatarUrl', Sequelize.STRING)
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'avatarUrl')
  }
}
