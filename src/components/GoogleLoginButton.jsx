import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

// Define backend URL (consider making this an environment variable)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function GoogleLoginButton() {

  const handleLogin = () => {
    // Redirect the user to the backend Google OAuth endpoint
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <Button
      variant="contained"
      color="secondary" // Or choose another color
      startIcon={<GoogleIcon />}
      onClick={handleLogin}
      sx={{
        backgroundColor: 'white',
        color: '#757575', // Google grey
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      Sign in with Google
    </Button>
  );
}

export default GoogleLoginButton; 