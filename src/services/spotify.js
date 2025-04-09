import axios from 'axios';

// Read credentials from environment variables
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const SPOTIFY_SCOPES = 'user-read-private user-read-email user-library-read playlist-read-private playlist-read-collaborative';

// Check if credentials are provided
if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI) {
  console.error('Spotify credentials (VITE_SPOTIFY_CLIENT_ID, VITE_SPOTIFY_REDIRECT_URI) are missing in the .env file.');
}

export const getSpotifyAuthUrl = () => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI) {
    return null; // Or handle the error appropriately
  }
  return `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(SPOTIFY_SCOPES)}&response_type=token`;
};

export const searchTracks = async (query, accessToken) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        q: query,
        type: 'track',
        limit: 10
      }
    });
    return response.data.tracks.items;
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
};

export const getTrackDetails = async (trackId, accessToken) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting track details:', error);
    throw error;
  }
}; 