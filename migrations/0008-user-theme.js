'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'theme', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'light'
    })
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'theme')
  }
}
