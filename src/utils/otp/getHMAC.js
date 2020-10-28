const crypto = require('crypto');

const getHMAC = (secret, message) => {
  return crypto
    .createHmac('sha1', secret)
    .update(message)
    .digest('hex');
};

module.exports = {
  getHMAC
};