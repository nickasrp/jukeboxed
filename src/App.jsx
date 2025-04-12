import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './services/auth.jsx';
import theme from './theme.js';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MusicPage from './pages/MusicPage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import PublicProfile from './pages/PublicProfile';
import SpotifyCallback from './pages/SpotifyCallback';
import AboutPage from './pages/AboutPage';
import AuthCallback from './pages/AuthCallback';
import TrendingSongsPage from './pages/TrendingSongsPage';
import ReviewsPage from './pages/ReviewsPage';
import FriendReviewsPage from './pages/FriendReviewsPage';

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
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/user/:username" element={<PublicProfile />} />
            <Route path="/callback" element={<SpotifyCallback />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/trending" element={<TrendingSongsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/friend-reviews/:username" element={<FriendReviewsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 