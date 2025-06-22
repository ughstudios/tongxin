'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables()
    if (!tables.includes('Users')) {
      await queryInterface.createTable('Users', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: Sequelize.STRING, unique: true, allowNull: false },
        password: { type: Sequelize.STRING, allowNull: false },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false }
      })
    }
    if (!tables.includes('Posts')) {
      await queryInterface.createTable('Posts', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Users', key: 'id' }
      },
      content: Sequelize.TEXT,
      imageUrl: Sequelize.STRING,
      videoUrl: Sequelize.STRING,
      likes: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
      })
    }

    if (!tables.includes('Follows')) {
      await queryInterface.createTable('Follows', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Users', key: 'id' }
      },
      followId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
      })
    }

    if (!tables.includes('Comments')) {
      await queryInterface.createTable('Comments', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        postId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Posts', key: 'id' }
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
      },
      content: Sequelize.TEXT,
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
      })
    }
  },
  async down(queryInterface) {
    const tables = await queryInterface.showAllTables()
    if (tables.includes('Comments')) {
      await queryInterface.dropTable('Comments')
    }
    if (tables.includes('Follows')) {
      await queryInterface.dropTable('Follows')
    }
    if (tables.includes('Posts')) {
      await queryInterface.dropTable('Posts')
    }
    if (tables.includes('Users')) {
      await queryInterface.dropTable('Users')
    }
  }
}
