const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback', // Relative path, proxy handles base
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log(profile); // Uncomment to see profile data from Google
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0].value,
        };

        try {
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // User exists, pass them along
            done(null, user);
          } else {
            // User doesn't exist, create new user
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error('Passport Google Strategy Error:', err);
          done(err, null);
        }
      }
    )
  );

  // Serialize user to store minimal info in session/token
  passport.serializeUser((user, done) => {
    done(null, user.id); // Use MongoDB document ID
  });

  // Deserialize user to fetch full user data from ID
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
        done(err, null);
    }
  });
}; 