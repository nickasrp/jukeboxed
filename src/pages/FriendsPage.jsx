import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Avatar,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { PersonAdd, PersonRemove } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const FriendsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/friends', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }
      
      const data = await response.json();
      setFriends(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/user/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      const response = await fetch('/api/friends/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ friend_id: friendId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add friend');
      }
      
      setSnackbar({
        open: true,
        message: 'Friend added successfully',
        severity: 'success'
      });
      
      // Refresh friends list
      fetchFriends();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'
      });
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const response = await fetch('/api/friends/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ friend_id: friendId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove friend');
      }
      
      setSnackbar({
        open: true,
        message: 'Friend removed successfully',
        severity: 'success'
      });
      
      // Refresh friends list
      fetchFriends();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'
      });
    }
  };

  const isFriend = (userId) => {
    return friends.some(friend => friend._id === userId);
  };

  const handleCardClick = (username) => {
    navigate(`/friend-reviews/${username}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Friends
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users by username or display name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || !searchQuery.trim()}
        >
          Search
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {searchResults.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Search Results
          </Typography>
          <Grid container spacing={2}>
            {searchResults.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>
                <Card>
                  <CardContent 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                    onClick={() => handleCardClick(user.username)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={user.profilePicture}
                        alt={user.displayName}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">{user.displayName}</Typography>
                        <Typography color="textSecondary">@{user.username}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    {isFriend(user._id) ? (
                      <Button
                        startIcon={<PersonRemove />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFriend(user._id);
                        }}
                        color="error"
                      >
                        Remove Friend
                      </Button>
                    ) : (
                      <Button
                        startIcon={<PersonAdd />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddFriend(user._id);
                        }}
                        color="primary"
                      >
                        Add Friend
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box>
        <Typography variant="h6" gutterBottom>
          Your Friends
        </Typography>
        <Grid container spacing={2}>
          {friends.map((friend) => (
            <Grid item xs={12} sm={6} md={4} key={friend._id}>
              <Card>
                <CardContent 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                  onClick={() => handleCardClick(friend.username)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={friend.profilePicture}
                      alt={friend.displayName}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6">{friend.displayName}</Typography>
                      <Typography color="textSecondary">@{friend.username}</Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    startIcon={<PersonRemove />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFriend(friend._id);
                    }}
                    color="error"
                  >
                    Remove Friend
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FriendsPage; 