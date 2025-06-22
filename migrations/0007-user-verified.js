'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Users')
    if (!table.verified) {
      await queryInterface.addColumn('Users', 'verified', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      })
    }
  },
  async down(queryInterface) {
    const table = await queryInterface.describeTable('Users')
    if (table.verified) {
      await queryInterface.removeColumn('Users', 'verified')
    }
  }
}
