const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
const path = require('path');

// Load config
dotenv.config();

// Passport config
require('./config/passport')(passport);

// Connect to database
connectDB();

const app = express();

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// CORS Middleware
app.use(
  cors({
    origin: 'http://localhost:5174',
    credentials: true,
  })
);

// Body Parser Middleware (for req.body)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport Middleware
app.use(passport.initialize());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/auth', require('./routes/auth')); // Mount auth routes
app.use('/api', require('./routes/api'));   // Mount API routes
app.use('/api/spotify', require('./routes/spotify'));
app.use('/api/reviews', require('./routes/reviews'));

app.get('/', (req, res) => {
  res.send('JukeBoxed API Running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for: http://localhost:5174`);
}); 