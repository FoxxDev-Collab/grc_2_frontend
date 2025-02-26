import { validateRequired, validateEmail, ApiError } from '../apiHelpers';

const API_URL = 'http://localhost:3001';

// Login GRC user
export const login = async ({ email, password }) => {
  validateRequired({ email, password }, ['email', 'password']);
  validateEmail(email);

  // Find user by email
  const response = await fetch(`${API_URL}/users?email=${email}`);
  const users = await response.json();
  const user = users[0];

  if (!user || user.password !== password) {
    throw new ApiError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new ApiError('Account is inactive', 403);
  }

  // Generate a mock token
  const token = `grc-token-${Date.now()}`;

  // Update last active timestamp
  await fetch(`${API_URL}/users/${user.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lastActive: new Date().toISOString()
    })
  });

  // Return user data without sensitive information
  // eslint-disable-next-line no-unused-vars
  const { password: _password, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token
  };
};

// Get all GRC users
export const getGrcUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  const users = await response.json();
  return users.map(user => {
    // eslint-disable-next-line no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

// Create new GRC user
export const createGrcUser = async (userData) => {
  validateRequired(userData, ['email', 'password', 'firstName', 'lastName', 'role']);
  validateEmail(userData.email);

  // Validate role exists
  const rolesResponse = await fetch(`${API_URL}/roles`);
  const roles = await rolesResponse.json();
  if (!roles[userData.role]) {
    throw new ApiError('Invalid role specified', 400);
  }

  // Check for existing email
  const existingResponse = await fetch(`${API_URL}/users?email=${userData.email}`);
  const existingUsers = await existingResponse.json();
  if (existingUsers.length > 0) {
    throw new ApiError('Email already exists', 400);
  }

  // Create new user
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...userData,
      isActive: true,
      lastActive: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      failedLoginAttempts: 0,
      lastPasswordChange: new Date().toISOString(),
      preferences: {
        notifications: true,
        theme: 'light',
        language: 'en'
      }
    })
  });

  const newUser = await response.json();
  // eslint-disable-next-line no-unused-vars
  const { password: _password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Update GRC user
export const updateGrcUser = async (id, updates) => {
  // Check if user exists
  const userResponse = await fetch(`${API_URL}/users/${id}`);
  if (!userResponse.ok) {
    throw new ApiError('GRC User not found', 404);
  }

  if (updates.email) {
    validateEmail(updates.email);
    // Check if email is taken by another user
    const existingResponse = await fetch(`${API_URL}/users?email=${updates.email}&id_ne=${id}`);
    const existingUsers = await existingResponse.json();
    if (existingUsers.length > 0) {
      throw new ApiError('Email already exists', 400);
    }
  }

  if (updates.role) {
    const rolesResponse = await fetch(`${API_URL}/roles`);
    const roles = await rolesResponse.json();
    if (!roles[updates.role]) {
      throw new ApiError('Invalid role specified', 400);
    }
  }

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...updates,
      updatedAt: new Date().toISOString()
    })
  });

  const updatedUser = await response.json();
  const { ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

// Get available GRC roles
export const getGrcRoles = async () => {
  const response = await fetch(`${API_URL}/roles`);
  const roles = await response.json();
  return Object.keys(roles);
};

// Get GRC user by ID
export const getGrcUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`);
  if (!response.ok) {
    throw new ApiError('GRC User not found', 404);
  }
  
  const user = await response.json();
  // eslint-disable-next-line no-unused-vars
  const { password: _password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Check if GRC user has specific permission
export const hasPermission = async (userId, permission) => {
  // Get user
  const userResponse = await fetch(`${API_URL}/users/${userId}`);
  if (!userResponse.ok) return false;
  const user = await userResponse.json();

  // Get role permissions
  const rolesResponse = await fetch(`${API_URL}/roles`);
  const roles = await rolesResponse.json();
  const userRole = roles[user.role];

  if (!userRole) return false;

  // Senior AOs have all permissions
  if (user.role === 'SENIOR_AO') return true;

  return userRole.permissions.includes(permission) || userRole.permissions.includes('all');
};

// Export all functions as a default object
const grcUserApi = {
  login,
  getGrcUsers,
  createGrcUser,
  updateGrcUser,
  getGrcRoles,
  getGrcUser,
  hasPermission
};

export default grcUserApi;