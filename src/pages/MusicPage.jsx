import { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Grid, Card, CardContent, CardMedia, Button, useTheme, Paper, CircularProgress, Pagination } from '@mui/material';
import { searchTracks, getSpotifyAuthUrl } from '../services/spotify';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import api from '../services/api';
import ReviewDialog from '../components/ReviewDialog';

function MusicPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const resultsPerPage = 30;
  const theme = useTheme();
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('spotifyAccessToken');
    setIsAuthenticated(!!accessToken);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('spotifyAccessToken');
    if (!accessToken) {
      setError('Please connect to Spotify first');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/spotify/search', {
        params: { 
          query: searchQuery,
          accessToken: accessToken,
          page: 1,
          limit: resultsPerPage
        }
      });
      
      console.log('Search response:', response.data);
      
      if (response.data && response.data.success && response.data.data) {
        setAllResults(response.data.data.items);
        setTotalPages(response.data.data.totalPages);
        setCurrentPage(1);
        setSearchResults(response.data.data.items);
      } else {
        setError('No results found');
      }
    } catch (error) {
      console.error('Error searching tracks:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || 'Error searching tracks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage) => {
    const accessToken = localStorage.getItem('spotifyAccessToken');
    if (!accessToken) return;

    setLoading(true);
    try {
      const response = await api.get('/api/spotify/search', {
        params: { 
          query: searchQuery,
          accessToken: accessToken,
          page: newPage,
          limit: resultsPerPage
        }
      });
      
      console.log('Page change response:', response.data);
      
      if (response.data && response.data.success && response.data.data) {
        setSearchResults(response.data.data.items);
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || 'Error fetching page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackClick = (track) => {
    setSelectedTrack(track);
    setReviewDialogOpen(true);
  };

  const handleReviewDialogClose = (success) => {
    setReviewDialogOpen(false);
    setSelectedTrack(null);
    if (success) {
      handleSearch(searchQuery);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>
            {error}
          </Typography>
        ) : searchResults.length > 0 ? (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2}>
              {searchResults.map((track) => (
                <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={track.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        transition: 'transform 0.2s ease-in-out'
                      }
                    }}
                    onClick={() => handleTrackClick(track)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={track.album.images[0]?.url}
                      alt={track.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" noWrap>
                        {track.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {track.artists.map(artist => artist.name).join(', ')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="contained"
                  sx={{ mr: 2 }}
                >
                  Previous
                </Button>
                <Typography sx={{ mx: 2, display: 'flex', alignItems: 'center' }}>
                  Page {currentPage} of {totalPages}
                </Typography>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="contained"
                >
                  Next
                </Button>
              </Box>
            )}
          </Box>
        ) : null}
      </Box>

      <ReviewDialog
        open={reviewDialogOpen}
        onClose={handleReviewDialogClose}
        track={selectedTrack}
      />
    </Container>
  );
}

export default MusicPage; 