'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    // avoid duplicate column errors when re-running migrations
    const table = await queryInterface.describeTable('Posts')
    if (!table.repostId) {
      await queryInterface.addColumn('Posts', 'repostId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Posts', key: 'id' }
      })
    }
  },
  async down(queryInterface) {
    const table = await queryInterface.describeTable('Posts')
    if (table.repostId) {
      await queryInterface.removeColumn('Posts', 'repostId')
    }
  }
}
