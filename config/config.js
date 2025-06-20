module.exports = {
  development: {
    dialect: 'sqlite',
    storage: 'data/test.db'
  },
  production: {
    dialect: 'sqlite',
    storage: 'data/prod.db'
  }
}
