import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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
  getProfile: () => api.get('/profile'),
  getUserProfile: (username) => api.get(`/user/${username}`),
  searchUsers: (query) => api.get(`/user/search?q=${query}`),
};

export const reviews = {
  createReview: (data) => api.post('/review', data),
  getReviews: (userId) => api.get(`/reviews?user_id=${userId}`),
};

export const friends = {
  getFriends: () => api.get('/friends'),
  addFriend: (friendId) => api.post('/friends/add', { friend_id: friendId }),
  removeFriend: (friendId) => api.post('/friends/remove', { friend_id: friendId }),
};

export const spotify = {
  search: (query) => api.get(`/spotify/search?q=${query}`),
};

export default api; 