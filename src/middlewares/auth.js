// src/middlewares/auth.js
import jwt from 'jsonwebtoken';

// Middleware: Require authentication
export const requireAuth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expect: Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    console.log("Decoded token:", decoded);  // <-- DEBUG LOG
    req.user = decoded; // Attach decoded payload to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware: Require specific roles
export const requireRoles = (...roles) => {
  return (req, res, next) => {
    console.log("Checking role:", req.user?.role, "Required:", roles);  // <-- DEBUG LOG

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    // Ensure case-insensitive role comparison
    const userRole = req.user.role?.toLowerCase();
    const allowed = roles.map(r => r.toLowerCase());

    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
    }

    next();
  };
};
