const userService = require('services/userService');

const findUsers = async (ctx) => {
  const { query }                                   = ctx.request;
  const { skip, limit, fields, sort, ...restQuery } = query;
  const select                                      = fields ? fields.split(',')
    .reduce((acc, f) => {
      acc[f] = 1;
      return acc;
    }, {}) : null;

  try {
    const { data, error, status } = await userService.findUsers({
      find:  restQuery,
      skip:  skip && +skip,
      limit: limit && +limit,
      select,
      sort
    });
    ctx.status                    = error ? status || 422 : 200;
    ctx.body                      = { data, error };
  } catch (error) {
    ctx.status = 500;
  }
};

module.exports = {
  findUsers
};
