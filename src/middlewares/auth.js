const { verifyJwt } = require('../utils/jwt');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  const payload = verifyJwt(token);

  if (!payload) return res.status(401).json({ message: 'Unauthorized' });

  req.user = payload; // { user_id, role }
  next();
}

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

module.exports = { requireAuth, requireRoles };
