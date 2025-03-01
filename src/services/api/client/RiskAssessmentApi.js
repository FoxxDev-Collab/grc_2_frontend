// src/services/api/client/RiskAssessmentApi.js
import { BaseApiService } from '../BaseApiService';
import { validateRequired, get } from '../../utils/apiHelpers';
import { IS_MOCK } from '../../config';

class RiskAssessmentApi extends BaseApiService {
  constructor() {
    super('/risks', 'riskAssessment');
  }

  // Get all risks for a client
  async getRisks(clientId, options = {}) {
    validateRequired({ clientId }, ['clientId']);
    return this.getAll({ clientId: Number(clientId), ...options });
  }

  // Get single risk
  async getRisk(clientId, riskId) {
    validateRequired({ clientId, riskId }, ['clientId', 'riskId']);
    return this.getById(riskId);
  }

  // Create new risk
  async createRisk(clientId, riskData) {
    validateRequired({ clientId }, ['clientId']);
    validateRequired(riskData, ['name', 'description', 'impact', 'likelihood']);
    
    return this.create({
      clientId: Number(clientId),
      ...riskData,
      status: riskData.status || 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // Update risk
  async updateRisk(clientId, riskId, updates) {
    validateRequired({ clientId, riskId }, ['clientId', 'riskId']);
    
    return this.partialUpdate(riskId, {
      clientId: Number(clientId),
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  // Delete risk
  async deleteRisk(clientId, riskId) {
    validateRequired({ clientId, riskId }, ['clientId', 'riskId']);
    return this.delete(riskId);
  }

  // Get risk levels
  async getRiskLevels() {
    if (IS_MOCK) {
      return ['Critical', 'High', 'Medium', 'Low', 'Negligible'];
    }
    return get(`${this.baseUrl}${this.basePath}/risk-levels`);
  }

  // Get risk statuses
  async getRiskStatuses() {
    if (IS_MOCK) {
      return ['Open', 'Mitigated', 'Accepted', 'Transferred', 'Closed'];
    }
    return get(`${this.baseUrl}${this.basePath}/risk-statuses`);
  }

  // Get risk statistics for a client
  async getRiskStats(clientId) {
    validateRequired({ clientId }, ['clientId']);
    
    if (IS_MOCK) {
      // Generate mock risk statistics
      return {
        total: 12,
        byStatus: {
          'Open': 5,
          'Mitigated': 3,
          'Accepted': 2,
          'Transferred': 1,
          'Closed': 1
        },
        byLevel: {
          'Critical': 2,
          'High': 3,
          'Medium': 4,
          'Low': 2,
          'Negligible': 1
        },
        trend: [
          { month: 'Jan', count: 8 },
          { month: 'Feb', count: 10 },
          { month: 'Mar', count: 12 },
          { month: 'Apr', count: 11 },
          { month: 'May', count: 12 }
        ]
      };
    }
    
    return get(`${this.baseUrl}${this.basePath}/stats?clientId=${Number(clientId)}`);
  }

  // Get framework compliance progress
  async getFrameworkProgress(clientId) {
    validateRequired({ clientId }, ['clientId']);
    
    if (IS_MOCK) {
      // Generate mock framework progress data
      return {
        nist: {
          name: 'NIST CSF',
          progress: 68,
          categories: [
            { name: 'Identify', progress: 75 },
            { name: 'Protect', progress: 82 },
            { name: 'Detect', progress: 60 },
            { name: 'Respond', progress: 55 },
            { name: 'Recover', progress: 45 }
          ]
        },
        iso27001: {
          name: 'ISO 27001',
          progress: 72,
          categories: [
            { name: 'Security Policy', progress: 90 },
            { name: 'Organization of Information Security', progress: 85 },
            { name: 'Asset Management', progress: 70 },
            { name: 'Human Resources Security', progress: 65 },
            { name: 'Physical Security', progress: 80 },
            { name: 'Communications Security', progress: 60 },
            { name: 'Access Control', progress: 75 }
          ]
        }
      };
    }
    
    return get(`${this.baseUrl}${this.basePath}/framework-progress?clientId=${Number(clientId)}`);
  }

  // Get risk-objective mappings
  async getRiskObjectiveMappings(clientId) {
    validateRequired({ clientId }, ['clientId']);
    
    if (IS_MOCK) {
      // Generate mock risk-objective mappings
      return [
        { id: 'rom-1', riskId: 'risk-1', objectiveId: 'obj-1', relationship: 'mitigates' },
        { id: 'rom-2', riskId: 'risk-2', objectiveId: 'obj-2', relationship: 'mitigates' },
        { id: 'rom-3', riskId: 'risk-3', objectiveId: 'obj-3', relationship: 'mitigates' }
      ];
    }
    
    return get(`${this.baseUrl}${this.basePath}/risk-objective-mappings?clientId=${Number(clientId)}`);
  }

  // Create risk-objective mapping
  async createRiskObjectiveMapping(clientId, riskId, objectiveId) {
    validateRequired({ clientId, riskId, objectiveId }, ['clientId', 'riskId', 'objectiveId']);
    
    if (IS_MOCK) {
      return {
        id: `rom-${Date.now()}`,
        riskId,
        objectiveId,
        relationship: 'mitigates',
        createdAt: new Date().toISOString()
      };
    }
    
    return this.create({
      clientId: Number(clientId),
      riskId,
      objectiveId,
      relationship: 'mitigates',
      createdAt: new Date().toISOString()
    }, '/risk-objective-mappings');
  }

  // Get objective-initiative mappings
  async getObjectiveInitiativeMappings(clientId) {
    validateRequired({ clientId }, ['clientId']);
    
    if (IS_MOCK) {
      // Generate mock objective-initiative mappings
      return [
        { id: 'oim-1', objectiveId: 'obj-1', initiativeId: 'init-1' },
        { id: 'oim-2', objectiveId: 'obj-2', initiativeId: 'init-2' },
        { id: 'oim-3', objectiveId: 'obj-3', initiativeId: 'init-3' }
      ];
    }
    
    return get(`${this.baseUrl}${this.basePath}/objective-initiative-mappings?clientId=${Number(clientId)}`);
  }

  // Create objective-initiative mapping
  async createObjectiveInitiativeMapping(clientId, objectiveId, initiativeId) {
    validateRequired({ clientId, objectiveId, initiativeId }, ['clientId', 'objectiveId', 'initiativeId']);
    
    if (IS_MOCK) {
      return {
        id: `oim-${Date.now()}`,
        objectiveId,
        initiativeId,
        createdAt: new Date().toISOString()
      };
    }
    
    return this.create({
      clientId: Number(clientId),
      objectiveId,
      initiativeId,
      createdAt: new Date().toISOString()
    }, '/objective-initiative-mappings');
  }

  // Delete objective-initiative mapping
  async deleteObjectiveInitiativeMapping(clientId, objectiveId, initiativeId) {
    validateRequired({ clientId, objectiveId, initiativeId }, ['clientId', 'objectiveId', 'initiativeId']);
    
    if (IS_MOCK) {
      return { success: true };
    }
    
    return this.delete(`mapping/${objectiveId}/${initiativeId}`);
  }

  // Calculate risk score
  calculateRiskScore(impact, likelihood) {
    const impactMap = {
      'Critical': 5,
      'High': 4,
      'Medium': 3,
      'Low': 2,
      'Negligible': 1
    };
    
    const likelihoodMap = {
      'Critical': 5,
      'High': 4,
      'Medium': 3,
      'Low': 2,
      'Negligible': 1
    };
    
    const impactScore = impactMap[impact] || 1;
    const likelihoodScore = likelihoodMap[likelihood] || 1;
    
    return impactScore * likelihoodScore;
  }
}

export default new RiskAssessmentApi();