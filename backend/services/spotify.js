const axios = require('axios');
const qs = require('qs');

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Cache for user access tokens
const userTokenCache = new Map();

const getAccessToken = async () => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      qs.stringify({ grant_type: 'client_credentials' }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Spotify access token:', error.response?.data || error.message);
    throw error;
  }
};

const getUserAccessToken = async (code) => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      qs.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:5174/callback'
      }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
      }
    });

    const { access_token, refresh_token, expires_in } = response.data;
    const expirationTime = Date.now() + (expires_in * 1000);
    
    // Store the token with its expiration time
    userTokenCache.set(access_token, {
      token: access_token,
      refreshToken: refresh_token,
      expiresAt: expirationTime
    });

    return access_token;
  } catch (error) {
    console.error('Error getting user access token:', error.response?.data || error.message);
    throw error;
  }
};

const getTrendingSongs = async (userToken, page = 1, limit = 30) => {
  try {
    console.log('Fetching user\'s top tracks...');
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: {
        'Authorization': `Bearer ${userToken}`
      },
      params: {
        time_range: 'medium_term',
        limit: limit,
        offset: (page - 1) * limit
      }
    });

    console.log('Top tracks response:', JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data.items) {
      console.error('Invalid response format from Spotify API');
      throw new Error('Invalid response format from Spotify API');
    }

    const tracks = response.data.items.filter(track => track !== null);
    console.log('Extracted tracks:', tracks.length);

    if (tracks.length === 0) {
      console.error('No tracks found');
      throw new Error('No tracks found');
    }

    return {
      tracks: tracks,
      total: response.data.total || tracks.length,
      page,
      limit,
      hasMore: (page * limit) < (response.data.total || tracks.length)
    };
  } catch (error) {
    console.error('Error fetching top tracks:', error.response?.data || error.message);
    console.error('Full error:', error);
    throw error;
  }
};

// Search tracks
async function searchTracks(query, accessToken, offset = 0, limit = 50) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: query,
        type: 'track',
        limit,
        offset
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.data && response.data.tracks) {
      return {
        items: response.data.tracks.items,
        total: response.data.tracks.total,
        limit: response.data.tracks.limit,
        offset: response.data.tracks.offset
      };
    }
    throw new Error('No tracks found');
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
}

module.exports = {
  getAccessToken,
  getUserAccessToken,
  getTrendingSongs,
  searchTracks
}; 