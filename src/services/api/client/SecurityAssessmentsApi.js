// src/services/api/assessment/SecurityAssessmentsApi.js
import { BaseApiService } from '../BaseApiService';
import { validateRequired, get, post, patch } from '../../utils/apiHelpers';
import riskAssessmentApi from '../client/RiskAssessmentApi';
import securityObjectivesApi from '../client/SecurityObjectivesApi';

class SecurityAssessmentsApi extends BaseApiService {
  constructor() {
    // Using the same pattern as other APIs
    super('/assessments', 'assessments');
  }

  // Get all assessments for a client
  async getAssessments(clientId, options = {}) {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      let assessments = await get(`/assessments?clientId=${clientId}`);

      // Apply filters
      if (options.status && options.status !== 'all') {
        assessments = assessments.filter(a => a.status === options.status);
      }
      if (options.type && options.type !== 'all') {
        assessments = assessments.filter(a => a.type === options.type);
      }
      if (options.dateRange) {
        const { start, end } = options.dateRange;
        assessments = assessments.filter(a => {
          const assessmentDate = new Date(a.date);
          return assessmentDate >= new Date(start) && assessmentDate <= new Date(end);
        });
      }

      // Apply sorting
      if (options.sortBy) {
        assessments.sort((a, b) => {
          switch (options.sortBy) {
            case 'date':
              return new Date(b.date) - new Date(a.date);
            case 'score':
              return (b.score || 0) - (a.score || 0);
            default:
              return 0;
          }
        });
      }

      return assessments;
    } catch (error) {
      console.error('Get assessments error:', error);
      return [];
    }
  }

  // Get assessment by ID
  async getAssessment(assessmentId) {
    validateRequired({ assessmentId }, ['assessmentId']);
    
    try {
      return await get(`/assessments/${assessmentId}`);
    } catch (error) {
      console.error('Get assessment error:', error);
      throw error;
    }
  }

  // Get findings for an assessment
  async getFindings(assessmentId) {
    validateRequired({ assessmentId }, ['assessmentId']);
    
    try {
      return await get(`/assessments/${assessmentId}/generatedFindings`);
    } catch (error) {
      console.error('Get findings error:', error);
      return [];
    }
  }

  // Get risks promoted from findings
  async getPromotedRisks(clientId) {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      // Get risks from the risk assessment API
      const risks = await riskAssessmentApi.getRisks(clientId);
      
      // Filter risks that were promoted from findings
      const promotedRisks = risks.filter(risk => risk.sourceFindings && risk.sourceFindings.length > 0);
      
      return promotedRisks;
    } catch (error) {
      console.error('Get promoted risks error:', error);
      return [];
    }
  }

  // Promote finding to risk
  async promoteFindingToRisk(clientId, findingId, riskData) {
    validateRequired({ clientId, findingId }, ['clientId', 'findingId']);
    validateRequired(riskData, ['name', 'description', 'impact', 'likelihood', 'category']);
    
    try {
      // First get the finding details
      const finding = await get(`/assessments/${findingId}`);
      
      // Create a new risk with the finding as the source
      const newRisk = await riskAssessmentApi.createRisk(clientId, {
        ...riskData,
        sourceFindings: [{
          findingId: finding.id,
          title: finding.title || finding.name,
          sourceType: finding.sourceType || 'security_assessment',
          date: new Date().toISOString()
        }]
      });
      
      // Update the finding status to promoted
      await patch(`/assessments/${findingId}`, {
        status: 'promoted_to_risk',
        promotedRiskId: newRisk.id,
        lastUpdated: new Date().toISOString()
      });
      
      return newRisk;
    } catch (error) {
      console.error('Promote finding to risk error:', error);
      throw error;
    }
  }

  // Promote risk to objective
  async promoteRiskToObjective(clientId, riskId, objectiveData = {}) {
    validateRequired({ clientId, riskId }, ['clientId', 'riskId']);
    
    try {
      // Get the risk details
      const risk = await riskAssessmentApi.getRisk(clientId, riskId);
      
      // Create default objective data based on the risk
      const defaultObjectiveData = {
        name: `Address Risk: ${risk.name}`,
        description: risk.description,
        priority: risk.impact === 'high' ? 'High' : 'Medium',
        status: 'Planning',
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        sourceRisk: risk.id,
        riskId: risk.id,
        treatmentApproach: risk.treatment?.approach || 'mitigate'
      };
      
      // Merge with any provided objective data
      const mergedObjectiveData = {
        ...defaultObjectiveData,
        ...objectiveData
      };
      
      // Create the objective
      const objective = await securityObjectivesApi.createObjective(clientId, mergedObjectiveData);
      
      // Link the objective to the risk
      await riskAssessmentApi.linkObjectiveToRisk(clientId, riskId, objective.id);
      
      return objective;
    } catch (error) {
      console.error('Promote risk to objective error:', error);
      throw error;
    }
  }

  // Submit a new assessment
  async submitAssessment(clientId, assessmentData) {
    validateRequired(assessmentData, ['type', 'name', 'answers']);
    validateRequired({ clientId }, ['clientId']);
    
    try {
      const newAssessment = {
        clientId: Number(clientId),
        date: new Date().toISOString(),
        status: 'pending_review',
        ...assessmentData
      };
      
      return await post('/assessments', newAssessment);
    } catch (error) {
      console.error('Submit assessment error:', error);
      throw error;
    }
  }

  // Update assessment status
  async updateAssessmentStatus(assessmentId, status) {
    validateRequired({ assessmentId, status }, ['assessmentId', 'status']);
    
    try {
      const updates = {
        status,
        lastUpdated: new Date().toISOString()
      };
      
      return await patch(`/assessments/${assessmentId}`, updates);
    } catch (error) {
      console.error('Update assessment status error:', error);
      throw error;
    }
  }

  // Review assessment
  async reviewAssessment(assessmentId, reviewData) {
    validateRequired(reviewData, ['reviewer', 'status']);
    validateRequired({ assessmentId }, ['assessmentId']);
    
    try {
      const updates = {
        reviewer: reviewData.reviewer,
        status: reviewData.status,
        reviewNotes: reviewData.notes,
        reviewDate: new Date().toISOString()
      };
      
      return await patch(`/assessments/${assessmentId}`, updates);
    } catch (error) {
      console.error('Review assessment error:', error);
      throw error;
    }
  }

  // Get assessment statistics
  async getAssessmentStats(clientId) {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      const assessments = await this.getAssessments(clientId);
      
      return {
        total: assessments.length,
        byStatus: {
          pending: assessments.filter(a => a.status === 'pending_review').length,
          inProgress: assessments.filter(a => a.status === 'in_progress').length,
          completed: assessments.filter(a => a.status === 'completed').length,
          promoted: assessments.filter(a => a.status === 'promoted_to_risk').length
        },
        byType: {
          basic: assessments.filter(a => a.type === 'basic').length,
          advanced: assessments.filter(a => a.type === 'advanced').length,
          custom: assessments.filter(a => a.type === 'custom').length
        },
        recent: assessments
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
      };
    } catch (error) {
      console.error('Get assessment stats error:', error);
      return {
        total: 0,
        byStatus: { pending: 0, inProgress: 0, completed: 0, promoted: 0 },
        byType: { basic: 0, advanced: 0, custom: 0 },
        recent: []
      };
    }
  }
}

export default new SecurityAssessmentsApi();