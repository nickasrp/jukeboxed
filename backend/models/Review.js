const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  spotifyTrackId: {
    type: String,
    required: true
  },
  trackName: {
    type: String,
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  albumImage: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a compound index to ensure one review per user per track
reviewSchema.index({ user: 1, spotifyTrackId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema); 