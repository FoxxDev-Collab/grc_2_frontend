import { validateRequired } from '../../apiHelpers';
import riskAssessmentApi from '../../api/client/RiskAssessmentApi';
import securityObjectivesApi from '../../api/client/SecurityObjectivesApi';

const API_URL = 'http://localhost:3001';

const securityAssessmentsApi = {
  // Get all assessments for a client
  getAssessments: async (clientId, options = {}) => {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      const response = await fetch(`${API_URL}/assessments?clientId=${clientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }
      let assessments = await response.json();

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
      console.error('Error fetching assessments:', error);
      return [];
    }
  },

  // Get assessment by ID
  getAssessment: async (assessmentId) => {
    validateRequired({ assessmentId }, ['assessmentId']);
    
    try {
      const response = await fetch(`${API_URL}/assessments/${assessmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assessment');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching assessment:', error);
      throw error;
    }
  },

  // Get findings for an assessment
  getFindings: async (assessmentId) => {
    validateRequired({ assessmentId }, ['assessmentId']);
    
    try {
      const response = await fetch(`${API_URL}/assessments/${assessmentId}/generatedFindings`);
      if (!response.ok) {
        throw new Error('Failed to fetch findings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching findings:', error);
      return [];
    }
  },

  // Get risks promoted from findings
  getPromotedRisks: async (clientId) => {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      // Get risks from the risk assessment API
      const risks = await riskAssessmentApi.getRisks(clientId);
      
      // Filter risks that were promoted from findings
      const promotedRisks = risks.filter(risk => risk.sourceFindings && risk.sourceFindings.length > 0);
      
      return promotedRisks;
    } catch (error) {
      console.error('Error fetching promoted risks:', error);
      return [];
    }
  },

  // Promote finding to risk
  promoteFindingToRisk: async (clientId, findingId, riskData) => {
    validateRequired({ clientId, findingId }, ['clientId', 'findingId']);
    validateRequired(riskData, ['name', 'description', 'impact', 'likelihood', 'category']);
    
    try {
      // First get the finding details
      const findingResponse = await fetch(`${API_URL}/assessments/${findingId}`);
      if (!findingResponse.ok) {
        throw new Error('Finding not found');
      }
      
      const finding = await findingResponse.json();
      
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
      await fetch(`${API_URL}/assessments/${findingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'promoted_to_risk',
          promotedRiskId: newRisk.id,
          lastUpdated: new Date().toISOString()
        })
      });
      
      return newRisk;
    } catch (error) {
      console.error('Error promoting finding to risk:', error);
      throw error;
    }
  },

  // Promote risk to objective
  promoteRiskToObjective: async (clientId, riskId, objectiveData = {}) => {
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
      console.error('Error promoting risk to objective:', error);
      throw error;
    }
  },

  // Submit a new assessment
  submitAssessment: async (clientId, assessmentData) => {
    validateRequired(assessmentData, ['type', 'name', 'answers']);
    validateRequired({ clientId }, ['clientId']);
    
    try {
      const response = await fetch(`${API_URL}/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: Number(clientId),
          date: new Date().toISOString(),
          status: 'pending_review',
          ...assessmentData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error;
    }
  },

  // Update assessment status
  updateAssessmentStatus: async (assessmentId, status) => {
    validateRequired({ assessmentId, status }, ['assessmentId', 'status']);
    
    try {
      const response = await fetch(`${API_URL}/assessments/${assessmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          lastUpdated: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update assessment status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating assessment status:', error);
      throw error;
    }
  },

  // Review assessment
  reviewAssessment: async (assessmentId, reviewData) => {
    validateRequired(reviewData, ['reviewer', 'status']);
    validateRequired({ assessmentId }, ['assessmentId']);
    
    try {
      const response = await fetch(`${API_URL}/assessments/${assessmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewer: reviewData.reviewer,
          status: reviewData.status,
          reviewNotes: reviewData.notes,
          reviewDate: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to review assessment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error reviewing assessment:', error);
      throw error;
    }
  },

  // Get assessment statistics
  getAssessmentStats: async (clientId) => {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      const assessments = await securityAssessmentsApi.getAssessments(clientId);
      
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
      console.error('Error getting assessment stats:', error);
      return {
        total: 0,
        byStatus: { pending: 0, inProgress: 0, completed: 0, promoted: 0 },
        byType: { basic: 0, advanced: 0, custom: 0 },
        recent: []
      };
    }
  }
};

export default securityAssessmentsApi;