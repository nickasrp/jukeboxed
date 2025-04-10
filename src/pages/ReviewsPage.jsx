import { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, useTheme, CircularProgress, Rating } from '@mui/material';
import { useAuth } from '../services/auth.jsx';
import api from '../services/api';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      console.log('Starting fetchReviews, user:', user);
      
      if (!user) {
        console.log('No user found, showing login message');
        setError('Please log in to view your reviews');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Making API request to /api/reviews/my-reviews');
        const response = await api.get('/api/reviews/my-reviews');
        console.log('API Response:', response.data);
        
        if (response.data && response.data.success) {
          console.log('Raw reviews data:', JSON.stringify(response.data.data, null, 2));
          
          // Ensure we have valid review data
          const validReviews = response.data.data.filter(review => {
            if (!review) return false;
            
            console.log('Checking review:', {
              hasTrackName: !!review.trackName,
              hasArtistName: !!review.artistName,
              hasAlbumImage: !!review.albumImage,
              hasRating: !!review.rating,
              hasReviewText: !!review.reviewText
            });

            return review.trackName && 
                   review.artistName && 
                   review.albumImage &&
                   review.rating;
          });
          
          console.log('Valid reviews:', JSON.stringify(validReviews, null, 2));
          setReviews(validReviews);
        } else {
          console.error('API returned unsuccessful response:', response.data);
          setError('Failed to fetch reviews');
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        console.error('Error details:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        
        if (err.response?.status === 401) {
          setError('Please log in to view your reviews');
        } else if (err.response?.status === 404) {
          setError('No reviews found');
        } else {
          setError(err.response?.data?.error || 'Failed to fetch reviews');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  console.log('Current state:', { loading, error, reviews: reviews.length, reviewsData: reviews });

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
        <Typography variant="h4" component="h1" gutterBottom>
          My Reviews
        </Typography>
        {reviews.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
            <Typography variant="body1" color="text.secondary">
              You haven't reviewed any songs yet.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {reviews.map((review) => {
              console.log('Rendering review:', JSON.stringify(review, null, 2));
              return (
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
              );
            })}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default ReviewsPage; 