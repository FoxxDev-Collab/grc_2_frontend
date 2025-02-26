// src/services/mocks/middleware.js
import { getRepository } from '../services/mocks/repositories/Repository';
import { delay } from '../services/mocks/mockDb';
import { ApiError } from '../services/utils/apiHelpers';

// Helper to extract path parameters from a URL
const extractPathParams = (routePath, requestPath) => {
  const routeParts = routePath.split('/');
  const requestParts = requestPath.split('/');
  
  if (routeParts.length !== requestParts.length) {
    return null;
  }
  
  const params = {};
  
  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(':')) {
      const paramName = routeParts[i].substring(1);
      params[paramName] = requestParts[i];
    } else if (routeParts[i] !== requestParts[i]) {
      return null;
    }
  }
  
  return params;
};

// Helper to find a matching route
const findMatchingRoute = (routes, path, method) => {
  for (const [routePath, handlers] of Object.entries(routes)) {
    const params = extractPathParams(routePath, path);
    
    if (params && handlers[method]) {
      return {
        handler: handlers[method],
        params
      };
    }
  }
  
  return null;
};

// Custom middleware for the mock server
export const mockServerMiddleware = (routes) => {
  return async (req, res, next) => {
    // Skip if not using mock API
    if (!req.app.get('useMockApi')) {
      return next();
    }
    
    // Add artificial delay to simulate network latency
    await delay();
    
    // Find matching route
    const match = findMatchingRoute(routes, req.path, req.method);
    
    if (!match) {
      return res.status(404).json({
        error: 'Not Found',
        message: `No route found for ${req.method} ${req.path}`
      });
    }
    
    // Extract handler and params
    const { handler, params } = match;
    
    // Parse handler (e.g., 'securityObjectives.findAll')
    const [entityName, methodName] = handler.split('.');
    
    try {
      // Special case for auth
      if (entityName === 'auth') {
        const result = await handleAuthRequest(methodName, req);
        return res.json(result);
      }
      
      // Get repository
      const repository = getRepository(entityName);
      
      // Call repository method
      let result;
      
      switch (methodName) {
        case 'findAll':
          result = await repository.findAll(req.query);
          break;
        case 'findById':
          result = await repository.findById(params.id);
          break;
        case 'create':
          result = await repository.create(req.body);
          break;
        case 'update':
          result = await repository.update(params.id, req.body);
          break;
        case 'partialUpdate':
          result = await repository.partialUpdate(params.id, req.body);
          break;
        case 'delete':
          result = await repository.delete(params.id);
          break;
        default:
          // For custom methods, try to call them if they exist
          if (typeof repository[methodName] === 'function') {
            result = await repository[methodName](params, req.body, req.query);
          } else {
            throw new ApiError(`Method ${methodName} not implemented`, 501);
          }
      }
      
      return res.json(result);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.status).json({
          error: error.name,
          message: error.message,
          data: error.data
        });
      }
      
      console.error('Mock server error:', error);
      
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  };
};

// Handle auth requests
const handleAuthRequest = async (methodName, req) => {
  switch (methodName) {
    case 'login':
      return handleLogin(req);
    case 'logout':
      return handleLogout();
    case 'refresh':
      return handleRefresh(req);
    case 'me':
      return handleMe(req);
    default:
      throw new ApiError(`Auth method ${methodName} not implemented`, 501);
  }
};

// Handle login
const handleLogin = async (req) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new ApiError('Email and password are required', 400);
  }
  
  // Get users repository
  const usersRepository = getRepository('users');
  
  // Find user by email
  const users = await usersRepository.findAll({ email });
  const user = users[0];
  
  if (!user || user.password !== password) {
    throw new ApiError('Invalid email or password', 401);
  }
  
  // Generate token
  const token = `mock-token-${Date.now()}`;
  
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
};

// Handle logout
const handleLogout = async () => {
  return {
    success: true,
    message: 'Logged out successfully'
  };
};

// Handle refresh
const handleRefresh = async (req) => {
  const { token } = req.body;
  
  if (!token) {
    throw new ApiError('Token is required', 400);
  }
  
  // Generate new token
  const newToken = `mock-token-${Date.now()}`;
  
  return {
    token: newToken
  };
};

// Handle me
const handleMe = async (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    throw new ApiError('Unauthorized', 401);
  }
  
  // Get users repository
  const usersRepository = getRepository('users');
  
  // Get first user (for mock purposes)
  const users = await usersRepository.findAll();
  const user = users[0];
  
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
};