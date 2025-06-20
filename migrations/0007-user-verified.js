'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'verified')
  }
}
