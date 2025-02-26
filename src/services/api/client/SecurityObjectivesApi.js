// src/services/api/client/SecurityObjectivesApi.js
import { BaseApiService } from '../BaseApiService';
import { validateRequired, get } from '../../utils/apiHelpers';
import { IS_MOCK } from '../../config';

class SecurityObjectivesApi extends BaseApiService {
  constructor() {
    super('/security-objectives', 'securityObjectives');
  }

  // Get all objectives for a client
  async getObjectives(clientId, options = {}) {
    validateRequired({ clientId }, ['clientId']);
    return this.getAll({ clientId: Number(clientId), ...options });
  }

  // Get single objective
  async getObjective(clientId, objectiveId) {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    return this.getById(objectiveId);
  }

  // Create new objective
  async createObjective(clientId, objectiveData) {
    validateRequired({ clientId }, ['clientId']);
    validateRequired(objectiveData, ['name', 'priority', 'dueDate']);
    
    return this.create({
      clientId: Number(clientId),
      ...objectiveData,
      status: objectiveData.status || 'Planning',
      progress: objectiveData.progress || 0,
      metrics: objectiveData.metrics || {
        successCriteria: [],
        currentMetrics: []
      }
    });
  }

  // Update objective
  async updateObjective(clientId, objectiveId, updates) {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    
    return this.partialUpdate(objectiveId, {
      clientId: Number(clientId),
      ...updates
    });
  }

  // Delete objective
  async deleteObjective(clientId, objectiveId) {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    
    // Special case for risk-based objectives
    if (objectiveId.startsWith('risk-')) {
      throw new Error('Cannot delete risk-based objectives directly. Address the underlying risk instead.');
    }
    
    return this.delete(objectiveId);
  }

  // Update objective metrics
  async updateObjectiveMetrics(clientId, objectiveId, metrics) {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    validateRequired(metrics, ['successCriteria', 'currentMetrics']);
    
    return this.partialUpdate(objectiveId, {
      metrics
    });
  }

  // Get objective statuses
  async getObjectiveStatuses() {
    if (IS_MOCK) {
      return ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];
    }
    return get(`${this.baseUrl}${this.basePath}/statuses`);
  }

  // Get priority levels
  async getPriorityLevels() {
    if (IS_MOCK) {
      return ['High', 'Medium', 'Low'];
    }
    return get(`${this.baseUrl}${this.basePath}/priority-levels`);
  }
}

export default new SecurityObjectivesApi();