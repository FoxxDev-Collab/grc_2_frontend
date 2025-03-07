// src/services/api/security/SecurityInitiativesApi.js
import { BaseApiService } from '../BaseApiService';
import { validateRequired, get, post, patch, del } from '../../utils/apiHelpers';
import riskAssessmentApi from '../client/RiskAssessmentApi';

// Constants moved outside the class definition for easier access
export const INITIATIVE_STATUS = ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];
export const PHASES = ['Assessment', 'Design', 'Implementation', 'Testing', 'Deployment', 'Review'];

class SecurityInitiativesApi extends BaseApiService {
  constructor() {
    // Using the same pattern as other APIs
    super('/security-initiatives', 'security-initiatives');
  }

  // Get all initiatives for a client
  async getInitiatives(clientId) {
    validateRequired({ clientId }, ['clientId']);
    const numericClientId = Number(clientId);

    try {
      return await get(`/security-initiatives?clientId=${numericClientId}`);
    } catch (error) {
      console.error('Get initiatives error:', error);
      return [];
    }
  }

  // Get initiatives by objective
  async getInitiativesByObjective(clientId, objectiveId) {
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

      return await get(`/security-initiatives?clientId=${numericClientId}&objectiveId=${objectiveId}`);
    } catch (error) {
      console.error('Get initiatives by objective error:', error);
      return [];
    }
  }

  // Get single initiative
  async getInitiative(clientId, initiativeId) {
    validateRequired({ clientId, initiativeId }, ['clientId', 'initiativeId']);
    const numericClientId = Number(clientId);

    try {
      const initiative = await get(`/security-initiatives/${initiativeId}?clientId=${numericClientId}`);

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
      console.error('Get initiative error:', error);
      throw error;
    }
  }

  // Create new initiative
  async createInitiative(clientId, initiativeData) {
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

      const newInitiative = {
        clientId: Number(clientId),
        ...initiativeData,
        milestones: initiativeData.milestones || [],
        resources: initiativeData.resources || {
          team: [],
          budget: '0',
          tools: []
        }
      };

      const createdInitiative = await post('/security-initiatives', newInitiative);

      // Create the objective-initiative mapping
      await riskAssessmentApi.createObjectiveInitiativeMapping(
        clientId, 
        initiativeData.objectiveId, 
        createdInitiative.id
      );

      return createdInitiative;
    } catch (error) {
      console.error('Create initiative error:', error);
      throw error;
    }
  }

  // Update initiative
  async updateInitiative(clientId, initiativeId, updates) {
    validateRequired({ clientId, initiativeId }, ['clientId', 'initiativeId']);
    const numericClientId = Number(clientId);

    try {
      const initiative = await this.getInitiative(clientId, initiativeId);

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

      const updatedInitiative = {
        clientId: numericClientId,
        ...updates
      };

      return await patch(`/security-initiatives/${initiativeId}`, updatedInitiative);
    } catch (error) {
      console.error('Update initiative error:', error);
      throw error;
    }
  }

  // Delete initiative
  async deleteInitiative(clientId, initiativeId) {
    validateRequired({ clientId, initiativeId }, ['clientId', 'initiativeId']);

    try {
      // Get the initiative to find its objectiveId
      const initiative = await this.getInitiative(clientId, initiativeId);
      
      await del(`/security-initiatives/${initiativeId}?clientId=${clientId}`);

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
      console.error('Delete initiative error:', error);
      throw error;
    }
  }

  // Add milestone
  async addMilestone(clientId, initiativeId, milestoneData) {
    validateRequired({ clientId, initiativeId }, ['clientId', 'initiativeId']);
    validateRequired(milestoneData, ['name']);

    try {
      const newMilestone = {
        clientId: Number(clientId),
        ...milestoneData,
        completed: milestoneData.completed || false
      };

      const result = await post(`/security-initiatives/${initiativeId}/milestones`, newMilestone);

      // If all milestones are completed, update initiative status
      const initiative = await this.getInitiative(clientId, initiativeId);
      const allCompleted = initiative.milestones.every(m => m.completed);
      if (allCompleted) {
        await this.updateInitiative(clientId, initiativeId, { status: 'Completed' });
      }

      return result;
    } catch (error) {
      console.error('Add milestone error:', error);
      throw error;
    }
  }

  // Update milestone
  async updateMilestone(clientId, initiativeId, milestoneId, updates) {
    validateRequired({ clientId, initiativeId, milestoneId }, ['clientId', 'initiativeId', 'milestoneId']);

    try {
      const updatedMilestone = {
        clientId: Number(clientId),
        ...updates
      };

      const result = await patch(`/security-initiatives/${initiativeId}/milestones/${milestoneId}`, updatedMilestone);

      // If all milestones are completed, update initiative status
      const initiative = await this.getInitiative(clientId, initiativeId);
      const allCompleted = initiative.milestones.every(m => m.completed);
      if (allCompleted) {
        await this.updateInitiative(clientId, initiativeId, { status: 'Completed' });
      }

      return result;
    } catch (error) {
      console.error('Update milestone error:', error);
      throw error;
    }
  }

  // Delete milestone
  async deleteMilestone(clientId, initiativeId, milestoneId) {
    validateRequired({ clientId, initiativeId, milestoneId }, ['clientId', 'initiativeId', 'milestoneId']);

    try {
      const body = {
        clientId: Number(clientId)
      };

      await del(`/security-initiatives/${initiativeId}/milestones/${milestoneId}`, body);

      return { success: true, message: 'Milestone deleted successfully' };
    } catch (error) {
      console.error('Delete milestone error:', error);
      throw error;
    }
  }

  // Update resources
  async updateResources(clientId, initiativeId, resources) {
    validateRequired({ clientId, initiativeId }, ['clientId', 'initiativeId']);
    validateRequired(resources, ['team', 'budget', 'tools']);

    try {
      const updatedResources = {
        clientId: Number(clientId),
        resources
      };

      return await patch(`/security-initiatives/${initiativeId}/resources`, updatedResources);
    } catch (error) {
      console.error('Update resources error:', error);
      throw error;
    }
  }

  // Get initiative statuses
  async getInitiativeStatuses() {
    return [...INITIATIVE_STATUS];
  }

  // Get phases
  async getPhases() {
    return [...PHASES];
  }

  // Promote objective to initiative
  async promoteObjectiveToInitiative(clientId, objectiveId, initiativeData = {}) {
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
      return await this.createInitiative(clientId, mergedInitiativeData);
    } catch (error) {
      console.error('Promote objective to initiative error:', error);
      throw error;
    }
  }
}

export default new SecurityInitiativesApi();