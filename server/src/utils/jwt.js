const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'agrilink_super_secret_jwt_key_2026_production_ready',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'agrilink_super_secret_jwt_key_2026_production_ready'
  );
};

module.exports = {
  generateToken,
  verifyToken,
};
