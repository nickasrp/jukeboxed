import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SetUsernameModal from '../components/SetUsernameModal'; // Import the modal

// Define backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false); // Modal state

  // Function to check if username needs to be set
  const checkUsername = (userData) => {
    if (userData && !userData.username) {
      console.log('User needs to set username, opening modal.');
      setIsUsernameModalOpen(true);
    } else {
      setIsUsernameModalOpen(false);
    }
  };

  // Function to fetch user profile using the token
  const fetchUserProfile = useCallback(async (currentToken) => {
    if (!currentToken) {
      setLoading(false);
      setUser(null); // Ensure user is null if no token
      setIsUsernameModalOpen(false); // Close modal if logged out
      return;
    }
    setLoading(true); // Set loading true when fetching
    try {
      const api = axios.create({
        baseURL: BACKEND_URL,
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      const response = await api.get('/api/profile'); 
      setUser(response.data);
      checkUsername(response.data); // Check username after fetch
    } catch (error) {
      console.error('Profile fetch error:', error);
      localStorage.removeItem('token'); 
      setToken(null);
      setUser(null);
      setIsUsernameModalOpen(false); // Close modal on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to load user on initial mount if token exists
  useEffect(() => {
    fetchUserProfile(token);
  }, [fetchUserProfile, token]);

  // Function called by AuthCallback page
  const handleAuthCallback = useCallback(async (receivedToken) => {
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    // setLoading(true); // fetchUserProfile will handle loading state
    await fetchUserProfile(receivedToken);
  }, [fetchUserProfile]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsUsernameModalOpen(false); // Close modal on logout
  }, []);

  // Updated by SetUsernameModal after successful PUT /api/username
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    checkUsername(updatedUserData); // Re-check (should close modal)
  };

  const value = {
    user,
    loading,
    token,
    logout,
    handleAuthCallback,
    updateUser, 
  };

  // Render loading indicator or children, plus the modal
  return (
    <AuthContext.Provider value={value}>
      {children}
      <SetUsernameModal 
        open={isUsernameModalOpen} 
        onClose={() => setIsUsernameModalOpen(false)} // Basic close handler (modal prevents closing via backdrop)
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 