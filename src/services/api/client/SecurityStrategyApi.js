import { validateRequired } from '../../apiHelpers';

const API_URL = 'http://localhost:3001';

const securityStrategyApi = {
  // Get security strategy for a client
  getSecurityStrategy: async (clientId) => {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      const response = await fetch(`${API_URL}/securityStrategy?clientId=${clientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch security strategy');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching security strategy:', error);
      return {
        objectives: [],
        roadmap: [],
        policies: []
      };
    }
  },
  
  // Get security objectives
  getSecurityObjectives: async (clientId) => {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      const response = await fetch(`${API_URL}/securityObjectives?clientId=${clientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch security objectives');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching security objectives:', error);
      return [];
    }
  },
  
  // Get security roadmap
  getSecurityRoadmap: async (clientId) => {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      const response = await fetch(`${API_URL}/securityRoadmap?clientId=${clientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch security roadmap');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching security roadmap:', error);
      return [];
    }
  },
  
  // Update security strategy
  updateSecurityStrategy: async (clientId, strategyData) => {
    validateRequired({ clientId }, ['clientId']);
    validateRequired(strategyData, ['name', 'description']);
    
    try {
      const response = await fetch(`${API_URL}/securityStrategy/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(strategyData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update security strategy');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating security strategy:', error);
      throw error;
    }
  },
  
  // Create security objective
  createSecurityObjective: async (clientId, objectiveData) => {
    validateRequired({ clientId }, ['clientId']);
    validateRequired(objectiveData, ['name', 'description', 'priority']);
    
    try {
      const response = await fetch(`${API_URL}/securityObjectives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: Number(clientId),
          ...objectiveData,
          createdAt: new Date().toISOString(),
          status: objectiveData.status || 'Planning'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create security objective');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating security objective:', error);
      throw error;
    }
  },
  
  // Update security objective
  updateSecurityObjective: async (clientId, objectiveId, objectiveData) => {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    
    try {
      const response = await fetch(`${API_URL}/securityObjectives/${objectiveId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...objectiveData,
          updatedAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update security objective');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating security objective:', error);
      throw error;
    }
  },
  
  // Delete security objective
  deleteSecurityObjective: async (objectiveId) => {
    validateRequired({ objectiveId }, ['objectiveId']);
    
    try {
      const response = await fetch(`${API_URL}/securityObjectives/${objectiveId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete security objective');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting security objective:', error);
      throw error;
    }
  },
  
  // Add roadmap item
  addRoadmapItem: async (clientId, roadmapData) => {
    validateRequired({ clientId }, ['clientId']);
    validateRequired(roadmapData, ['title', 'description', 'timeline']);
    
    try {
      const response = await fetch(`${API_URL}/securityRoadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: Number(clientId),
          ...roadmapData,
          createdAt: new Date().toISOString(),
          status: roadmapData.status || 'Planned'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add roadmap item');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding roadmap item:', error);
      throw error;
    }
  },
  
  // Update roadmap item
  updateRoadmapItem: async (clientId, itemId, itemData) => {
    validateRequired({ clientId, itemId }, ['clientId', 'itemId']);
    
    try {
      const response = await fetch(`${API_URL}/securityRoadmap/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...itemData,
          updatedAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update roadmap item');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating roadmap item:', error);
      throw error;
    }
  },
  
  // Delete roadmap item
  deleteRoadmapItem: async (itemId) => {
    validateRequired({ itemId }, ['itemId']);
    
    try {
      const response = await fetch(`${API_URL}/securityRoadmap/${itemId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete roadmap item');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting roadmap item:', error);
      throw error;
    }
  }
};

export default securityStrategyApi;