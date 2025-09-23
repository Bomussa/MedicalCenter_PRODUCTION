const jwt = require('jsonwebtoken');

const sign = (payload, options={ expiresIn: '24h' }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

module.exports = { sign };
