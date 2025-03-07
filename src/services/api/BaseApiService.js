// src/services/api/BaseApiService.js
import { get, post, put, patch, del, validateRequired } from '../utils/apiHelpers';
import { unwrapResponse } from '../utils/apiResponseHandler';

/**
 * Utility function to create a delay with exponential backoff and jitter
 * @param {number} attempt - The current retry attempt (0-based)
 * @param {number} maxDelay - Maximum delay in milliseconds
 * @returns {Promise<void>} - Promise that resolves after the delay
 */
export const delay = (attempt = 0, maxDelay = 10000) => {
  const delayTime = Math.min(1000 * 2 ** attempt + Math.random() * 1000, maxDelay);
  return new Promise(resolve => setTimeout(resolve, delayTime));
};

/**
 * Custom API Error class to handle API-specific errors with additional context
 */
export class ApiError extends Error {
  constructor(message, status, code, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;       // HTTP status code
    this.code = code;           // Application-specific error code
    this.data = data;           // Additional error data
    this.timestamp = new Date().toISOString();
    
    // Maintains proper stack trace for debugging (V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Create an ApiError from a response object
   * @param {Object} response - Response from fetch or similar
   * @param {Object} data - Response data 
   * @returns {ApiError} - Structured API error
   */
  static fromResponse(response, data) {
    const status = response.status;
    const message = data?.message || `API Error: ${status}`;
    const code = data?.code || `ERR_${status}`;
    
    return new ApiError(message, status, code, data);
  }

  /**
   * Create a network-related ApiError
   * @param {Error} originalError - The original error that occurred
   * @returns {ApiError} - Network error
   */
  static networkError(originalError) {
    return new ApiError(
      originalError.message || 'Network error occurred',
      0,
      'ERR_NETWORK',
      { originalError: originalError.toString() }
    );
  }

  /**
   * Create a timeout ApiError
   * @param {string} url - The URL that timed out
   * @returns {ApiError} - Timeout error
   */
  static timeoutError(url) {
    return new ApiError(
      `Request to ${url} timed out`,
      0,
      'ERR_TIMEOUT',
      { url }
    );
  }
}

export class BaseApiService {
  constructor(basePath, entityName, options = {}) {
    this.basePath = basePath;
    this.entityName = entityName;
    
    // Default options
    this.options = {
      timeout: 30000,  // 30 second default timeout
      retries: 0,      // No retries by default
      ...options
    };
  }

  // Helper to build URL with path parameters
  buildUrl(path = '', pathParams = {}) {
    let url = `${this.basePath}${path}`;
    
    // Replace path parameters
    Object.entries(pathParams).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(value));
    });
    
    return url;
  }

  /**
   * Handles API errors uniformly across all requests
   * @param {Error} error - The caught error
   * @param {string} operation - The operation that failed
   * @param {string} endpoint - The endpoint that was called
   * @throws {ApiError} - Rethrows a structured ApiError
   */
  handleError(error, operation, endpoint) {
    // If it's already an ApiError, just rethrow it
    if (error instanceof ApiError) {
      throw error;
    }
    
    // If it's a fetch Response error
    if (error.response) {
      throw ApiError.fromResponse(error.response, error.data);
    }

    // Check for timeout errors
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      throw ApiError.timeoutError(`${endpoint}`);
    }
    
    // Handle network errors
    if (error.message?.includes('Network') || !navigator.onLine) {
      throw ApiError.networkError(error);
    }
    
    // Generic API error for all other cases
    throw new ApiError(
      `${this.entityName} ${operation} failed: ${error.message || 'Unknown error'}`,
      500,
      'ERR_INTERNAL',
      { originalError: error.toString() }
    );
  }

  /**
   * Execute a request with retry capability
   * @param {Function} requestFn - Function that performs the request
   * @param {string} operation - Name of the operation for error handling
   * @param {string} endpoint - API endpoint for error context
   * @returns {Promise<any>} - The API response
   */
  async executeRequest(requestFn, operation, endpoint) {
    let lastError;
    const maxRetries = this.options.retries;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await requestFn();
        return unwrapResponse(response);
      } catch (error) {
        lastError = error;
        
        // Don't retry client errors (4xx)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          break;
        }
        
        // Don't retry on last attempt
        if (attempt === maxRetries) {
          break;
        }
        
        // Exponential backoff with jitter
        await delay(attempt, 10000);
      }
    }
    
    this.handleError(lastError, operation, endpoint);
  }

  // CRUD operations with enhanced error handling and retry support
  async getAll(queryParams = {}) {
    const endpoint = this.basePath;
    return this.executeRequest(
      // Don't include this.baseUrl since apiHelpers.fetchWithAuth already adds API_BASE_URL
      () => get(endpoint, queryParams, { timeout: this.options.timeout }),
      'retrieval',
      endpoint
    );
  }

  async getById(id, queryParams = {}) {
    validateRequired({ id }, ['id']);
    const endpoint = `${this.basePath}/${id}`;
    return this.executeRequest(
      // Don't include this.baseUrl since apiHelpers.fetchWithAuth already adds API_BASE_URL
      () => get(endpoint, queryParams, { timeout: this.options.timeout }),
      'retrieval',
      endpoint
    );
  }

  async create(data) {
    const endpoint = this.basePath;
    return this.executeRequest(
      // Don't include this.baseUrl since apiHelpers.fetchWithAuth already adds API_BASE_URL
      () => post(endpoint, data, { timeout: this.options.timeout }),
      'creation',
      endpoint
    );
  }

  async update(id, data) {
    validateRequired({ id }, ['id']);
    const endpoint = `${this.basePath}/${id}`;
    return this.executeRequest(
      // Don't include this.baseUrl since apiHelpers.fetchWithAuth already adds API_BASE_URL
      () => put(endpoint, data, { timeout: this.options.timeout }),
      'update',
      endpoint
    );
  }

  async partialUpdate(id, data) {
    validateRequired({ id }, ['id']);
    const endpoint = `${this.basePath}/${id}`;
    return this.executeRequest(
      // Don't include this.baseUrl since apiHelpers.fetchWithAuth already adds API_BASE_URL
      () => patch(endpoint, data, { timeout: this.options.timeout }),
      'partial update',
      endpoint
    );
  }

  async delete(id) {
    validateRequired({ id }, ['id']);
    const endpoint = `${this.basePath}/${id}`;
    return this.executeRequest(
      // Don't include this.baseUrl since apiHelpers.fetchWithAuth already adds API_BASE_URL
      () => del(endpoint, { timeout: this.options.timeout }),
      'deletion',
      endpoint
    );
  }

  /**
   * Custom method for bulk operations
   * @param {Array} items - Items to process in bulk
   * @param {string} operation - The operation to perform ('create', 'update', 'delete')
   * @returns {Promise<Object>} - Results of the bulk operation
   */
  async bulkOperation(items, operation) {
    validateRequired({ items, operation }, ['items', 'operation']);
    
    if (!Array.isArray(items)) {
      throw new ApiError('Items must be an array', 400, 'ERR_INVALID_INPUT');
    }
    
    const endpoint = `${this.basePath}/bulk/${operation}`;
    return this.executeRequest(
      // Don't include this.baseUrl since apiHelpers.fetchWithAuth already adds API_BASE_URL
      () => post(endpoint, { items }, { timeout: this.options.timeout * 2 }),
      `bulk ${operation}`,
      endpoint
    );
  }
}