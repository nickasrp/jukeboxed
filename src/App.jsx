import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './services/auth.jsx';
import theme from './theme.js';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MusicPage from './pages/MusicPage';
import ProfilePage from './pages/ProfilePage';
import FriendPage from './pages/FriendPage';
import PublicProfile from './pages/PublicProfile';
import SpotifyCallback from './pages/SpotifyCallback';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            
            <Route path="/music" element={<MusicPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/friends" element={<FriendPage />} />
            <Route path="/user/:username" element={<PublicProfile />} />
            <Route path="/callback" element={<SpotifyCallback />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 