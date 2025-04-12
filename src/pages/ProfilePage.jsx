import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Avatar, Button, Grid, useTheme, Card, CardContent, List, ListItem, ListItemText, ListItemAvatar, Divider, CardMedia, Rating, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import api from '../services/api';

const ProfilePage = () => {
  const { user, token, setUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        console.log('No token available');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile with token:', token);
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Profile data received:', data);
        setProfileData(data);
        
        // Fetch recent reviews
        const reviewsResponse = await api.get('/api/reviews/my-reviews');
        if (reviewsResponse.data && reviewsResponse.data.success) {
          // Sort reviews by date and take the 6 most recent
          const sortedReviews = reviewsResponse.data.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6);
          setRecentReviews(sortedReviews);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleUploadSuccess = (newProfilePicture) => {
    setProfileData(prev => ({
      ...prev,
      profilePicture: newProfilePicture
    }));
    
    if (user) {
      const updatedUser = { ...user, profilePicture: newProfilePicture };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const getProfilePictureUrl = (picture) => {
    if (!picture) return null;
    if (picture.startsWith('http')) return picture;
    return `http://localhost:5000${picture}`;
  };

  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  const handleReviewsClick = () => {
    navigate('/reviews');
  };

  // Mock data for previews (replace with actual data later)
  const recentFavorites = [
    { id: 1, title: "Bohemian Rhapsody", artist: "Queen" },
    { id: 2, title: "Stairway to Heaven", artist: "Led Zeppelin" },
    { id: 3, title: "Hotel California", artist: "Eagles" }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography color="error" variant="h6">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4,
            borderRadius: '20px',
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
            color: 'white',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
            }
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={getProfilePictureUrl(profileData?.profilePicture || user?.profilePicture)}
                sx={{ 
                  width: 150, 
                  height: 150, 
                  mb: 2,
                  border: '4px solid white',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                }}
              />
              <ProfilePictureUpload 
                onUploadSuccess={handleUploadSuccess} 
                buttonText="Edit Profile"
                buttonStyle={{
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
                }}
              >
                {profileData?.username || 'User'}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
                }}
              >
                Member since: {new Date(profileData?.createdAt || user?.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Recent Reviews Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Recent Reviews
          </Typography>
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
            onClick={() => navigate('/reviews')}
          >
            View All Reviews
          </Button>
        </Box>
        {recentReviews.length > 0 ? (
          <Grid container spacing={3}>
            {recentReviews.map((review) => (
              <Grid item xs={12} sm={6} md={4} key={review._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.2s ease-in-out',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    }
                  }}
                  onClick={() => window.open(`https://open.spotify.com/track/${review.spotifyTrackId}`, '_blank')}
                >
                  <CardMedia
                    component="img"
                    image={review.albumImage}
                    alt={review.trackName}
                    sx={{ 
                      height: 200,
                      objectFit: 'cover'
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap sx={{ color: 'white' }}>
                      {review.trackName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {review.artistName}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                      <Rating value={review.rating} readOnly precision={0.5} />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({review.rating})
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      {review.reviewText || 'No review text provided'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <Typography variant="body1" color="text.secondary">
              You haven't reviewed any songs yet.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ProfilePage; 