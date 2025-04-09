import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../services/auth.jsx';
import axios from 'axios';

// Define backend URL (can be centralized)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function SetUsernameModal({ open, onClose }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, updateUser } = useAuth(); // Get token and updateUser function

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username.trim() || !token) return;

    setLoading(true);
    setError('');

    try {
      const api = axios.create({
        baseURL: BACKEND_URL,
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await api.put('/api/username', { username });
      updateUser(response.data); // Update user state in AuthProvider
      setUsername(''); // Clear input
      onClose(); // Close the modal on success
    } catch (err) {
      console.error('Set username error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to set username. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      // Prevent closing by clicking backdrop
      // onClose={onClose} 
      aria-labelledby="set-username-modal-title"
      aria-describedby="set-username-modal-description"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography id="set-username-modal-title" variant="h6" component="h2">
          Choose Your Username
        </Typography>
        <Typography id="set-username-modal-description" sx={{ mt: 1, mb: 2 }}>
          Please set a unique username to continue.
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!error}
          helperText={error || 'Must be 3+ characters (letters, numbers, underscores only).'}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 2 }}
          disabled={loading || !username.trim()}
        >
          {loading ? <CircularProgress size={24} /> : 'Set Username'}
        </Button>
      </Box>
    </Modal>
  );
}

export default SetUsernameModal; 