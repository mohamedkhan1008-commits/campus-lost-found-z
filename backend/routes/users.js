// Users Routes
// Handles user dashboard and profile endpoints

const express = require('express');
const Item = require('../models/Item');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/users/dashboard
 * Get dashboard data for authenticated user
 * Includes: user info, items posted, statistics
 */
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    // Get user information
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Get items posted by user
    const userItems = await Item.find({ userId: req.userId, status: 'active' }, { sort: 'createdAt DESC' });

    // Count statistics
    const lostItems = userItems.filter(item => item.type === 'lost').length;
    const foundItems = userItems.filter(item => item.type === 'found').length;
    const activeItems = userItems.filter(item => item.status === 'active').length;
    const resolvedItems = userItems.filter(item => item.status === 'resolved').length;

    // Get site statistics
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const totalLostItems = await Item.countDocuments({ type: 'lost' });
    const totalFoundItems = await Item.countDocuments({ type: 'found' });

    res.json({
      success: true,
      user: user.toJSON(),
      userStats: {
        itemsPosted: userItems.length,
        lostItems,
        foundItems,
        activeItems,
        resolvedItems,
      },
      userItems,
      siteStats: {
        totalUsers,
        totalItems,
        totalLostItems,
        totalFoundItems,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard',
      error: error.message 
    });
  }
});

/**
 * GET /api/users/profile
 * Get current user profile
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
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
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile',
      error: error.message 
    });
  }
});

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { fullName, email } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update allowed fields
    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (email && email !== user.email) {
      // Check if email is already used
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already in use' 
        });
      }
      updates.email = email;
    }

    const updatedUser = await User.update(req.userId, updates);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.toJSON(),
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating profile',
      error: error.message 
    });
  }
});

module.exports = router;
