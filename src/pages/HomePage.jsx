import { Container, Typography, Box, Grid, Paper, Button, useTheme } from '@mui/material';
import { useAuth } from '../services/auth.jsx';
import { useNavigate } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ 
          p: 6,
          mb: 6,
          borderRadius: 6,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to JukeBoxed
          </Typography>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              mb: 4,
              opacity: 0.9,
              fontWeight: 400,
            }}
          >
            {user ? `Hello, ${user.username}!` : 'Discover and share your favorite music'}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<MusicNoteIcon />}
            onClick={() => navigate('/music')}
            sx={{
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            Start Exploring
          </Button>
        </Paper>
        <Paper sx={{ 
          p: 4,
          mb: 6,
          borderRadius: 4,
          background: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <GroupIcon sx={{ 
              color: theme.palette.primary.main, 
              mr: 1,
              fontSize: '2rem',
            }} />
            <Typography 
              variant="h4" 
              component="h2"
              sx={{
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              About JukeBoxed
            </Typography>
          </Box>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{
              fontSize: '1.1rem',
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            JukeBoxed is a music discovery platform that connects people through collaborative playlists 
            and AI-powered recommendations. Our mission is to make music sharing social and effortless.
          </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/about')}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
            } }
            >
              Learn More
            </Button>
          </Paper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 4,
              height: '100%',
              borderRadius: 4,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <StarIcon sx={{ 
                  color: theme.palette.primary.main, 
                  mr: 1,
                  fontSize: '2rem',
                }} />
                <Typography 
                  variant="h4" 
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Latest Reviews
                </Typography>
              </Box>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                No reviews yet. Be the first to share your thoughts!
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              >
                View All Reviews
              </Button>
            </Paper>
          </Grid>

        

          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 4,
              height: '100%',
              borderRadius: 4,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUpIcon sx={{ 
                  color: theme.palette.primary.main, 
                  mr: 1,
                  fontSize: '2rem',
                }} />
                <Typography 
                  variant="h4" 
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Trending Songs
                </Typography>
              </Box>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                No trending songs yet. Start exploring to discover popular tracks!
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              >
                View Trending
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default HomePage;