// Authentication Routes
// Handles user signup, login, logout, and token verification

const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/signup
 * Register a new user
 * Body: { username, email, password, fullName }
 */
router.post('/signup', [
  // Validation rules
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[0-9\s\-()]{7,20}$/).withMessage('Please provide a valid phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
], async (req, res) => {
  try {
    // Log incoming request for debugging
    console.log('📝 Signup request received:', { 
      username: req.body.username, 
      email: req.body.email,
      phone: req.body.phone,
      fullName: req.body.fullName 
    });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { username, email, phone, password, fullName } = req.body;

    // Check if user already exists
    console.log('🔍 Checking for existing user...');
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    const existingUser = existingEmail || existingUsername;
    if (existingUser) {
      const field = existingEmail ? 'email' : 'username';
      console.log(`⚠️ User already exists with ${field}:`, existingUser[field]);
      return res.status(400).json({ 
        success: false, 
        message: `A user with this ${field} already exists. Please use a different ${field} or login.` 
      });
    }

    // Create new user (password will be hashed by helper)
    console.log('👤 Creating new user...');
    let newUser;
    try {
      newUser = await User.create({
        username,
        email,
        phone,
        password,
        fullName,
      });
      console.log('✅ User saved successfully:', newUser.id);
    } catch (err) {
      console.error('✗ Error inserting user:', err);
      // handle unique constraint violation
      if (err && err.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({
          success: false,
          message: 'A user with that email or username already exists.'
        });
      }
      throw err;
    }

    // Generate JWT token
    console.log('🔐 Generating JWT token...');
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('✅ Token generated successfully');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: newUser.toJSON(),
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        success: false, 
        message: `A user with this ${field} already exists. Please use a different ${field} or login.` 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: messages 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error registering user. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/auth/login
 * Login a user
 * Body: { email, password }
 */
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error logging in',
      error: error.message 
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout a user (token-based, so this is mostly for frontend cleanup)
 */
router.post('/logout', verifyToken, (req, res) => {
  // With JWT, logout is handled client-side by deleting the token
  res.json({
    success: true,
    message: 'Logout successful. Please delete the token on the client side.',
  });
});

/**
 * GET /api/auth/verify
 * Verify if token is valid and return user info
 */
router.get('/verify', verifyToken, async (req, res) => {
  try {
    // Get user by ID from token
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying token' 
    });
  }
});

module.exports = router;
