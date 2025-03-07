// src/services/config.js
// This is the single file you need to change to switch between mock and real backend
export const IS_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || true; // Set to false for real backend

// Base URLs
const MOCK_API_URL = 'http://localhost:3001';
const REAL_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yourservice.com';

// Export the appropriate base URL based on the IS_MOCK flag
export const API_BASE_URL = IS_MOCK ? MOCK_API_URL : REAL_API_URL;

// Other API configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const API_VERSION = 'v1';

// Define available environments for clarity
export const ENVIRONMENTS = {
  DEV: 'development',
  STAGING: 'staging',
  PROD: 'production'
};

// Current environment
export const CURRENT_ENV = import.meta.env.VITE_APP_ENV || ENVIRONMENTS.DEV;