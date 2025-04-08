import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Avatar, Button, TextField } from '@mui/material';
import { useAuth } from '../services/auth';
import axios from 'axios';

function FriendPage() {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get('/api/friends', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/user/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      await axios.post('/api/friends/add', { friend_id: friendId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchFriends();
      setSearchResults([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to add friend:', error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await axios.post('/api/friends/remove', { friend_id: friendId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchFriends();
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  if (!user) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Please log in to view your friends
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Friends
        </Typography>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </Box>

        {searchResults.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Search Results
            </Typography>
            <Grid container spacing={2}>
              {searchResults.map((result) => (
                <Grid item xs={12} sm={6} md={4} key={result.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={result.profile_picture} sx={{ mr: 2 }} />
                        <Typography variant="h6">{result.username}</Typography>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => handleAddFriend(result.id)}
                      >
                        Add Friend
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Typography variant="h6" gutterBottom>
          My Friends
        </Typography>
        <Grid container spacing={3}>
          {friends.map((friend) => (
            <Grid item xs={12} sm={6} md={4} key={friend.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={friend.profile_picture} sx={{ mr: 2 }} />
                    <Typography variant="h6">{friend.username}</Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveFriend(friend.id)}
                  >
                    Remove Friend
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {friends.length === 0 && (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
            You haven't added any friends yet. Search for users to connect with!
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default FriendPage; 