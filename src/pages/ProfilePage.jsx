import { Container, Typography, Box, Paper, Avatar, Button, Grid, useTheme } from '@mui/material';
import { useAuth } from '../services/auth.jsx';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import StarIcon from '@mui/icons-material/Star';

function ProfilePage() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ 
          p: 4,
          mb: 4,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          color: 'white',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{ 
                width: 100, 
                height: 100, 
                mr: 3,
                border: '4px solid white',
              }}
            >
              <PersonIcon sx={{ fontSize: 50 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {user?.username || 'Profile'}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                {user?.email || 'No email provided'}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            Edit Profile
          </Button>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MusicNoteIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Favorite Songs
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                No favorite songs yet. Start adding your favorites!
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StarIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h5" component="h2">
                  My Reviews
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                No reviews yet. Share your thoughts on your favorite songs!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default ProfilePage; 