import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Avatar, Button, Grid, useTheme, Card, CardContent, List, ListItem, ListItemText, ListItemAvatar, Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import ProfilePictureUpload from '../components/ProfilePictureUpload';

const ProfilePage = () => {
  const { user, token, setUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
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
      } catch (error) {
        console.error('Error fetching profile:', error);
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

  const recentReviews = [
    { id: 1, song: "Bohemian Rhapsody", rating: 5, comment: "A masterpiece of rock opera!" },
    { id: 2, song: "Stairway to Heaven", rating: 5, comment: "Timeless classic with amazing guitar solo" },
    { id: 3, song: "Hotel California", rating: 4, comment: "Great storytelling and guitar work" }
  ];

  // Mock data for stats (replace with actual data later)
  const stats = {
    songs: 42,
    following: 128,
    followers: 256
  };

  if (!loading && !profileData && user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Paper sx={{ 
            p: 4,
            mb: 4,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
            color: 'white',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 3 }}>
                <Avatar
                  src={getProfilePictureUrl(user.profilePicture)}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mb: 2,
                    border: '4px solid white',
                  }}
                >
                  {!user.profilePicture && <PersonIcon sx={{ fontSize: 50 }} />}
                </Avatar>
                <ProfilePictureUpload onUploadSuccess={handleUploadSuccess} buttonText="Edit Profile" />
              </Box>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {user.username || user.email}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  }
                }}
                onClick={handleFavoritesClick}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MusicNoteIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h5" component="h2">
                      Favorite Songs
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    No favorite songs yet. Start adding your favorites!
                  </Typography>
                  
                  {/* Favorites Preview */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.primary.main }}>
                      Recent Favorites
                    </Typography>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                      {recentFavorites.map((favorite) => (
                        <React.Fragment key={favorite.id}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <MusicNoteIcon sx={{ color: theme.palette.primary.main }} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={favorite.title}
                              secondary={favorite.artist}
                            />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  }
                }}
                onClick={handleReviewsClick}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StarIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h5" component="h2">
                      My Reviews
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    No reviews yet. Share your thoughts on your favorite songs!
                  </Typography>
                  
                  {/* Reviews Preview */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.primary.main }}>
                      Recent Reviews
                    </Typography>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                      {recentReviews.map((review) => (
                        <React.Fragment key={review.id}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <StarIcon sx={{ color: theme.palette.primary.main }} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={review.song}
                              secondary={
                                <>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {Array(review.rating).fill('★').join('')}
                                  </Typography>
                                  <br />
                                  {review.comment}
                                </>
                              }
                            />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Loading profile...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ 
          p: 4,
          mb: 4,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          color: 'white',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 4 }}>
              <Avatar
                src={getProfilePictureUrl(profileData?.profilePicture || user?.profilePicture)}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mb: 2,
                  border: '4px solid white',
                }}
              >
                {!profileData?.profilePicture && !user?.profilePicture && <PersonIcon sx={{ fontSize: 60 }} />}
              </Avatar>
              <ProfilePictureUpload onUploadSuccess={handleUploadSuccess} buttonText="Edit Profile" />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '120px' }}>
              <Typography variant="h2" component="h1" sx={{ mb: 2, textTransform: 'capitalize' }}>
                {profileData?.username || user?.username || user?.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 8 }}>
                <Box 
                  sx={{ 
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                    }
                  }}
                  onClick={handleReviewsClick}
                >
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {stats.songs}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    Songs
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {stats.following}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    Following
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {stats.followers}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    Followers
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                p: 3, 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                }
              }}
              onClick={handleFavoritesClick}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MusicNoteIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="h5" component="h2">
                    Favorite Songs
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  No favorite songs yet. Start adding your favorites!
                </Typography>
                
                {/* Favorites Preview */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.primary.main }}>
                    Recent Favorites
                  </Typography>
                  <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {recentFavorites.map((favorite) => (
                      <React.Fragment key={favorite.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <MusicNoteIcon sx={{ color: theme.palette.primary.main }} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={favorite.title}
                            secondary={favorite.artist}
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                p: 3, 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                }
              }}
              onClick={handleReviewsClick}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StarIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="h5" component="h2">
                    My Reviews
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  No reviews yet. Share your thoughts on your favorite songs!
                </Typography>
                
                {/* Reviews Preview */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.primary.main }}>
                    Recent Reviews
                  </Typography>
                  <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {recentReviews.map((review) => (
                      <React.Fragment key={review.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <StarIcon sx={{ color: theme.palette.primary.main }} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={review.song}
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {Array(review.rating).fill('★').join('')}
                                </Typography>
                                <br />
                                {review.comment}
                              </>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProfilePage; 