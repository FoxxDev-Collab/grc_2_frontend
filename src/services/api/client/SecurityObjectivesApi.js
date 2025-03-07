/* eslint-disable no-unused-vars */
// src/services/api/client/SecurityObjectivesApi.js
import { BaseApiService } from '../BaseApiService';
import { validateRequired, get, post, put, patch, del } from '../../utils/apiHelpers';
import { IS_MOCK } from '../../config';

// Constants for mock data
const OBJECTIVE_STATUSES = ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];
const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];

class SecurityObjectivesApi extends BaseApiService {
  constructor() {
    super('/security-objectives', 'securityObjectives');
  }

  // Get all objectives for a client
  async getObjectives(clientId, options = {}) {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      return await get(`/security-objectives?clientId=${Number(clientId)}`);
    } catch (error) {
      console.error('Get objectives error:', error);
      throw error;
    }
  }

  // Get single objective
  async getObjective(clientId, objectiveId) {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    
    try {
      return await get(`/security-objectives/${objectiveId}?clientId=${Number(clientId)}`);
    } catch (error) {
      console.error('Get objective error:', error);
      throw error;
    }
  }

  // Create new objective
  async createObjective(clientId, objectiveData) {
    validateRequired({ clientId }, ['clientId']);
    validateRequired(objectiveData, ['name', 'priority', 'dueDate']);
    
    try {
      const newObjective = {
        clientId: Number(clientId),
        ...objectiveData,
        status: objectiveData.status || 'Planning',
        progress: objectiveData.progress || 0,
        metrics: objectiveData.metrics || {
          successCriteria: [],
          currentMetrics: []
        }
      };
      
      return await post('/security-objectives', newObjective);
    } catch (error) {
      console.error('Create objective error:', error);
      throw error;
    }
  }

  // Update objective
  async updateObjective(clientId, objectiveId, updates) {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    
    try {
      const updatedObjective = {
        clientId: Number(clientId),
        ...updates
      };
      
      return await patch(`/security-objectives/${objectiveId}`, updatedObjective);
    } catch (error) {
      console.error('Update objective error:', error);
      throw error;
    }
  }

  // Delete objective
  async deleteObjective(clientId, objectiveId) {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    
    try {
      // Special case for risk-based objectives
      if (objectiveId.startsWith('risk-')) {
        throw new Error('Cannot delete risk-based objectives directly. Address the underlying risk instead.');
      }
      
      return await del(`/security-objectives/${objectiveId}?clientId=${Number(clientId)}`);
    } catch (error) {
      console.error('Delete objective error:', error);
      throw error;
    }
  }

  // Update objective metrics
  async updateObjectiveMetrics(clientId, objectiveId, metrics) {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    validateRequired(metrics, ['successCriteria', 'currentMetrics']);
    
    try {
      return await patch(`/security-objectives/${objectiveId}/metrics`, {
        clientId: Number(clientId),
        metrics
      });
    } catch (error) {
      console.error('Update objective metrics error:', error);
      throw error;
    }
  }

  // Get objective statuses
  async getObjectiveStatuses() {
    if (IS_MOCK) {
      return [...OBJECTIVE_STATUSES];
    }
    
    try {
      return await get('/security-objectives/statuses');
    } catch (error) {
      console.error('Get objective statuses error:', error);
      return [...OBJECTIVE_STATUSES]; // Fallback to mock data
    }
  }

  // Get priority levels
  async getPriorityLevels() {
    if (IS_MOCK) {
      return [...PRIORITY_LEVELS];
    }
    
    try {
      return await get('/security-objectives/priority-levels');
    } catch (error) {
      console.error('Get priority levels error:', error);
      return [...PRIORITY_LEVELS]; // Fallback to mock data
    }
  }
}

export default new SecurityObjectivesApi();