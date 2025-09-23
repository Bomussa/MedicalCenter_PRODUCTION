const speakeasy = require('speakeasy');

const generateSecret = (name='AttarMedical') => speakeasy.generateSecret({ name });
const verifyToken = (secret, token) => speakeasy.totp.verify({ secret, encoding: 'base32', token });

module.exports = { generateSecret, verifyToken };
