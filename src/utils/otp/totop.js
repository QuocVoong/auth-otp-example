const { getCounter } = require('./getCounter');
const { getHMAC }    = require('./getHMAC');

const generateTOTP = (
  secret,
  timestamp = Date.now(),
  T0        = 0,
  Tx        = 2 * 60 * 60 * 1000
) => {
  const { counterBuffer, remainingTime } = getCounter(timestamp, T0, Tx);
  const hmac                             = getHMAC(secret, counterBuffer);
  return { uuid: hmac, remainingTime };
};

const verifyTOTP = (secret, token) => {
  const newToken = generateTOTP(secret);
  if (token === newToken.uuid) {
    return true;
  }
  return null;
};


module.exports = {
  generateTOTP,
  verifyTOTP
};
