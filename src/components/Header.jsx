import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, useTheme } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth.jsx';
import GoogleLoginButton from './GoogleLoginButton';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const getProfilePictureUrl = (picture) => {
    if (!picture) return null;
    if (picture.startsWith('http')) return picture;
    return `http://localhost:5000${picture}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <MusicNoteIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            JukeBoxed
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/music"
            startIcon={<MusicNoteIcon />}
            sx={{ 
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Music
          </Button>
          
          {user ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/profile"
                startIcon={<PersonIcon />}
                sx={{ 
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Profile
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/friends"
                startIcon={<PeopleIcon />}
                sx={{ 
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Friends
              </Button>
              <Avatar 
                src={getProfilePictureUrl(user.profilePicture)} 
                alt={user.username || user.displayName}
                sx={{ 
                  width: 36, 
                  height: 36, 
                  cursor: 'pointer',
                  border: `2px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    transform: 'scale(1.1)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
                onClick={() => navigate('/profile')}
              />
              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <GoogleLoginButton />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header; 