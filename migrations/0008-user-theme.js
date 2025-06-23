'use strict'
module.exports = {
  async up(queryInterface) {
    const table = await queryInterface.describeTable('Users')
    if (table.theme) {
      await queryInterface.removeColumn('Users', 'theme')
    }
  },
  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Users')
    if (!table.theme) {
      await queryInterface.addColumn('Users', 'theme', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'light'
      })
    }
  }
}
