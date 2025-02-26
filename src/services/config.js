// src/services/config.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
export const API_TIMEOUT = 30000; // 30 seconds
export const API_VERSION = 'v1';
export const IS_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || true;