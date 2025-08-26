const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const { signJwt } = require('../utils/jwt');

exports.register = async (req, res) => {
  const { email, password, role, phone } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'email, password, role required' });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ message: 'Email already in use' });

  const password_hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password_hash, role, phone },
    select: { user_id: true, email: true, role: true },
  });

  const token = signJwt({ user_id: user.user_id, role: user.role });
  res.status(201).json({ token, user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signJwt({ user_id: user.user_id, role: user.role });

  res.json({
    token,
    user: { user_id: user.user_id, email: user.email, role: user.role },
  });
};
