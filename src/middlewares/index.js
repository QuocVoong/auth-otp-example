const { authMiddleware } = require('./authMiddleware')
const { withAuthz } = require('./withAuthz')

module.exports = {
  authMiddleware,
  withAuthz
}
