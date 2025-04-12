const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/authMiddleware');

// Create or update a review
router.post('/', protect, async (req, res) => {
  try {
    console.log('Received review submission:', req.body);
    console.log('User ID:', req.user.id);

    const { spotifyTrackId, trackName, artistName, albumImage, rating, reviewText } = req.body;

    // Check if review already exists
    let review = await Review.findOne({
      user: req.user.id,
      spotifyTrackId
    });

    console.log('Existing review:', review);

    if (review) {
      // Update existing review
      review.rating = rating;
      review.reviewText = reviewText;
      await review.save();
      console.log('Updated review:', review);
    } else {
      // Create new review
      review = await Review.create({
        user: req.user.id,
        spotifyTrackId,
        trackName,
        artistName,
        albumImage,
        rating,
        reviewText
      });
      console.log('Created new review:', review);
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error creating/updating review:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's reviews
router.get('/my-reviews', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get review for a specific track
router.get('/track/:trackId', protect, async (req, res) => {
  try {
    const review = await Review.findOne({
      user: req.user.id,
      spotifyTrackId: req.params.trackId
    });
    
    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   GET /api/reviews/user/:userId
// @desc    Get all reviews by a specific user
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate('user', 'username displayName profilePicture')
      .sort({ createdAt: -1 });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this user' });
    }

    res.json(reviews);
  } catch (err) {
    console.error('Error fetching user reviews:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 