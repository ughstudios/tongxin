'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash('admin123', 10)
    const now = new Date()
    await queryInterface.bulkInsert(
      'Users',
      [{ username: 'admin', password, theme: 'light', createdAt: now, updatedAt: now }],
      { ignoreDuplicates: true }
    )
    const [user] = await queryInterface.sequelize.query("SELECT id FROM Users WHERE username='admin' LIMIT 1")
    const userId = user[0].id
    await queryInterface.bulkInsert('Posts', [
      { userId, content: 'Welcome to TongXin', createdAt: now, updatedAt: now },
      { userId, content: 'Second post from admin', createdAt: now, updatedAt: now }
    ])
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Posts', null, {})
    await queryInterface.bulkDelete('Users', { username: 'admin' }, {})
  }
}
