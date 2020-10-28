const { signup, login, logout } = require('./auth')
const { findUsers } = require('./user')
const { withAuthz } = require('middlewares')

module.exports = (router) => {
  router.post('/signup', signup);
  router.post('/login', login);
  router.post('/logout', logout);
  router.get('/user/search', withAuthz({ allowedRoles: [] }), findUsers);
};
