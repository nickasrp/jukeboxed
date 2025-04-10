import { Container, Typography, Box, Grid, Paper, Button, useTheme, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { useAuth } from '../services/auth.jsx';
import { useNavigate } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import { useState, useEffect } from 'react';
import api from '../services/api';

const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=57d8a1ea7ad64f84ad8965eecd6e1f18&response_type=token&redirect_uri=http://localhost:5174/callback&scope=user-top-read`;

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchTopTracks = async () => {
      const accessToken = localStorage.getItem('spotifyAccessToken');
      if (!accessToken) {
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      try {
        const response = await api.get('/spotify/top-tracks', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (response.data && response.data.items) {
          setTopTracks(response.data.items.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching top tracks:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('spotifyAccessToken');
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, []);

  const handleConnectSpotify = () => {
    window.location.href = SPOTIFY_AUTH_URL;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ 
          p: 6,
          mb: 6,
          borderRadius: 6,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to JukeBoxed
          </Typography>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              mb: 4,
              opacity: 0.9,
              fontWeight: 400,
              textTransform: 'capitalize'
            }}
          >
            {user ? `Hello, ${user.username}!` : 'Discover and share your favorite music'}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<MusicNoteIcon />}
            onClick={() => navigate('/music')}
            sx={{
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            Start Exploring
          </Button>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 4,
              height: '100%',
              borderRadius: 4,
              background: 'rgba(0, 0, 0, 0.3)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <StarIcon sx={{ 
                  color: theme.palette.primary.main, 
                  mr: 1,
                  fontSize: '2rem',
                }} />
                <Typography 
                  variant="h4" 
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  Latest Reviews
                </Typography>
              </Box>
              <Typography 
                variant="body1" 
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  mb: 3,
                  color: 'rgba(255, 255, 255, 0.7)'
                }}
              >
                No reviews yet. Be the first to share your thoughts!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/reviews')}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1,
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                View All Reviews
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 4,
                height: '100%',
                borderRadius: 4,
                background: 'rgba(0, 0, 0, 0.3)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  cursor: 'pointer',
                },
              }}
              onClick={() => navigate('/trending')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUpIcon sx={{ 
                  color: theme.palette.primary.main, 
                  mr: 1,
                  fontSize: '2rem',
                }} />
                <Typography 
                  variant="h4" 
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  Your Top Tracks
                </Typography>
              </Box>
              {loading ? (
                <Typography variant="body1" color="text.secondary">
                  Loading your top tracks...
                </Typography>
              ) : isAuthenticated ? (
                <>
                  <Box sx={{ mb: 3 }}>
                    {topTracks.length > 0 ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {topTracks.map((track, index) => (
                          <Box 
                            key={track.id} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              p: 1,
                              borderRadius: 1,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <Typography sx={{ mr: 2, color: theme.palette.primary.main, minWidth: '20px' }}>
                              {index + 1}
                            </Typography>
                            <Avatar 
                              src={track.album.images[0].url} 
                              variant="rounded"
                              sx={{ width: 32, height: 32, mr: 1 }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 500,
                                  color: 'white',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {track.name}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                              >
                                {track.artists.map(artist => artist.name).join(', ')}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        No top tracks available
                      </Typography>
                    )}
                  </Box>
                  {topTracks.length > 0 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate('/trending')}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1,
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      View All Top Tracks
                    </Button>
                  )}
                </>
              ) : (
                <Box>
                  <Typography 
                    variant="body1" 
                    sx={{
                      fontSize: '1.1rem',
                      lineHeight: 1.6,
                      mb: 3,
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    Connect to Spotify to see your top tracks
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnectSpotify();
                    }}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1,
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Connect Spotify
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default HomePage; 