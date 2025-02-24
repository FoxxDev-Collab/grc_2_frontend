import { validateRequired, validateEmail, ApiError } from '../apiHelpers';

const API_URL = 'http://localhost:3001';

// Helper function for API calls
const fetchApi = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new ApiError(`API Error: ${response.statusText}`, response.status);
  }

  return response.json();
};

// Login user
export const login = async ({ email, password }) => {
  validateRequired({ email, password }, ['email', 'password']);
  validateEmail(email);

  const users = await fetchApi(`users?email=${encodeURIComponent(email)}`);
  const user = users[0];

  if (!user || password !== 'admin123') { // Mock password check
    throw new ApiError('Invalid email or password', 401);
  }

  const token = `mock-token-${Date.now()}`;

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
      clientId: Number(user.clientId)
    },
    token
  };
};

// Get all users
export const getUsers = async (clientId = null) => {
  const endpoint = clientId !== null 
    ? `users?clientId=${encodeURIComponent(clientId)}`
    : 'users';
  const users = await fetchApi(endpoint);
  return users.map(user => ({
    ...user,
    clientId: user.clientId !== null ? Number(user.clientId) : null
  }));
};

// Get available roles
export const getRoles = async () => {
  const roles = await fetchApi('roles');
  return roles.map(role => role.name);
};

// Get available permissions
export const getPermissions = async () => {
  const permissions = await fetchApi('permissions');
  return permissions.map(permission => permission.name);
};

// Get available departments
export const getDepartments = async () => {
  const departments = await fetchApi('departments');
  return departments.map(dept => dept.name);
};

// Get available titles
export const getTitles = async () => {
  const titles = await fetchApi('titles');
  return titles.map(title => title.name);
};

// Get user statuses
export const getUserStatuses = async () => {
  const statuses = await fetchApi('userStatus');
  return statuses.map(status => status.name);
};

// Get user by ID
export const getUser = async (id) => {
  const user = await fetchApi(`users/${id}`);
  return {
    ...user,
    clientId: user.clientId !== null ? Number(user.clientId) : null
  };
};

// Create new user
export const createUser = async (userData) => {
  validateRequired(userData, ['username', 'email', 'role', 'clientId']);
  validateEmail(userData.email);

  // Validate role exists
  const roles = await getRoles();
  if (!roles.includes(userData.role)) {
    throw new ApiError('Invalid role specified', 400);
  }

  // Check for existing email
  const existingUsers = await fetchApi(`users?email=${encodeURIComponent(userData.email)}`);
  if (existingUsers.length > 0) {
    throw new ApiError('Email already exists', 400);
  }

  // Get role permissions
  const rolePermissions = await fetchApi(`rolePermissions?id=${encodeURIComponent(userData.role)}`);
  const permissions = rolePermissions[0]?.permissions || ['view'];

  const newUser = {
    ...userData,
    clientId: userData.clientId !== null ? Number(userData.clientId) : null,
    isActive: true,
    lastActive: new Date().toISOString(),
    permissions
  };

  return fetchApi('users', {
    method: 'POST',
    body: JSON.stringify(newUser)
  });
};

// Update user
export const updateUser = async (id, updates) => {
  if (updates.email) {
    validateEmail(updates.email);
    // Check if email is taken by another user
    const existingUsers = await fetchApi(`users?email=${encodeURIComponent(updates.email)}`);
    if (existingUsers.some(u => u.id !== id)) {
      throw new ApiError('Email already exists', 400);
    }
  }

  // Update permissions if role is changed
  if (updates.role) {
    const roles = await getRoles();
    if (!roles.includes(updates.role)) {
      throw new ApiError('Invalid role specified', 400);
    }
    const rolePermissions = await fetchApi(`rolePermissions?id=${encodeURIComponent(updates.role)}`);
    updates.permissions = rolePermissions[0]?.permissions || ['view'];
  }

  // Convert clientId to number if it's being updated
  if (updates.clientId !== undefined) {
    updates.clientId = updates.clientId !== null ? Number(updates.clientId) : null;
  }

  const updatedUser = {
    ...updates,
    lastActive: new Date().toISOString()
  };

  return fetchApi(`users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updatedUser)
  });
};

// Delete user
export const deleteUser = async (id) => {
  await fetchApi(`users/${id}`, { method: 'DELETE' });
  return { success: true, message: 'User deleted successfully' };
};

// Get user permissions
export const getUserPermissions = async (id) => {
  const user = await getUser(id);
  return {
    userId: id,
    role: user.role,
    permissions: user.permissions,
    clientId: user.clientId !== null ? Number(user.clientId) : null,
    lastUpdated: user.lastActive
  };
};

// Check if user has specific permission
export const hasPermission = async (userId, permission, clientId = null) => {
  try {
    const user = await getUser(userId);
    if (!user) return false;

    // System admins have all permissions
    if (user.role === 'SYSTEM_ADMIN') return true;

    // For client users, check if they're accessing their own client
    if (clientId !== null) {
      const numericClientId = Number(clientId);
      if (user.clientId !== numericClientId) return false;
    }

    return user.permissions.includes(permission) || user.permissions.includes('all');
  } catch {
    console.error(`Failed to check permissions for user ${userId}`);
    return false;
  }
};

// Export all functions as a default object
const clientUserApi = {
  login,
  getUsers,
  getRoles,
  getPermissions,
  getDepartments,
  getTitles,
  getUserStatuses,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserPermissions,
  hasPermission
};

export default clientUserApi;