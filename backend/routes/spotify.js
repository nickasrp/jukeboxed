const express = require('express');
const router = express.Router();
const spotifyService = require('../services/spotify');

// Handle Spotify OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Authorization code is required' });
    }

    const accessToken = await spotifyService.getUserAccessToken(code);
    res.json({ success: true, accessToken });
  } catch (error) {
    console.error('Error in Spotify callback:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's top tracks
router.get('/trending', async (req, res) => {
  try {
    const { page = 1, limit = 30, accessToken } = req.query;
    
    if (!accessToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'User access token is required' 
      });
    }

    console.log('Fetching trending songs with page:', page, 'limit:', limit);
    const result = await spotifyService.getTrendingSongs(accessToken, parseInt(page), parseInt(limit));
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in trending songs route:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Search tracks
router.get('/search', async (req, res) => {
  try {
    const { query, accessToken, page = 1, limit = 50 } = req.query;
    
    if (!accessToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'User access token is required' 
      });
    }

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search query is required' 
      });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    console.log('Searching tracks with query:', query, 'page:', page, 'limit:', limit, 'offset:', offset);
    const result = await spotifyService.searchTracks(query, accessToken, offset, parseInt(limit));
    
    res.json({
      success: true,
      data: {
        items: result.items,
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error in search route:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router; 