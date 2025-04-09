import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth.jsx';
import { CircularProgress, Box, Typography } from '@mui/material';

function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleAuthCallback } = useAuth();
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      handleAuthCallback(token)
        .then(() => {
          // Redirect to home page or intended destination after successful login
          navigate('/');
        })
        .catch((err) => {
          console.error('Auth Callback Error:', err);
          setError('Login failed. Please try again.');
          // Optionally clear token if fetch failed
          localStorage.removeItem('token');
          // Redirect to login page or show error message
          // navigate('/login'); 
        });
    } else {
      // Handle cases where no token is present (e.g., direct access, error)
      console.error('No token found in callback URL');
      setError('Authentication failed or token missing.');
      // Redirect to login page
      // navigate('/login'); 
    }
  }, [location, navigate, handleAuthCallback]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '80vh' 
      }}
    >
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Authenticating...</Typography>
        </>
      )}
    </Box>
  );
}

export default AuthCallback; 