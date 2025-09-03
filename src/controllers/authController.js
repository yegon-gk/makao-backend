// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

// ===== REGISTER =====
export const register = async (req, res) => {
  try {
    const { username, email, password, phone, role } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const userRole = role?.trim().toLowerCase() || "lister"; // Default role to lister

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });
    if (existingEmail) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Check if phone already exists (if provided)
    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        return res.status(409).json({ message: 'User with this phone already exists' });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username: trimmedUsername,
        email: trimmedEmail,
        password_hash: hashedPassword,
        phone: phone || null,
        role: userRole,
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        role: true,
        phone: true,
      },
    });

    console.log("New user registered:", user);

    return res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Register error:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Duplicate entry detected' });
    }

    return res.status(500).json({ message: 'Server error' });
  }
};

// ===== LOGIN =====
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT with user_id included
    const token = jwt.sign(
      {
        user_id: user.user_id,  // <-- FIX: use user_id so requireAuth works correctly
        email: user.email,
        role: user.role || "lister",
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    console.log("User logged in:", { user_id: user.user_id, role: user.role });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
