import { Container, Typography, Box, Avatar, Grid, Paper, Divider, useTheme, Button } from '@mui/material';
import { Group as TeamIcon, MusicNote as MissionIcon, LibraryBooks as StoryIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const teamMembers = [
  { name: 'Keysari Donascimento', role: 'Frontend Developer', avatar: '/src/images/keysari.jpg' },
  { name: 'Nicolas Sanchez', role: 'Full Stack Developer', avatar: '/src/images/nick.jpg' },
  { name: 'Nicole Drewry', role: 'Backend Developer', avatar: '/src/images/nicole.jpg' },
  { name: 'Feng Jie Guo', role: 'Full Stack Developer', avatar: '/src/images/jay.jpg' },
  { name: 'Elijah Hawthorne', role: 'Backend Developer', avatar: '/src/images/elijah.png' },
];

const RippleAvatar = ({ src, alt, size = 120 }) => (
  <Box sx={{ position: 'relative', width: size, height: size }}>
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <circle id="circle-clip" cx="50%" cy="50%" r="25%" />
        <clipPath id="avatar-clip">
          <use href="#circle-clip" />
        </clipPath>
      </defs>
    </svg>
    
    <Box
      component="svg"
      viewBox={`0 0 ${size} ${size}`}
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        filter: 'drop-shadow(0 4px 8px rgba(91, 202, 115, 0.55))'
      }}
    >
      <circle
        cx={size/2}
        cy={size/2}
        r={size/2 * 0.8}
        fill="rgba(87, 244, 121, 0.2)"
      />
      
      <image
        href={src}
        width="100%"
        height="100%"
        clipPath="url(#avatar-clip)"
        preserveAspectRatio="xMidYMid slice"
      />
    </Box>
  </Box>
);

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
              sx={{ 
                mt: 2,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            >
              Try It Now
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/src/images/album.jpg"
              alt="Album Artwork"
              sx={{ 
                width: '100%', 
                borderRadius: 2,
                boxShadow: 3
              }}
            />
          </Grid>
        </Grid>
      </Paper>

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
          sx={{ 
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            textTransform: 'none',
            borderRadius: 3,
            '&:hover': {
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}