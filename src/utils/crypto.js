const bcrypt        = require('bcrypt');
const { promisify } = require('util');

const genSaltAsync = promisify(bcrypt.genSalt);
const hashAsync    = promisify(bcrypt.hash);
const compareAsync = promisify(bcrypt.compare);

const hashPassword = async (password) => {
  const salt = await genSaltAsync(10);
  return await hashAsync(password, salt);
};

const comparePassword = async (password, passwordHash) => {
  return compareAsync(password, passwordHash);
};

module.exports = {
  hashPassword,
  comparePassword,
};
