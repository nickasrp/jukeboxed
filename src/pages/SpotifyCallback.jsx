import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
      localStorage.setItem('spotify_access_token', accessToken);
      navigate('/music');
    } else {
      console.error('No access token received');
      navigate('/');
    }
  }, [navigate]);

  return null;
}

export default SpotifyCallback; 