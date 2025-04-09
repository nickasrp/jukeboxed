const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login/failed`, session: false }), // Redirect on failure, don't use sessions
  (req, res) => {
    // Successful authentication
    // Generate JWT
    const payload = {
      id: req.user.id, // User ID from MongoDB
      name: req.user.displayName,
      email: req.user.email,
      // Add other relevant user details if needed
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' }, // Token expires in 1 day
      (err, token) => {
        if (err) {
            console.error('JWT Sign Error:', err);
            // Redirect to frontend with error indicator
            return res.redirect(`${process.env.CLIENT_URL}/login/error`);
        }
        // Redirect to frontend, passing the token
        // The frontend will handle storing the token
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
      }
    );
  }
);

module.exports = router; 