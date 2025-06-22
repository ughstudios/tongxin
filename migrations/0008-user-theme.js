'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Users')
    if (!table.theme) {
      await queryInterface.addColumn('Users', 'theme', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'light'
      })
    }
  },
  async down(queryInterface) {
    const table = await queryInterface.describeTable('Users')
    if (table.theme) {
      await queryInterface.removeColumn('Users', 'theme')
    }
  }
}
