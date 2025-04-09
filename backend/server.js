const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');

// Load config
dotenv.config();

// Passport config
require('./config/passport')(passport);

// Connect to database
connectDB();

const app = express();

// CORS Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow requests from frontend
    credentials: true, // Allow cookies/session info if needed later
  })
);

// Body Parser Middleware (for req.body)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Passport Middleware
app.use(passport.initialize());

// Routes
app.use('/auth', require('./routes/auth')); // Mount auth routes
app.use('/api', require('./routes/api'));   // Mount API routes

app.get('/', (req, res) => {
  res.send('JukeBoxed API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
); 