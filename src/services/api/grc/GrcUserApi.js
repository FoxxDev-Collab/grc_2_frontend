/* eslint-disable no-unused-vars */
// src/services/api/grc/GrcUserApi.js
import { BaseApiService } from '../BaseApiService';
import { validateRequired, validateEmail, get, post, put } from '../../utils/apiHelpers';
import { IS_MOCK } from '../../config';

class GrcUserApi extends BaseApiService {
  constructor() {
    super('/users', 'users');
  }

  // Get all GRC users
  async getGrcUsers() {
    try {
      const users = await this.getAll();
      return users.map(user => {
        // eslint-disable-next-line no-unused-vars
        const { password: _password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      console.error('Error fetching GRC users:', error);
      throw error;
    }
  }

  // Create new GRC user
  async createGrcUser(userData) {
    validateRequired(userData, ['email', 'password', 'firstName', 'lastName', 'role']);
    validateEmail(userData.email);

    try {
      // Validate role exists
      const roles = await this.getRolesData();
      if (!roles[userData.role]) {
        throw new Error('Invalid role specified');
      }

      // Check for existing email
      const existingUsers = await this.getAll({ email: userData.email });
      if (existingUsers.length > 0) {
        throw new Error('Email already exists');
      }

      // Create new user
      const newUser = await this.create({
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
      });

      // eslint-disable-next-line no-unused-vars
      const { password: _password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error creating GRC user:', error);
      throw error;
    }
  }

  // Update GRC user
  async updateGrcUser(id, updates) {
    try {
      // Check if user exists
      await this.getById(id);

      if (updates.email) {
        validateEmail(updates.email);
        // Check if email is taken by another user
        const existingUsers = await this.getAll({ email: updates.email });
        const otherUserWithEmail = existingUsers.find(user => String(user.id) !== String(id));
        if (otherUserWithEmail) {
          throw new Error('Email already exists');
        }
      }

      if (updates.role) {
        const roles = await this.getRolesData();
        if (!roles[updates.role]) {
          throw new Error('Invalid role specified');
        }
      }

      const updatedUser = await this.partialUpdate(id, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      // eslint-disable-next-line no-unused-vars
      const { password: _password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error updating GRC user:', error);
      throw error;
    }
  }

  // Get available GRC roles
  async getGrcRoles() {
    try {
      const roles = await this.getRolesData();
      return Object.keys(roles);
    } catch (error) {
      console.error('Error fetching GRC roles:', error);
      throw error;
    }
  }

  // Get GRC user by ID
  async getGrcUser(id) {
    try {
      const user = await this.getById(id);
      // eslint-disable-next-line no-unused-vars
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error fetching GRC user:', error);
      throw error;
    }
  }

  // Check if GRC user has specific permission
  async hasPermission(userId, permission) {
    try {
      // Get user
      const user = await this.getById(userId);

      // Get role permissions
      const roles = await this.getRolesData();
      const userRole = roles[user.role];

      if (!userRole) return false;

      // Senior AOs have all permissions
      if (user.role === 'SENIOR_AO') return true;

      return userRole.permissions.includes(permission) || userRole.permissions.includes('all');
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  // Helper method to get roles data
  async getRolesData() {
    if (IS_MOCK) {
      return {
        SENIOR_AO: {
          name: 'Senior Authorizing Official',
          permissions: ['all']
        },
        SUBORDINATE_AO: {
          name: 'Subordinate Authorizing Official',
          permissions: ['view', 'edit', 'approve']
        },
        AODR: {
          name: 'Authorizing Official Designated Representative',
          permissions: ['view', 'edit', 'review']
        },
        SCA: {
          name: 'Security Control Assessor',
          permissions: ['view', 'assess', 'review']
        },
        SCAR: {
          name: 'Security Control Assessor Representative',
          permissions: ['view', 'assess']
        }
      };
    }
    
    const response = await get(`${this.baseUrl}/roles`);
    return response;
  }
}

export default new GrcUserApi();