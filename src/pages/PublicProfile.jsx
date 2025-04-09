import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Avatar, Grid, Card, CardContent, Rating, Button } from '@mui/material';
import { useAuth } from '../services/auth';
import axios from 'axios';

function PublicProfile() {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    fetchProfile();
    if (user) {
      checkFriendship();
    }
  }, [username, user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/user/${username}`);
      setProfile(response.data);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const checkFriendship = async () => {
    try {
      const response = await axios.get('/api/friends', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsFriend(response.data.some(friend => friend.username === username));
    } catch (error) {
      console.error('Failed to check friendship:', error);
    }
  };

  const handleAddFriend = async () => {
    try {
      await axios.post('/api/friends/add', { friend_id: profile.id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsFriend(true);
    } catch (error) {
      console.error('Failed to add friend:', error);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await axios.post('/api/friends/remove', { friend_id: profile.id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsFriend(false);
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  if (!profile) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Loading profile...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            src={profile.profile_picture}
            alt={profile.username}
            sx={{ width: 100, height: 100, mr: 3 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
              {profile.username}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {profile.email}
            </Typography>
          </Box>
          {user && user.id !== profile.id && (
            <Button
              variant={isFriend ? "outlined" : "contained"}
              color={isFriend ? "error" : "primary"}
              onClick={isFriend ? handleRemoveFriend : handleAddFriend}
            >
              {isFriend ? "Remove Friend" : "Add Friend"}
            </Button>
          )}
        </Box>

        <Typography variant="h5" gutterBottom>
          Reviews
        </Typography>

        <Grid container spacing={3}>
          {reviews.map((review) => (
            <Grid item xs={12} key={review.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">
                      {review.track_name}
                    </Typography>
                    <Rating value={review.rating} readOnly />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {review.artists}
                  </Typography>
                  <Typography variant="body1">
                    {review.comment}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {reviews.length === 0 && (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
            {profile.username} hasn't reviewed any songs yet.
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default PublicProfile; 