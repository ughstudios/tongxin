const fs = require('fs')
const path = require('path')

// Ensure the data directory exists so migrations work in all environments
const dataDir = path.join(__dirname, '..', 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.join(dataDir, 'test.db')
  },
  production: {
    dialect: 'sqlite',
    storage: path.join(dataDir, 'prod.db')
  }
}
