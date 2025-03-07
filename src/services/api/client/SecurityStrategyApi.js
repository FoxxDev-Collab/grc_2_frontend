// src/services/api/security/SecurityStrategyApi.js
import { BaseApiService } from '../BaseApiService';
import { validateRequired, get, post, put, del } from '../../utils/apiHelpers';

class SecurityStrategyApi extends BaseApiService {
  constructor() {
    super('/security-strategy', 'securityStrategy');
  }

  // Get security strategy for a client
  async getSecurityStrategy(clientId) {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      return await get(`/securityStrategy?clientId=${clientId}`);
    } catch (error) {
      console.error('Get security strategy error:', error);
      return {
        objectives: [],
        roadmap: [],
        policies: []
      };
    }
  }
  
  // Get security objectives
  async getSecurityObjectives(clientId) {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      return await get(`/securityObjectives?clientId=${clientId}`);
    } catch (error) {
      console.error('Get security objectives error:', error);
      return [];
    }
  }
  
  // Get security roadmap
  async getSecurityRoadmap(clientId) {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      return await get(`/securityRoadmap?clientId=${clientId}`);
    } catch (error) {
      console.error('Get security roadmap error:', error);
      return [];
    }
  }
  
  // Update security strategy
  async updateSecurityStrategy(clientId, strategyData) {
    validateRequired({ clientId }, ['clientId']);
    validateRequired(strategyData, ['name', 'description']);
    
    try {
      return await put(`/securityStrategy/${clientId}`, strategyData);
    } catch (error) {
      console.error('Update security strategy error:', error);
      throw error;
    }
  }
  
  // Create security objective
  async createSecurityObjective(clientId, objectiveData) {
    validateRequired({ clientId }, ['clientId']);
    validateRequired(objectiveData, ['name', 'description', 'priority']);
    
    try {
      const newObjective = {
        clientId: Number(clientId),
        ...objectiveData,
        createdAt: new Date().toISOString(),
        status: objectiveData.status || 'Planning'
      };
      
      return await post('/securityObjectives', newObjective);
    } catch (error) {
      console.error('Create security objective error:', error);
      throw error;
    }
  }
  
  // Update security objective
  async updateSecurityObjective(clientId, objectiveId, objectiveData) {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    
    try {
      const updatedObjective = {
        ...objectiveData,
        updatedAt: new Date().toISOString()
      };
      
      return await put(`/securityObjectives/${objectiveId}`, updatedObjective);
    } catch (error) {
      console.error('Update security objective error:', error);
      throw error;
    }
  }
  
  // Delete security objective
  async deleteSecurityObjective(objectiveId) {
    validateRequired({ objectiveId }, ['objectiveId']);
    
    try {
      await del(`/securityObjectives/${objectiveId}`);
      return true;
    } catch (error) {
      console.error('Delete security objective error:', error);
      throw error;
    }
  }
  
  // Add roadmap item
  async addRoadmapItem(clientId, roadmapData) {
    validateRequired({ clientId }, ['clientId']);
    validateRequired(roadmapData, ['title', 'description', 'timeline']);
    
    try {
      const newRoadmapItem = {
        clientId: Number(clientId),
        ...roadmapData,
        createdAt: new Date().toISOString(),
        status: roadmapData.status || 'Planned'
      };
      
      return await post('/securityRoadmap', newRoadmapItem);
    } catch (error) {
      console.error('Add roadmap item error:', error);
      throw error;
    }
  }
  
  // Update roadmap item
  async updateRoadmapItem(clientId, itemId, itemData) {
    validateRequired({ clientId, itemId }, ['clientId', 'itemId']);
    
    try {
      const updatedItem = {
        ...itemData,
        updatedAt: new Date().toISOString()
      };
      
      return await put(`/securityRoadmap/${itemId}`, updatedItem);
    } catch (error) {
      console.error('Update roadmap item error:', error);
      throw error;
    }
  }
  
  // Delete roadmap item
  async deleteRoadmapItem(itemId) {
    validateRequired({ itemId }, ['itemId']);
    
    try {
      await del(`/securityRoadmap/${itemId}`);
      return true;
    } catch (error) {
      console.error('Delete roadmap item error:', error);
      throw error;
    }
  }
}

export default new SecurityStrategyApi();