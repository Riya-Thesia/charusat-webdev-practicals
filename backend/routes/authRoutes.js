const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { getIsConnected } = require('../config/db');

// In-Memory User Store Fallback when MongoDB is offline
const memoryUsers = [];

// Helper: Sign JWT Token
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'charusat_itue301_secret_key_2026_riya';
  return jwt.sign({ id: user._id || user.id, email: user.email, name: user.name }, secret, {
    expiresIn: '1h'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user & hash password with bcrypt
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Name, email, and password are required' });
    }

    // Check if user exists
    if (getIsConnected()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'User Exists', message: 'User with this email already exists' });
      }

      // Hash password using bcryptjs
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword
      });

      const token = generateToken(user);

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } else {
      // In-Memory Fallback
      const existing = memoryUsers.find((u) => u.email === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ error: 'User Exists', message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        id: `mem_usr_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password: hashedPassword
      };
      memoryUsers.push(newUser);

      const token = generateToken(newUser);
      return res.status(201).json({
        message: 'User registered successfully (In-Memory)',
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      });
    }
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT token
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Email and password are required' });
    }

    let userObj = null;

    if (getIsConnected()) {
      userObj = await User.findOne({ email: email.toLowerCase() });
    } else {
      userObj = memoryUsers.find((u) => u.email === email.toLowerCase());
    }

    if (!userObj) {
      return res.status(401).json({ error: 'Authentication Failed', message: 'Invalid email or password' });
    }

    // Compare hashed password using bcrypt.compare
    const isMatch = await bcrypt.compare(password, userObj.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Authentication Failed', message: 'Invalid email or password' });
    }

    const token = generateToken(userObj);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: userObj._id || userObj.id,
        name: userObj.name,
        email: userObj.email
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/auth/me
// @desc    Get currently logged-in user profile from decoded JWT token
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    let userDetails = null;

    if (getIsConnected()) {
      userDetails = await User.findById(userId).select('-password');
    } else {
      const found = memoryUsers.find((u) => u.id === userId);
      if (found) {
        const { password, ...rest } = found;
        userDetails = rest;
      }
    }

    if (!userDetails) {
      return res.status(404).json({ error: 'Not Found', message: 'User profile not found' });
    }

    return res.status(200).json({ user: userDetails });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
