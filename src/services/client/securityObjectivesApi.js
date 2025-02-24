/* eslint-disable no-unused-vars */
import { validateRequired, checkExists } from '../apiHelpers';
import riskAssessmentApi from './riskAssessmentApi';

const API_URL = 'http://localhost:3001';

const OBJECTIVE_STATUS = ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];
const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];

const securityObjectivesApi = {
  // Get all objectives for a client
  getObjectives: async (clientId) => {
    validateRequired({ clientId }, ['clientId']);
    const numericClientId = Number(clientId);

    try {
      // Get objectives from API
      const response = await fetch(`${API_URL}/security-objectives?clientId=${numericClientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch objectives');
      }
      const objectives = await response.json();

      // Get risks that should be addressed
      const risks = await riskAssessmentApi.getRisks(clientId);
      const highPriorityRisks = risks.filter(risk => 
        risk.status === 'open' && 
        (risk.impact === 'high' || risk.likelihood === 'high')
      );

      // Convert risks to objectives if they don't exist yet
      const riskBasedObjectives = highPriorityRisks
        .filter(risk => !objectives.some(obj => obj.sourceRisk === risk.id))
        .map(risk => ({
          id: `risk-${risk.id}`,
          clientId: numericClientId,
          name: `Address Risk: ${risk.name}`,
          description: risk.description,
          priority: risk.impact === 'high' ? 'High' : 'Medium',
          status: 'Planning',
          progress: 0,
          dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          metrics: {
            successCriteria: ['Risk mitigation completed', 'Controls implemented', 'Verification performed'],
            currentMetrics: []
          },
          sourceRisk: risk.id
        }));

      return [...objectives, ...riskBasedObjectives];
    } catch (error) {
      throw new Error(`Failed to fetch objectives: ${error.message}`);
    }
  },

  // Get single objective
  getObjective: async (clientId, objectiveId) => {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    const numericClientId = Number(clientId);
    
    try {
      // Check if this is a risk-based objective
      if (objectiveId.startsWith('risk-')) {
        const riskId = objectiveId.split('-')[1];
        const risk = await riskAssessmentApi.getRisk(clientId, riskId);
        if (!risk) {
          throw new Error('Security Objective not found');
        }
        return {
          id: objectiveId,
          clientId: numericClientId,
          name: `Address Risk: ${risk.name}`,
          description: risk.description,
          priority: risk.impact === 'high' ? 'High' : 'Medium',
          status: 'Planning',
          progress: 0,
          dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          metrics: {
            successCriteria: ['Risk mitigation completed', 'Controls implemented', 'Verification performed'],
            currentMetrics: []
          },
          sourceRisk: risk.id
        };
      }

      // Get objective from API
      const response = await fetch(`${API_URL}/security-objectives/${objectiveId}?clientId=${numericClientId}`);
      if (!response.ok) {
        throw new Error('Security Objective not found');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch objective: ${error.message}`);
    }
  },

  // Create new objective
  createObjective: async (clientId, objectiveData) => {
    validateRequired(objectiveData, ['name', 'priority', 'dueDate']);

    if (!PRIORITY_LEVELS.includes(objectiveData.priority)) {
      throw new Error('Invalid priority level');
    }

    if (!objectiveData.status) {
      objectiveData.status = 'Planning';
    } else if (!OBJECTIVE_STATUS.includes(objectiveData.status)) {
      throw new Error('Invalid status');
    }

    try {
      const response = await fetch(`${API_URL}/security-objectives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: Number(clientId),
          ...objectiveData,
          progress: 0,
          metrics: {
            successCriteria: [],
            currentMetrics: []
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create objective');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to create objective: ${error.message}`);
    }
  },

  // Update objective
  updateObjective: async (clientId, objectiveId, updates) => {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    const numericClientId = Number(clientId);

    try {
      // For risk-based objectives, some updates may need to reflect back to the risk
      if (objectiveId.startsWith('risk-')) {
        const riskId = objectiveId.split('-')[1];
        const risk = await riskAssessmentApi.getRisk(clientId, riskId);
        if (!risk) {
          throw new Error('Security Objective not found');
        }

        // Update risk status if objective is completed
        if (updates.status === 'Completed') {
          await riskAssessmentApi.updateRisk(clientId, riskId, {
            status: 'mitigated'
          });
        }

        return {
          id: objectiveId,
          clientId: numericClientId,
          name: `Address Risk: ${risk.name}`,
          description: risk.description,
          priority: risk.impact === 'high' ? 'High' : 'Medium',
          status: updates.status || 'Planning',
          progress: updates.progress || 0,
          dueDate: updates.dueDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          metrics: updates.metrics || {
            successCriteria: ['Risk mitigation completed', 'Controls implemented', 'Verification performed'],
            currentMetrics: []
          },
          sourceRisk: risk.id
        };
      }

      if (updates.priority && !PRIORITY_LEVELS.includes(updates.priority)) {
        throw new Error('Invalid priority level');
      }

      if (updates.status && !OBJECTIVE_STATUS.includes(updates.status)) {
        throw new Error('Invalid status');
      }

      const response = await fetch(`${API_URL}/security-objectives/${objectiveId}`, {
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
        throw new Error('Failed to update objective');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to update objective: ${error.message}`);
    }
  },

  // Delete objective
  deleteObjective: async (clientId, objectiveId) => {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    
    // Cannot delete risk-based objectives directly
    if (objectiveId.startsWith('risk-')) {
      throw new Error('Cannot delete risk-based objectives directly. Address the underlying risk instead.');
    }

    try {
      const response = await fetch(`${API_URL}/security-objectives/${objectiveId}?clientId=${clientId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete objective');
      }

      return { success: true, message: 'Security objective deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete objective: ${error.message}`);
    }
  },

  // Update objective metrics
  updateObjectiveMetrics: async (clientId, objectiveId, metrics) => {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    validateRequired(metrics, ['successCriteria', 'currentMetrics']);

    try {
      // For risk-based objectives, store metrics separately
      if (objectiveId.startsWith('risk-')) {
        const riskId = objectiveId.split('-')[1];
        const risk = await riskAssessmentApi.getRisk(clientId, riskId);
        if (!risk) {
          throw new Error('Security Objective not found');
        }

        // Update risk with metrics information
        await riskAssessmentApi.updateRisk(clientId, riskId, {
          mitigationMetrics: metrics
        });

        return {
          id: objectiveId,
          clientId: Number(clientId),
          name: `Address Risk: ${risk.name}`,
          description: risk.description,
          priority: risk.impact === 'high' ? 'High' : 'Medium',
          status: 'Planning',
          progress: 0,
          dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          metrics: metrics,
          sourceRisk: risk.id
        };
      }

      const response = await fetch(`${API_URL}/security-objectives/${objectiveId}/metrics`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: Number(clientId),
          metrics
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update objective metrics');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to update objective metrics: ${error.message}`);
    }
  },

  // Get objective statuses
  getObjectiveStatuses: async () => {
    return [...OBJECTIVE_STATUS];
  },

  // Get priority levels
  getPriorityLevels: async () => {
    return [...PRIORITY_LEVELS];
  }
};

export default securityObjectivesApi;