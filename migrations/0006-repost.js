'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Posts', 'repostId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Posts', key: 'id' }
    })
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Posts', 'repostId')
  }
}
