// src/services/business/SecurityObjectivesService.js
import securityObjectivesApi from '../api/client/SecurityObjectivesApi';
import riskAssessmentApi from '../api/client/RiskAssessmentApi';

class SecurityObjectivesService {
  // Get all objectives for a client, including risk-based objectives
  async getObjectives(clientId) {
    try {
      // Get objectives from API
      const objectives = await securityObjectivesApi.getObjectives(clientId);

      // Get risks that should be addressed
      const risks = await riskAssessmentApi.getRisks(clientId);
      const highPriorityRisks = risks.filter(risk => 
        risk.status === 'open' && 
        (risk.impact === 'high' || risk.likelihood === 'high')
      );

      // Convert risks to objectives if they don't exist yet
      const riskBasedObjectives = highPriorityRisks
        .filter(risk => !objectives.some(obj => obj.sourceRisk === risk.id))
        .map(risk => this.createRiskBasedObjective(risk, clientId));

      return [...objectives, ...riskBasedObjectives];
    } catch (error) {
      console.error('Error fetching objectives:', error);
      return [];
    }
  }

  // Create a risk-based objective
  createRiskBasedObjective(risk, clientId) {
    return {
      id: `risk-${risk.id}`,
      clientId: Number(clientId),
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

  // Get single objective, including risk-based objectives
  async getObjective(clientId, objectiveId) {
    try {
      // Check if this is a risk-based objective
      if (objectiveId.startsWith('risk-')) {
        const riskId = objectiveId.split('-')[1];
        const risk = await riskAssessmentApi.getRisk(clientId, riskId);
        if (!risk) {
          throw new Error('Security Objective not found');
        }
        return this.createRiskBasedObjective(risk, clientId);
      }

      // Get objective from API
      return await securityObjectivesApi.getObjective(clientId, objectiveId);
    } catch (error) {
      console.error('Error fetching objective:', error);
      throw error;
    }
  }

  // Update objective, handling risk-based objectives specially
  async updateObjective(clientId, objectiveId, updates) {
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

        // Return updated risk-based objective
        return {
          ...this.createRiskBasedObjective(risk, clientId),
          status: updates.status || 'Planning',
          progress: updates.progress || 0,
          dueDate: updates.dueDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          metrics: updates.metrics || {
            successCriteria: ['Risk mitigation completed', 'Controls implemented', 'Verification performed'],
            currentMetrics: []
          }
        };
      }

      // Update regular objective
      return await securityObjectivesApi.updateObjective(clientId, objectiveId, updates);
    } catch (error) {
      console.error('Error updating objective:', error);
      throw error;
    }
  }

  // Create a new objective
  async createObjective(clientId, objectiveData) {
    try {
      return await securityObjectivesApi.createObjective(clientId, objectiveData);
    } catch (error) {
      console.error('Error creating objective:', error);
      throw error;
    }
  }

  // Delete an objective
  async deleteObjective(clientId, objectiveId) {
    try {
      return await securityObjectivesApi.deleteObjective(clientId, objectiveId);
    } catch (error) {
      console.error('Error deleting objective:', error);
      throw error;
    }
  }

  // Get objective statuses
  async getObjectiveStatuses() {
    try {
      return await securityObjectivesApi.getObjectiveStatuses();
    } catch (error) {
      console.error('Error fetching objective statuses:', error);
      return [];
    }
  }

  // Get priority levels
  async getPriorityLevels() {
    try {
      return await securityObjectivesApi.getPriorityLevels();
    } catch (error) {
      console.error('Error fetching priority levels:', error);
      return [];
    }
  }
}

export default new SecurityObjectivesService();