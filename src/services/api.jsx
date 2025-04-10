import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  googleLogin: () => api.post('/auth/google'),
  setUsername: (username) => api.post('/username', { username }),
};

export const profile = {
  getProfile: () => api.get('/api/profile'),
  getUserProfile: (username) => api.get(`/api/user/${username}`),
  searchUsers: (query) => api.get(`/api/user/search?q=${query}`),
};

export const reviews = {
  createReview: (data) => api.post('/api/reviews', data),
  getReviews: (userId) => api.get(`/api/reviews?user_id=${userId}`),
};

export const friends = {
  getFriends: () => api.get('/api/friends'),
  addFriend: (friendId) => api.post('/api/friends/add', { friend_id: friendId }),
  removeFriend: (friendId) => api.post('/api/friends/remove', { friend_id: friendId }),
};

export const spotify = {
  search: (query, accessToken, page = 1, limit = 30) => api.get('/api/spotify/search', {
    params: {
      query,
      accessToken,
      page,
      limit
    }
  }),
};

export default api; 