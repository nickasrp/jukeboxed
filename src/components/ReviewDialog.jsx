import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import api from '../services/api';

const ReviewDialog = ({ open, onClose, track }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    if (open && track) {
      fetchExistingReview();
    }
  }, [open, track]);

  const fetchExistingReview = async () => {
    try {
      const response = await api.get(`/api/reviews/track/${track.id}`);
      console.log('Fetching existing review response:', response.data);
      if (response.data.success && response.data.data) {
        setExistingReview(response.data.data);
        setRating(response.data.data.rating);
        setReviewText(response.data.data.reviewText);
      }
    } catch (error) {
      console.error('Error fetching review:', error);
      // Don't show error to user if no review exists
      if (error.response?.status !== 404) {
        console.error('Error response:', error.response?.data);
      }
    }
  };

  const handleSubmit = async () => {
    if (!track || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to submit a review');
        setLoading(false);
        return;
      }

      const reviewData = {
        spotifyTrackId: track.id,
        trackName: track.name,
        artistName: track.artists.map(artist => artist.name).join(', '),
        albumImage: track.album.images[0]?.url,
        rating,
        reviewText
      };

      console.log('Submitting review:', reviewData);
      console.log('Using token:', token);
      
      const response = await api.post('/api/reviews', reviewData);
      console.log('Review submission response:', response.data);
      
      if (response.data.success) {
        onClose(true);
      } else {
        setError(response.data.error || 'Error submitting review. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      console.error('Error response:', err.response?.data);
      if (err.response?.status === 401) {
        setError('Please log in to submit a review');
      } else {
        setError(err.response?.data?.error || 'Error submitting review. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setReviewText('');
    setError(null);
    onClose(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {existingReview ? 'Update Review' : 'Review Song'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {track?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {track?.artists.map(artist => artist.name).join(', ')}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="large"
          />
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Review (optional)"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          sx={{ mb: 2 }}
        />
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !rating}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog; 