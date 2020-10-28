const { generateTOTP, verifyTOTP } = require('./totop')
const { generateKey } = require('./generateKey')

module.exports = {
  generateTOTP,
  verifyTOTP,
  generateKey
}