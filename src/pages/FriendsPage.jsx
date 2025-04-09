import { Container, Typography, Box, Paper, Avatar, Button, Grid, useTheme } from '@mui/material';
import { useAuth } from '../services/auth.jsx';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

function FriendsPage() {
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Friends
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              Add Friend
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h5" component="h2">
                  My Friends
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                No friends yet. Start connecting with other music lovers!
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MusicNoteIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Friend Activity
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                No recent activity from friends. Add friends to see what they're listening to!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default FriendsPage; 