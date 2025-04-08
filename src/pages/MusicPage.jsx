import { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Grid, Card, CardContent, CardMedia, Button, useTheme, Paper } from '@mui/material';
import { searchTracks, getSpotifyAuthUrl } from '../services/spotify';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

function MusicPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) {
      window.location.href = getSpotifyAuthUrl();
      return;
    }

    setLoading(true);
    try {
      const results = await searchTracks(searchQuery, accessToken);
      setTracks(results);
    } catch (error) {
      console.error('Search error:', error);
      if (error.response?.status === 401) {
        // Token expired, redirect to auth
        window.location.href = getSpotifyAuthUrl();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ 
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          color: 'white',
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Search Music
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.primary.main,
                  '&::placeholder': {
                    color: theme.palette.primary.light,
                    opacity: 0.8,
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<MusicNoteIcon />}
              sx={{
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              Search
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {tracks.map((track) => (
            <Grid item xs={12} sm={6} md={4} key={track.id}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={track.album.images[0]?.url}
                  alt={track.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {track.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default MusicPage; 