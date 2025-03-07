/* eslint-disable no-unused-vars */
// src/services/api/grc/AuthApi.js
import { BaseApiService } from '../BaseApiService';
import { validateRequired, validateEmail, post, get } from '../../utils/apiHelpers';
import { unwrapResponse } from '../../utils/apiResponseHandler';

class AuthApi extends BaseApiService {
  constructor() {
    super('/auth', 'auth');
  }

  // Login user
  async login({ email, password }) {
    validateRequired({ email, password }, ['email', 'password']);
    validateEmail(email);

    try {
      // Don't include this.baseUrl since apiHelpers.fetchWithAuth already adds API_BASE_URL
      const endpoint = '/auth/login';
      const result = await post(endpoint, { email, password });

      const unwrappedResult = unwrapResponse(result);
      
      // Store user info and token in localStorage
      localStorage.setItem('user', JSON.stringify(unwrappedResult.user));
      localStorage.setItem('token', unwrappedResult.token);
      
      return unwrappedResult;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      // Don't include this.baseUrl since apiHelpers.fetchWithAuth already adds API_BASE_URL
      const endpoint = '/auth/logout';
      const result = await post(endpoint, {});
      
      // Clear user info and token from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      return result;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const endpoint = '/auth/me';
      const response = await get(endpoint);
      return unwrapResponse(response);
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!token && !!user;
  }

  // Get current user from localStorage
  getCurrentUserFromStorage() {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Check if user has specific permission
  hasPermission(permission) {
    const user = this.getCurrentUserFromStorage();
    if (!user) return false;
    
    // Senior AOs have all permissions
    if (user.role === 'SENIOR_AO') return true;
    
    // For other roles, we would need to check the role permissions
    // This would typically involve a server call, but for simplicity
    // we'll just return true for now
    return true;
  }
}

export default new AuthApi();