import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  CircularProgress,
  Button,
  Avatar
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const FriendReviewsPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching user data for:', username);
        
        // First, get the user's ID from their username
        const userResponse = await fetch(`/api/user/${username}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.message || 'Failed to fetch user data');
        }

        const userData = await userResponse.json();
        console.log('User data fetched:', userData);
        setUser(userData);

        // Then fetch their reviews
        console.log('Fetching reviews for user ID:', userData._id);
        const reviewsResponse = await fetch(`/api/reviews/user/${userData._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!reviewsResponse.ok) {
          const errorData = await reviewsResponse.json();
          if (reviewsResponse.status === 404) {
            // No reviews found is not an error, just set empty array
            setReviews([]);
            return;
          }
          throw new Error(errorData.message || 'Failed to fetch reviews');
        }

        const reviewsData = await reviewsResponse.json();
        console.log('Reviews fetched:', reviewsData);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error in fetchFriendReviews:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendReviews();
  }, [username]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user.profilePicture}
              alt={user.displayName}
              sx={{ width: 56, height: 56 }}
            />
            <Box>
              <Typography variant="h4">{user.displayName}'s Reviews</Typography>
              <Typography color="textSecondary">@{user.username}</Typography>
            </Box>
          </Box>
        )}
      </Box>

      {reviews.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>
          No reviews yet
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {reviews.map((review) => (
            <Grid item xs={12} sm={6} md={4} key={review._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 6,
                  }
                }}
                onClick={() => window.open(`https://open.spotify.com/track/${review.spotifyTrackId}`, '_blank')}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={review.albumImage || 'https://via.placeholder.com/200'}
                  alt={review.trackName}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {review.trackName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {review.artistName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={review.rating} readOnly precision={0.5} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({review.rating})
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {review.reviewText}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FriendReviewsPage; 