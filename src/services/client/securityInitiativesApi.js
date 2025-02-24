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
      throw new Error(`Failed to fetch initiatives: ${error.message}`);
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
      throw new Error(`Failed to fetch initiatives: ${error.message}`);
    }
  },

  // Get single initiative
  getInitiative: async (clientId, initiativeId) => {
    validateRequired({ clientId, initiativeId }, ['clientId', 'initiativeId']);
    const numericClientId = Number(clientId);
    const numericInitiativeId = Number(initiativeId);

    try {
      const response = await fetch(`${API_URL}/security-initiatives/${initiativeId}?clientId=${numericClientId}`);
      if (!response.ok) {
        throw new Error('Initiative not found');
      }
      const initiative = await response.json();

      // If this initiative is linked to a risk-based objective, include risk info
      if (initiative.objectiveId.startsWith('risk-')) {
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
      throw new Error(`Failed to fetch initiative: ${error.message}`);
    }
  },

  // Create new initiative
  createInitiative: async (clientId, initiativeData) => {
    validateRequired(initiativeData, ['name', 'phase', 'timeline', 'objectiveId']);

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
          milestones: [],
          resources: {
            team: [],
            budget: '0',
            tools: []
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create initiative');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to create initiative: ${error.message}`);
    }
  },

  // Update initiative
  updateInitiative: async (clientId, initiativeId, updates) => {
    validateRequired({ clientId, initiativeId }, ['clientId', 'initiativeId']);

    try {
      const initiative = await securityInitiativesApi.getInitiative(clientId, initiativeId);

      if (updates.phase && !PHASES.includes(updates.phase)) {
        throw new Error('Invalid phase');
      }

      if (updates.status && !INITIATIVE_STATUS.includes(updates.status)) {
        throw new Error('Invalid status');
      }

      // If this initiative is linked to a risk-based objective
      if (initiative.objectiveId.startsWith('risk-')) {
        const riskId = initiative.objectiveId.split('-')[1];
        
        // If initiative is completed, update risk status
        if (updates.status === 'Completed') {
          await riskAssessmentApi.updateRisk(clientId, riskId, {
            mitigationStatus: 'implemented'
          });
        }
      }

      const response = await fetch(`${API_URL}/security-initiatives/${initiativeId}`, {
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
        throw new Error('Failed to update initiative');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to update initiative: ${error.message}`);
    }
  },

  // Delete initiative
  deleteInitiative: async (clientId, initiativeId) => {
    validateRequired({ clientId, initiativeId }, ['clientId', 'initiativeId']);

    try {
      const response = await fetch(`${API_URL}/security-initiatives/${initiativeId}?clientId=${clientId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete initiative');
      }

      return { success: true, message: 'Security initiative deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete initiative: ${error.message}`);
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
          completed: false
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
      throw new Error(`Failed to add milestone: ${error.message}`);
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
      throw new Error(`Failed to update milestone: ${error.message}`);
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
      throw new Error(`Failed to delete milestone: ${error.message}`);
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
      throw new Error(`Failed to update resources: ${error.message}`);
    }
  },

  // Get initiative statuses
  getInitiativeStatuses: async () => {
    return [...INITIATIVE_STATUS];
  },

  // Get phases
  getPhases: async () => {
    return [...PHASES];
  }
};

export default securityInitiativesApi;