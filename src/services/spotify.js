import axios from 'axios';

const SPOTIFY_CLIENT_ID = '57d8a1ea7ad64f84ad8965eecd6e1f18';
const SPOTIFY_REDIRECT_URI = 'http://localhost:5174/callback';
const SPOTIFY_SCOPES = 'user-read-private user-read-email user-library-read playlist-read-private playlist-read-collaborative';

export const getSpotifyAuthUrl = () => {
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