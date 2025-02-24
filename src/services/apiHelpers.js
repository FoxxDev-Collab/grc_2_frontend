// Helper to simulate API delay
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate ISO date string without time
export const getCurrentDate = () => new Date().toISOString().split('T')[0];

// Helper to handle API errors
export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Helper to validate required fields
export const validateRequired = (data, fields) => {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new ApiError(`Missing required fields: ${missing.join(', ')}`, 400);
  }
};

// Helper to validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError('Invalid email format', 400);
  }
};

// Helper to check if record exists
export const checkExists = (item, itemType) => {
  if (!item) {
    throw new ApiError(`${itemType} not found`, 404);
  }
};

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Default headers
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Helper to handle API responses
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.message || 'API request failed', response.status);
  }
  return response.json();
};

// Helper to handle API errors
export const handleApiError = (error) => {
  if (error instanceof ApiError) {
    throw error;
  }
  throw new ApiError(error.message || 'An unexpected error occurred');
};

// HTTP method helpers
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...defaultHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  return handleApiResponse(response);
};

export const get = async (url, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  return fetchWithAuth(fullUrl, {
    method: 'GET',
  });
};

export const post = async (url, data) => {
  return fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const put = async (url, data) => {
  return fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const del = async (url) => {
  return fetchWithAuth(url, {
    method: 'DELETE',
  });
};