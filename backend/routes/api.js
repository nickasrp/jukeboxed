const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-googleId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
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

// Upload profile picture
router.post('/upload-profile-picture', protect, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's profile picture
    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ 
      message: 'Profile picture uploaded successfully',
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Search users
// @route   GET /api/user/search
// @access  Private
router.get('/user/search', protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user.id } // Exclude current user
    }).select('username displayName profilePicture email');

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user by username
// @route   GET /api/user/:username
// @access  Public
router.get('/user/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-googleId')
      .populate('friends', 'username displayName profilePicture');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user's friends
// @route   GET /api/friends
// @access  Private
router.get('/friends', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friends', 'username displayName profilePicture email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Add friend
// @route   POST /api/friends/add
// @access  Private
router.post('/friends/add', protect, async (req, res) => {
  try {
    const { friend_id } = req.body;
    
    if (!friend_id) {
      return res.status(400).json({ message: 'Friend ID is required' });
    }

    // Check if friend exists
    const friend = await User.findById(friend_id);
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already friends
    const user = await User.findById(req.user.id);
    if (user.friends.includes(friend_id)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    // Add friend
    user.friends.push(friend_id);
    await user.save();

    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Remove friend
// @route   POST /api/friends/remove
// @access  Private
router.post('/friends/remove', protect, async (req, res) => {
  try {
    const { friend_id } = req.body;
    
    if (!friend_id) {
      return res.status(400).json({ message: 'Friend ID is required' });
    }

    // Remove friend
    const user = await User.findById(req.user.id);
    user.friends = user.friends.filter(id => id.toString() !== friend_id);
    await user.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 