import { Button, Box } from '@mui/material';
import { useAuth } from '../services/auth.jsx';
import GoogleIcon from '@mui/icons-material/Google';

function GoogleLoginButton() {
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleGoogleLogin}
      startIcon={<GoogleIcon />}
      sx={{
        backgroundColor: '#4285F4',
        color: 'white',
        '&:hover': {
          backgroundColor: '#357ABD',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        },
        '& .MuiButton-startIcon': {
          marginRight: 1,
        },
      }}
    >
      Sign in with Google
    </Button>
  );
}

export default GoogleLoginButton; 