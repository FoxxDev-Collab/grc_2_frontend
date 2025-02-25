/* eslint-disable no-unused-vars */
import { validateRequired, checkExists } from '../apiHelpers';
import riskAssessmentApi from './riskAssessmentApi';

const API_URL = 'http://localhost:3001';

const INITIATIVE_STATUS = ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];
const PHASES = ['Assessment', 'Design', 'Implementation', 'Testing', 'Deployment', 'Review'];

const securityInitiativesApi = {
  // Get all initiatives for a client
  getInitiatives: async (clientId) => {
    validateRequired({ clientId }, ['clientId']);
    const numericClientId = Number(clientId);

    try {
      const response = await fetch(`${API_URL}/security-initiatives?clientId=${numericClientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch initiatives');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching initiatives:', error);
      return [];
    }
  },

  // Get initiatives by objective
  getInitiativesByObjective: async (clientId, objectiveId) => {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    const numericClientId = Number(clientId);

    try {
      // For risk-based objectives, also fetch risk details
      if (objectiveId.startsWith('risk-')) {
        const riskId = objectiveId.split('-')[1];
        const risk = await riskAssessmentApi.getRisk(clientId, riskId);
        if (!risk) {
          throw new Error('Related risk not found');
        }
      }

      const response = await fetch(`${API_URL}/security-initiatives?clientId=${numericClientId}&objectiveId=${objectiveId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch initiatives');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching initiatives by objective:', error);
      return [];
    }
  },

  // Get single initiative
  getInitiative: async (clientId, initiativeId) => {
    validateRequired({ clientId, initiativeId }, ['clientId', 'initiativeId']);
    const numericClientId = Number(clientId);

    try {
      const response = await fetch(`${API_URL}/security-initiatives/${initiativeId}?clientId=${numericClientId}`);
      if (!response.ok) {
        throw new Error('Initiative not found');
      }
      const initiative = await response.json();

      // If this initiative is linked to a risk-based objective, include risk info
      if (initiative.objectiveId && initiative.objectiveId.startsWith('risk-')) {
        const riskId = initiative.objectiveId.split('-')[1];
        const risk = await riskAssessmentApi.getRisk(clientId, riskId);
        if (risk) {
          return {
            ...initiative,
            riskInfo: {
              name: risk.name,
              impact: risk.impact,
              likelihood: risk.likelihood,
              status: risk.status
            }
          };
        }
      }

      return initiative;
    } catch (error) {
      console.error('Error fetching initiative:', error);
      throw error;
    }
  },

  // Create new initiative
  createInitiative: async (clientId, initiativeData) => {
    validateRequired(initiativeData, ['name', 'phase', 'timeline', 'objectiveId']);
    validateRequired({ clientId }, ['clientId']);

    if (!PHASES.includes(initiativeData.phase)) {
      throw new Error('Invalid phase');
    }

    if (!initiativeData.status) {
      initiativeData.status = 'Planning';
    } else if (!INITIATIVE_STATUS.includes(initiativeData.status)) {
      throw new Error('Invalid status');
    }

    try {
      // If this is for a risk-based objective, validate the risk exists
      if (initiativeData.objectiveId.startsWith('risk-')) {
        const riskId = initiativeData.objectiveId.split('-')[1];
        const risk = await riskAssessmentApi.getRisk(clientId, riskId);
        if (!risk) {
          throw new Error('Related risk not found');
        }
      }

      const response = await fetch(`${API_URL}/security-initiatives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: Number(clientId),
          ...initiativeData,
          milestones: initiativeData.milestones || [],
          resources: initiativeData.resources || {
            team: [],
            budget: '0',
            tools: []
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create initiative');
      }

      const newInitiative = await response.json();

      // Create the objective-initiative mapping
      await riskAssessmentApi.createObjectiveInitiativeMapping(
        clientId, 
        initiativeData.objectiveId, 
        newInitiative.id
      );

      return newInitiative;
    } catch (error) {
      console.error('Error creating initiative:', error);
      throw error;
    }
  },

  // Update initiative
  updateInitiative: async (clientId, initiativeId, updates) => {
    validateRequired({ clientId, initiativeId }, ['clientId', 'initiativeId']);
    const numericClientId = Number(clientId);

    try {
      const initiative = await securityInitiativesApi.getInitiative(clientId, initiativeId);

      if (updates.phase && !PHASES.includes(updates.phase)) {
        throw new Error('Invalid phase');
      }

      if (updates.status && !INITIATIVE_STATUS.includes(updates.status)) {
        throw new Error('Invalid status');
      }

      // If this initiative is linked to a risk-based objective
      if (initiative.objectiveId && initiative.objectiveId.startsWith('risk-')) {
        const riskId = initiative.objectiveId.split('-')[1];
        
        // If initiative is completed, update risk status
        if (updates.status === 'Completed') {
          await riskAssessmentApi.updateRisk(clientId, riskId, {
            mitigationStatus: 'implemented'
          });
        }
      }

      // If the objectiveId has changed, update the mapping
      if (updates.objectiveId && initiative.objectiveId !== updates.objectiveId) {
        // Delete old mapping
        await riskAssessmentApi.deleteObjectiveInitiativeMapping(
          clientId, 
          initiative.objectiveId, 
          initiativeId
        );
        
        // Create new mapping
        await riskAssessmentApi.createObjectiveInitiativeMapping(
          clientId, 
          updates.objectiveId, 
          initiativeId
        );
      }

      const response = await fetch(`${API_URL}/security-initiatives/${initiativeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: numericClientId,
          ...updates
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update initiative');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating initiative:', error);
      throw error;
    }
  },

  // Delete initiative
  deleteInitiative: async (clientId, initiativeId) => {
    validateRequired({ clientId, initiativeId }, ['clientId', 'initiativeId']);

    try {
      // Get the initiative to find its objectiveId
      const initiative = await securityInitiativesApi.getInitiative(clientId, initiativeId);
      
      const response = await fetch(`${API_URL}/security-initiatives/${initiativeId}?clientId=${clientId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete initiative');
      }

      // Delete the objective-initiative mapping if it exists
      if (initiative && initiative.objectiveId) {
        await riskAssessmentApi.deleteObjectiveInitiativeMapping(
          clientId, 
          initiative.objectiveId, 
          initiativeId
        );
      }

      return { success: true, message: 'Security initiative deleted successfully' };
    } catch (error) {
      console.error('Error deleting initiative:', error);
      throw error;
    }
  },

  // Add milestone
  addMilestone: async (clientId, initiativeId, milestoneData) => {
    validateRequired({ clientId, initiativeId }, ['clientId', 'initiativeId']);
    validateRequired(milestoneData, ['name']);

    try {
      const response = await fetch(`${API_URL}/security-initiatives/${initiativeId}/milestones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: Number(clientId),
          ...milestoneData,
          completed: milestoneData.completed || false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add milestone');
      }

      const result = await response.json();

      // If all milestones are completed, update initiative status
      const initiative = await securityInitiativesApi.getInitiative(clientId, initiativeId);
      const allCompleted = initiative.milestones.every(m => m.completed);
      if (allCompleted) {
        await securityInitiativesApi.updateInitiative(clientId, initiativeId, { status: 'Completed' });
      }

      return result;
    } catch (error) {
      console.error('Error adding milestone:', error);
      throw error;
    }
  },

  // Update milestone
  updateMilestone: async (clientId, initiativeId, milestoneId, updates) => {
    validateRequired({ clientId, initiativeId, milestoneId }, ['clientId', 'initiativeId', 'milestoneId']);

    try {
      const response = await fetch(`${API_URL}/security-initiatives/${initiativeId}/milestones/${milestoneId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: Number(clientId),
          ...updates
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update milestone');
      }

      const result = await response.json();

      // If all milestones are completed, update initiative status
      const initiative = await securityInitiativesApi.getInitiative(clientId, initiativeId);
      const allCompleted = initiative.milestones.every(m => m.completed);
      if (allCompleted) {
        await securityInitiativesApi.updateInitiative(clientId, initiativeId, { status: 'Completed' });
      }

      return result;
    } catch (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  },

  // Delete milestone
  deleteMilestone: async (clientId, initiativeId, milestoneId) => {
    validateRequired({ clientId, initiativeId, milestoneId }, ['clientId', 'initiativeId', 'milestoneId']);

    try {
      const response = await fetch(`${API_URL}/security-initiatives/${initiativeId}/milestones/${milestoneId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: Number(clientId)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete milestone');
      }

      return { success: true, message: 'Milestone deleted successfully' };
    } catch (error) {
      console.error('Error deleting milestone:', error);
      throw error;
    }
  },

  // Update resources
  updateResources: async (clientId, initiativeId, resources) => {
    validateRequired({ clientId, initiativeId }, ['clientId', 'initiativeId']);
    validateRequired(resources, ['team', 'budget', 'tools']);

    try {
      const response = await fetch(`${API_URL}/security-initiatives/${initiativeId}/resources`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: Number(clientId),
          resources
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update resources');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating resources:', error);
      throw error;
    }
  },

  // Get initiative statuses
  getInitiativeStatuses: async () => {
    return [...INITIATIVE_STATUS];
  },

  // Get phases
  getPhases: async () => {
    return [...PHASES];
  },

  // Promote objective to initiative
  promoteObjectiveToInitiative: async (clientId, objectiveId, initiativeData = {}) => {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    
    try {
      // Create default initiative data based on the objective
      const defaultInitiativeData = {
        name: `Initiative for Objective: ${objectiveId}`,
        description: 'Implementation initiative for security objective',
        phase: 'Planning',
        timeline: `Q${Math.floor(Math.random() * 4) + 1} ${new Date().getFullYear()}`,
        status: 'Planning',
        objectiveId: objectiveId,
        milestones: [
          {
            name: 'Planning Phase Complete',
            completed: false,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            name: 'Implementation Started',
            completed: false,
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        resources: {
          team: ['Security Team'],
          budget: '$0',
          tools: []
        }
      };
      
      // Merge with any provided initiative data
      const mergedInitiativeData = {
        ...defaultInitiativeData,
        ...initiativeData
      };
      
      // Create the initiative
      const initiative = await securityInitiativesApi.createInitiative(clientId, mergedInitiativeData);
      
      return initiative;
    } catch (error) {
      console.error('Error promoting objective to initiative:', error);
      throw error;
    }
  }
};

export default securityInitiativesApi;