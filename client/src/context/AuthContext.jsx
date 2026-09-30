import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('agrilink_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('agrilink_token');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('agrilink_user', JSON.stringify(res.data.data));
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token, user: userData } = res.data;
      localStorage.setItem('agrilink_token', token);
      localStorage.setItem('agrilink_user', JSON.stringify(userData));
      setUser(userData);
      return res.data;
    }
  };

  const register = async (formData) => {
    const res = await API.post('/auth/register', formData);
    if (res.data.success) {
      const { token, user: userData } = res.data;
      localStorage.setItem('agrilink_token', token);
      localStorage.setItem('agrilink_user', JSON.stringify(userData));
      setUser(userData);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('agrilink_token');
    localStorage.removeItem('agrilink_user');
    setUser(null);
  };

  const updateProfileState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('agrilink_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfileState,
        isAuthenticated: !!user,
        isFarmer: user?.role === 'farmer',
        isBuyer: user?.role === 'buyer',
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
