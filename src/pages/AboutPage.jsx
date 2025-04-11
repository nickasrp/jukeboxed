import { Container, Typography, Box, Avatar, Grid, Paper,Divider,useTheme,Button } from '@mui/material';
import { Group as TeamIcon, MusicNote as MissionIcon, LibraryBooks as StoryIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const teamMembers = [
  { name: 'Keysari Donascimento', role: 'Frontend Developer', avatar: '/src/images/keysari.jpg' },
  { name: 'Nicolas Sanchez', role: 'Backend Developer', avatar: '/src/images/nick.jpg' },
  { name: 'Nicole Drewry', role: 'Frontend Developer', avatar: '/src/images/nicole.jpg' },
  { name: 'Feng Jie Guo', role: 'Frontend Developer', avatar: '/src/images/jay.jpg' },
  { name: 'Elijah Hawthorne', role: 'Backend Developer', avatar: '/src/images/elijah.png' },
];

export default function AboutPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 2
          }}
        >
          About JukeBoxed
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Revolutionizing the music community through album reviews
        </Typography>
      </Box>

      {/* Mission Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 4 }}>
        <Grid container alignItems="center" spacing={4}>
          <Grid item xs={12} md={6}>
            <MissionIcon sx={{ 
              fontSize: 120, 
              color: theme.palette.secondary.main,
              mb: 2 
            }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Our Mission
            </Typography>
            <Typography paragraph>
              We believe music should be a shared experience. JukeBoxed connects people through 
              album rating and personalized reviews for your favorite artists.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/music')}
              sx={{ mt: 2 }}
            >
              Try It Now
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="src/images/album.jpg"
  
              sx={{ 
                width: '100%', 
                borderRadius: 2,
                boxShadow: 3
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Team Section */}
      <Box mb={6}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
          Meet The Team
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                
                  src={member.avatar}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mb: 2,
                    border: `4px solid ${theme.palette.primary.light}`
                  }}
                />
                <Typography variant="h6">{member.name}</Typography>
                <Typography color="text.secondary">{member.role}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box textAlign="center" mt={4}>
        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
          sx={{ px: 4 }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}