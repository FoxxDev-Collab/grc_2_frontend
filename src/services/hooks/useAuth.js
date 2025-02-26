/* eslint-disable no-unused-vars */
// src/services/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/grc/AuthApi';

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        // Check if user is already authenticated
        if (authApi.isAuthenticated()) {
          // Get user from localStorage
          const storedUser = authApi.getCurrentUserFromStorage();
          setUser(storedUser);
          setIsAuthenticated(true);
          
          // Optionally refresh user data from server
          try {
            const currentUser = await authApi.getCurrentUser();
            setUser(currentUser);
          } catch (refreshError) {
            console.warn('Could not refresh user data:', refreshError);
            // Continue with stored user data
          }
        }
      } catch (err) {
        setError(err.message || 'Authentication error');
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authApi.login(credentials);
      setUser(result.user);
      setIsAuthenticated(true);
      
      return result;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Logout failed');
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Check if user has permission
  const hasPermission = useCallback((permission) => {
    if (!isAuthenticated || !user) return false;
    
    // Senior AOs have all permissions
    if (user.role === 'SENIOR_AO') return true;
    
    // For other roles, we would need to check the role permissions
    // This would typically involve a server call, but for simplicity
    // we'll just return true for now
    return true;
  }, [isAuthenticated, user]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    hasPermission
  };
};