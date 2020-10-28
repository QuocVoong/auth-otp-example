const { userService } = require('services');

const signup = async (ctx) => {
  const { body, header } = ctx.request;
  const device           = header['x-device'];

  try {
    const { success, data, error, status } = await userService.createUser(body, device);
    ctx.status                             = error ? status || 422 : 200;
    ctx.body                               = { success, data, error };
  } catch (error) {
    ctx.status = 500;
    throw error;
  }
};

const login = async (ctx) => {
  const { body, header } = ctx.request;
  const device   = header['x-device'];

  try {
    const { success, userId, uuid, data, error, status } = await userService.loginUser(body, device);
    ctx.status                             = error ? status : 200;
    ctx.body                               = { success, data, error };
    ctx.set('uuid', uuid);
    // x-user should encode
    ctx.set('x-user', userId);
  } catch (error) {
    ctx.status = 500;
    throw error;
  }
};

const logout = async (ctx) => {
  const { header } = ctx.request;
  const userId = header['x-user'];
  try {
    const { success, data, error, status } = await userService.logoutUser(userId);
    ctx.status                             = error ? status || 422 : 200;
    ctx.body                               = { success, data, error };
    ctx.remove('uuid');
    ctx.remove('x-user');
  } catch (error) {
    console.log('error: ', error);
    ctx.status = 500;
    throw error;
  }
};

module.exports = {
  signup,
  login,
  logout
};
