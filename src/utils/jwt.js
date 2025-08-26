const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'dev_secret';

function signJwt(payload, options = { expiresIn: '7d' }) {
  return jwt.sign(payload, secret, options);
}

function verifyJwt(token) {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    return null;
  }
}

module.exports = { signJwt, verifyJwt };
