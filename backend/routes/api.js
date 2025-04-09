const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
router.get('/profile', protect, (req, res) => {
  // req.user is attached by the protect middleware
  if (req.user) {
    res.json({
      id: req.user._id,
      googleId: req.user.googleId,
      username: req.user.username,
      displayName: req.user.displayName,
      email: req.user.email,
      profilePicture: req.user.profilePicture,
      createdAt: req.user.createdAt,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Set/Update username
// @route   PUT /api/username
// @access  Private
router.put('/username', protect, async (req, res) => {
  const { username } = req.body;

  if (!username || username.trim().length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters long' });
  }

  // Basic validation (add more as needed - e.g., regex for allowed characters)
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores.' });
  }

  try {
    // Check if username is already taken by another user
    const existingUser = await User.findOne({ username: username });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Find the logged-in user and update their username
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username: username },
      { new: true } // Return the updated document
    ).select('-__v');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: updatedUser._id,
      googleId: updatedUser.googleId,
      username: updatedUser.username,
      displayName: updatedUser.displayName,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      createdAt: updatedUser.createdAt,
    });

  } catch (error) {
    console.error('Set Username Error:', error);
    res.status(500).json({ message: 'Server error while updating username' });
  }
});

module.exports = router; 