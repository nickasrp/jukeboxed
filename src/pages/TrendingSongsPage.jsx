import { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, useTheme, CircularProgress, Pagination, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=57d8a1ea7ad64f84ad8965eecd6e1f18&response_type=token&redirect_uri=http://localhost:5174/callback&scope=user-top-read`;

const TrendingSongsPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalSongs, setTotalSongs] = useState(0);
  const [accessToken, setAccessToken] = useState(null);
  const songsPerPage = 30;
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage first
    const storedToken = localStorage.getItem('spotifyAccessToken');
    if (storedToken) {
      setAccessToken(storedToken);
      setLoading(false);
      return;
    }

    // If no token in localStorage, check URL hash
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      if (token) {
        setAccessToken(token);
        localStorage.setItem('spotifyAccessToken', token);
        // Clear the hash from URL
        window.history.replaceState({}, document.title, window.location.pathname);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      if (!accessToken) return;

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching songs with token:', accessToken.substring(0, 10) + '...');
        const response = await axios.get(`http://localhost:5000/api/spotify/trending`, {
          params: {
            page,
            limit: songsPerPage,
            accessToken
          }
        });
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          setSongs(response.data.data.tracks);
          setHasMore(response.data.data.hasMore);
          setTotalSongs(response.data.data.total);
        } else {
          console.error('API returned unsuccessful response:', response.data);
          setError(response.data.error || 'Failed to fetch top tracks');
        }
      } catch (err) {
        console.error('Error fetching songs:', err);
        if (err.response) {
          console.error('Error response:', err.response.data);
          if (err.response.status === 401 || err.response.status === 403) {
            // Token expired or invalid, clear it and redirect to auth
            localStorage.removeItem('spotifyAccessToken');
            setAccessToken(null);
            window.location.href = SPOTIFY_AUTH_URL;
          } else {
            setError(err.response.data.error || 'Failed to fetch top tracks');
          }
        } else if (err.request) {
          console.error('No response received:', err.request);
          setError('Could not connect to the server. Please make sure the backend is running on port 5000.');
        } else {
          console.error('Error setting up request:', err.message);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [page, accessToken]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConnectSpotify = () => {
    window.location.href = SPOTIFY_AUTH_URL;
  };

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-white mb-8">Connect with Spotify</h1>
        <p className="text-gray-400 mb-8">To view your top tracks, please connect your Spotify account.</p>
        <button
          onClick={handleConnectSpotify}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-colors duration-200"
        >
          Connect Spotify
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error loading top tracks</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Top Tracks
        </Typography>
        {error && (
          <Box sx={{ mb: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        <Grid container spacing={2}>
          {songs.map((song, index) => (
            <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={song.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                  }
                }}
                onClick={() => window.open(song.external_urls.spotify, '_blank')}
              >
                <CardMedia
                  component="img"
                  image={song.album.images[0]?.url}
                  alt={song.name}
                  sx={{ 
                    height: 120,
                    objectFit: 'cover'
                  }}
                />
                <CardContent sx={{ 
                  flexGrow: 1, 
                  p: 0.5,
                  '&:last-child': {
                    paddingBottom: 0.5
                  }
                }}>
                  <Typography 
                    variant="body2" 
                    noWrap
                    sx={{ 
                      fontSize: '0.75rem',
                      lineHeight: 1.2,
                      mb: 0.25
                    }}
                  >
                    {song.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    noWrap
                    sx={{ 
                      fontSize: '0.65rem',
                      lineHeight: 1.2,
                      display: 'block'
                    }}
                  >
                    {song.artists.map(artist => artist.name).join(', ')}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: '0.6rem',
                      lineHeight: 1.2,
                      display: 'block'
                    }}
                  >
                    #{index + 1 + ((page - 1) * songsPerPage)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            variant="contained"
            sx={{ mr: 2 }}
          >
            Previous
          </Button>
          <Typography sx={{ mx: 2, display: 'flex', alignItems: 'center' }}>
            Page {page} of {Math.ceil(totalSongs / songsPerPage)}
          </Typography>
          <Button
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasMore}
            variant="contained"
          >
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TrendingSongsPage; 