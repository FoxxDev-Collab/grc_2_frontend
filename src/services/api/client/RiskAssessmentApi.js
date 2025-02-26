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