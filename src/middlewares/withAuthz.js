const { intersect } = require('../utils/intersect');
const user          = require('schemas/user');
const { findOne } = require('utils/findData')

// acl should storage on redis or database, for simple example, write on memory.
const acl = [
  {
    role: 'user',
    permissions: [
      { resource: '/signup', action: '*'},
      { resource: '/login', action: '*'},
      { resource: '/logout', action: '*'},
      ]
  },
  {
    role: 'admin',
    permissions: [
      { resource: '*', action: '*'},
    ]
  }
];

const withAuthz = ({ allowedRoles = [] }) => {
  return async (ctx, next) => {
    const { url, method, header } = ctx.request;
    // const dbUser     = await user.findById({ _id: header['x-user'] });
    const dbUser     = await findOne('user', { _id: header['x-user'] })
    const userRoles  = (dbUser && dbUser.roles) || ['admin']; // @TODO temporary set role admin, need to adjust
    if (allowedRoles.length && intersect(allowedRoles, userRoles).length === 0) {
      ctx.throw(403, 'Forbidden');
    }

    const allowed = userRoles.some((role) => {
      return acl.findIndex((item) => {
        return item.role === role && url.includes(item.resource)
          && (item.action === '*' || item.action.includes(method))
      })
    })

    if (!allowed) {
      ctx.throw(403, 'Forbidden');
    }
    await next();
  };
};

module.exports = {
  withAuthz
};