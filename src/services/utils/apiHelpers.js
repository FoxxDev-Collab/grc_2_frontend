// src/services/utils/apiHelpers.js
import { API_BASE_URL } from '../config';

// Error class
export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Add a response unwrapper
export const unwrapResponse = (response) => {
  // If response is already unwrapped or null/undefined
  if (!response || typeof response !== 'object' || !('success' in response)) {
    return response;
  }
  
  // Check if it's a success response with data
  if (response.success && 'data' in response) {
    return response.data;
  }
  
  // If it's an error response, throw an error with the message
  if (!response.success && response.message) {
    throw new ApiError(response.message, response.status || 500);
  }
  
  // Fallback: return the whole response
  return response;
};

// Request interceptor
const requestInterceptor = (options) => {
  // Add authentication, logging, etc.
  return options;
};

// Response interceptor
const responseInterceptor = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.message || 'API request failed', response.status, error);
  }
  
  const jsonResponse = await response.json();
  
  // Unwrap the response here to provide consistent data to all callers
  return unwrapResponse(jsonResponse);
};

// Base fetch function
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const enhancedOptions = requestInterceptor({
    ...options,
    headers,
  });

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, enhancedOptions);
    return await responseInterceptor(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'An unexpected error occurred');
  }
};

// HTTP method helpers
export const get = (url, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  return fetchWithAuth(fullUrl, {
    method: 'GET',
  });
};

export const post = (url, data) => {
  return fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const put = (url, data) => {
  return fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const patch = (url, data) => {
  return fetchWithAuth(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const del = (url) => {
  return fetchWithAuth(url, {
    method: 'DELETE',
  });
};

// Validation helpers
export const validateRequired = (data, fields) => {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new ApiError(`Missing required fields: ${missing.join(', ')}`, 400);
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError('Invalid email format', 400);
  }
};

export const checkExists = (item, itemType) => {
  if (!item) {
    throw new ApiError(`${itemType} not found`, 404);
  }
};