import { Container, Typography, Box, Grid, Paper, Button, useTheme, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { useAuth } from '../services/auth.jsx';
import { useNavigate } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
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
      <Box sx={{ 
        my: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to JukeBoxed
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Discover, review, and share your favorite music with friends
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/music')}
            >
              <MusicNoteIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Search Music
              </Typography>
              <Typography color="text.secondary" align="center">
                Find and review your favorite songs
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/trending')}
            >
              <TrendingUpIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Your Top Tracks
              </Typography>
              <Typography color="text.secondary" align="center">
                Your most listened tracks
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/reviews')}
            >
              <StarIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Your Reviews
              </Typography>
              <Typography color="text.secondary" align="center">
                View and manage your song reviews
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/friends')}
            >
              <GroupIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Friends
              </Typography>
              <Typography color="text.secondary" align="center">
                Connect with other music lovers
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Button
          variant="outlined"
          startIcon={<InfoIcon />}
          onClick={() => navigate('/about')}
          sx={{ mt: 8 }}
        >
          About JukeBoxed
        </Button>
      </Box>
    </Container>
  );
}

export default HomePage; 