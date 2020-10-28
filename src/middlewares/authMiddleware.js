const { verifyTOTP, generateKey, generateTOTP } = require('utils/otp');
const user                                      = require('schemas/user');
const { findOne, }                              = require('utils/findData');
const { updateData }                            = require('utils/updateData');

const authMiddleware = async (ctx, next) => {
  const { url, header } = ctx.request;
  if (!url.match(/login|signup|health/g)) {
    const dbUser = await findOne('user', { _id: header['x-user'] });
    const usr    = dbUser && dbUser.temporary_key && verifyTOTP(dbUser.temporary_key, header.uuid);
    if (!usr) {
      ctx.throw(401, 'Unauthorized');
    } else {
      // renewed key
      const newKey = generateKey();
      Object.assign(dbUser, { temporary_key: newKey, latest: Math.floor(Date.now() / 1000) });
      // await dbUser.save()
      await updateData('user', dbUser);
      const token = generateTOTP(dbUser.temporary_key);
      ctx.set('uuid', token.uuid);
    }
  }
  await next();
};

module.exports = {
  authMiddleware
};