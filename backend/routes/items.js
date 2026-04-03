// Items Routes
// Handles CRUD operations for lost/found items

const express = require('express');
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const { verifyToken, optionalVerifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/items
 * Create a new lost or found item
 * Requires: Authentication token
 * Body: { title, category, type, description, location, dateTime, imageUrl }
 */
router.post('/', verifyToken, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').isIn(['Electronics', 'Documents', 'Accessories', 'Books', 'Keys', 'Clothing', 'Other']).withMessage('Invalid category'),
  body('type').isIn(['lost', 'found']).withMessage('Type must be lost or found'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('dateTime').isISO8601().withMessage('Invalid date format'),
  body('contactPhone')
    .optional()
    .trim()
    .matches(/^\+?[0-9\s\-()]{7,20}$/)
    .withMessage('Please provide a valid contact phone number'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, category, type, description, location, dateTime, imageUrl, contactPhone, relatedItemId } = req.body;

    // Create new item with user ID from token
    const newItem = await Item.create({
      title,
      category,
      type,
      description,
      location,
      dateTime: new Date(dateTime).toISOString(),
      contactPhone: contactPhone || null,
      imageUrl: imageUrl || null,
      userId: req.userId, // Get user ID from verified token
      relatedItemId: relatedItemId || null,
    });

    res.status(201).json({
      success: true,
      message: 'Item posted successfully',
      item: newItem,
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating item',
      error: error.message 
    });
  }
});

/**
 * GET /api/items
 * Get all items with optional filters
 * Query: { type: 'lost'|'found', category: 'Electronics'|etc, limit: number, page: number }
 */
router.get('/', optionalVerifyToken, async (req, res) => {
  try {
    const { type, category, limit = 20, page = 1 } = req.query;

    // Build filter object
    const filter = {};
    if (type && ['lost', 'found'].includes(type)) filter.type = type;
    if (category) filter.category = category;
    filter.status = 'active'; // Only show active items

    // Calculate pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Fetch items from database with joined user info
    const items = await Item.find(filter, {
      limit: limitNum,
      offset: skip,
      sort: 'createdAt DESC',
    });

    // Contact details are shown for everyone so people can contact posters to retrieve items

    // Get total count for pagination
    const total = await Item.countDocuments(filter);

    res.json({
      success: true,
      items,
      pagination: {
        total,
        pages: Math.ceil(total / limitNum),
        currentPage: pageNum,
      },
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching items',
      error: error.message 
    });
  }
});

/**
 * GET /api/items/:id
 * Get a single item by ID
 */
router.get('/:id', optionalVerifyToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    // Contact details are shown for everyone so people can contact posters to retrieve items

    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }

    res.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching item',
      error: error.message 
    });
  }
});

/**
 * DELETE /api/items/:id
 * Delete an item (only the owner can delete)
 * Requires: Authentication token
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }

    // Robust owner ID resolution for object/id type variations
    const itemOwnerId = item.userId && typeof item.userId === 'object'
      ? (item.userId.id || item.userId._id || item.userId)
      : item.userId;

    if (String(itemOwnerId) !== String(req.userId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own items' 
      });
    }

    // Delete the item
    await Item.deleteById(req.params.id);

    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting item',
      error: error.message 
    });
  }
});

/**
 * PUT /api/items/:id/status
 * Update item status (mark as resolved)
 * Requires: Authentication token
 */
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'resolved'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }

    // Robust owner ID resolution for object/id type variations
    const itemOwnerId = item.userId && typeof item.userId === 'object'
      ? (item.userId.id || item.userId._id || item.userId)
      : item.userId;

    if (String(itemOwnerId) !== String(req.userId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only update your own items' 
      });
    }

    const updated = await Item.updateStatus(req.params.id, status);

    res.json({
      success: true,
      message: 'Item status updated',
      item: updated,
    });
  } catch (error) {
    console.error('Error updating item status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating item status',
      error: error.message 
    });
  }
});

/**
 * POST /api/items/:id/remove-match
 * Remove (delete) a matched lost/found item pair.
 * Requires authenticated user and item must be matched (relatedItemId exists).
 */
router.post('/:id/remove-match', verifyToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const requesterId = String(req.userId);
    const ownerIdValue = item.userId && typeof item.userId === 'object'
      ? (item.userId.id || item.userId._id || item.userId)
      : item.userId;
    const ownerId = String(ownerIdValue);

    if (requesterId !== ownerId) {
      return res.status(403).json({ success: false, message: 'Not authorized to remove this item' });
    }

    let linkedItem = null;
    if (item.relatedItemId) {
      linkedItem = await Item.findById(item.relatedItemId);
    } else {
      const matching = await Item.find({ relatedItemId: item.id });
      if (matching.length > 0) {
        linkedItem = matching[0];
      }
    }

    if (!linkedItem) {
      return res.status(400).json({ success: false, message: 'No linked item found to remove' });
    }

    await Item.deleteById(item.id);
    if (linkedItem.id) {
      await Item.deleteById(linkedItem.id);
    }

    res.json({
      success: true,
      message: 'Matched items removed successfully',
    });
  } catch (error) {
    console.error('Error removing matched items:', error);
    res.status(500).json({ success: false, message: 'Error removing matched items', error: error.message });
  }
});

module.exports = router;
