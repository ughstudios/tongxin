'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  async up (queryInterface, Sequelize) {
    const password = await bcrypt.hash('password', 10)
    const now = new Date()
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'test',
          password,
          avatarUrl: 'https://placekitten.com/200/200',
          theme: 'light',
          createdAt: now,
          updatedAt: now
        }
      ],
      { ignoreDuplicates: true }
    )
    const [user] = await queryInterface.sequelize.query("SELECT id FROM Users WHERE username='test' LIMIT 1")
    const userId = user[0].id
    await queryInterface.bulkInsert('Posts', [{ userId, content: 'Hello world', createdAt: now, updatedAt: now }])
    const [post] = await queryInterface.sequelize.query('SELECT id FROM Posts LIMIT 1')
    const postId = post[0].id
    await queryInterface.bulkInsert('Comments', [{ postId, userId, content: 'Nice post', createdAt: now, updatedAt: now }])
  },
  async down (queryInterface) {
    await queryInterface.bulkDelete('Comments', null, {})
    await queryInterface.bulkDelete('Posts', null, {})
    await queryInterface.bulkDelete('Users', null, {})
  }
}
