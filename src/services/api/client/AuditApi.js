// src/services/api/audit/AuditApi.js
import { BaseApiService } from '../BaseApiService';
import { validateRequired, get, post, patch, } from '../../utils/apiHelpers';
import riskAssessmentApi from '../client/RiskAssessmentApi';

// Source types that map to different APIs
export const SOURCE_TYPES = {
  SECURITY_ASSESSMENT: 'security_assessment',
  VULNERABILITY_SCAN: 'vulnerability_scan',
  COMPLIANCE_REVIEW: 'compliance_review',
  EXTERNAL_AUDIT: 'external_audit',
  INTERNAL_AUDIT: 'internal_audit',
  INCIDENT_REVIEW: 'incident_review'
};

export const SEVERITY_LEVELS = ['critical', 'high', 'medium', 'low', 'informational'];
export const FINDING_STATUSES = ['open', 'in_progress', 'closed', 'reopened', 'duplicate', 'deferred'];
export const COMMON_TAGS = [
  'access-control',
  'authentication',
  'authorization',
  'configuration',
  'encryption',
  'network-security',
  'patch-management',
  'policy-violation',
  'security-controls',
  'third-party',
  'vulnerability'
];

class AuditApi extends BaseApiService {
  constructor() {
    // Using the same pattern as the other APIs
    super('/audit', 'audit');
    
    // We don't rely on this.endpoint for building paths
    // Instead we use explicit paths in each method
  }

  // Get all findings by aggregating from different sources
  async getFindings(clientId, filters = {}) {
    validateRequired({ clientId }, ['clientId']);
    const numericClientId = Number(clientId);

    try {
      // Get all assessments for the client
      const assessments = await get(`/assessments?clientId=${numericClientId}`);
      
      // Make sure assessments is an array
      if (!Array.isArray(assessments)) {
        console.error('Expected assessments to be an array, got:', typeof assessments);
        return [];
      }
      
      // Extract findings from all assessments
      let allFindings = assessments.flatMap(assessment => {
        if (!assessment || !assessment.generatedFindings) {
          return [];
        }
        
        // Handle both array and object formats for generatedFindings
        const findingsArray = Array.isArray(assessment.generatedFindings) 
          ? assessment.generatedFindings 
          : Object.values(assessment.generatedFindings);
        
        return findingsArray.map(finding => ({
          ...finding,
          sourceType: SOURCE_TYPES.SECURITY_ASSESSMENT,
          sourceDetails: `Security Assessment: ${assessment.name || 'Unknown'}`,
          createdDate: assessment.date || new Date().toISOString(),
          assessmentId: assessment.id
        }));
      });

      // Apply filters
      if (filters.sourceType) {
        allFindings = allFindings.filter(f => f.sourceType === filters.sourceType);
      }
      if (filters.severity) {
        allFindings = allFindings.filter(f => f.severity === filters.severity);
      }
      if (filters.status) {
        allFindings = allFindings.filter(f => f.status === filters.status);
      }
      if (filters.tags && filters.tags.length > 0) {
        allFindings = allFindings.filter(f => 
          filters.tags.some(tag => f.tags?.includes(tag))
        );
      }

      return allFindings;
    } catch (error) {
      console.error('Get findings error:', error);
      throw error;
    }
  }

  // Get finding metrics
  async getFindingMetrics(clientId) {
    try {
      const findings = await this.getFindings(Number(clientId));

      return {
        total: findings.length,
        bySeverity: {
          critical: findings.filter(f => f.severity === 'critical').length,
          high: findings.filter(f => f.severity === 'high').length,
          medium: findings.filter(f => f.severity === 'medium').length,
          low: findings.filter(f => f.severity === 'low').length,
          informational: findings.filter(f => f.severity === 'informational').length
        },
        byStatus: {
          open: findings.filter(f => f.status === 'open').length,
          in_progress: findings.filter(f => f.status === 'in_progress').length,
          closed: findings.filter(f => f.status === 'closed').length,
          reopened: findings.filter(f => f.status === 'reopened').length,
          duplicate: findings.filter(f => f.status === 'duplicate').length,
          deferred: findings.filter(f => f.status === 'deferred').length,
          not_applicable: findings.filter(f => f.status === 'not_applicable').length
        },
        bySource: {
          security_assessment: findings.filter(f => f.sourceType === SOURCE_TYPES.SECURITY_ASSESSMENT).length,
          vulnerability_scan: findings.filter(f => f.sourceType === SOURCE_TYPES.VULNERABILITY_SCAN).length,
          compliance_review: findings.filter(f => f.sourceType === SOURCE_TYPES.COMPLIANCE_REVIEW).length,
          external_audit: findings.filter(f => f.sourceType === SOURCE_TYPES.EXTERNAL_AUDIT).length,
          internal_audit: findings.filter(f => f.sourceType === SOURCE_TYPES.INTERNAL_AUDIT).length,
          incident_review: findings.filter(f => f.sourceType === SOURCE_TYPES.INCIDENT_REVIEW).length
        },
        promotedToRisk: findings.filter(f => f.promotedToRisk).length
      };
    } catch (error) {
      console.error('Get finding metrics error:', error);
      throw error;
    }
  }

  // Get source types
  async getSourceTypes() {
    return Object.values(SOURCE_TYPES);
  }

  // Get severity levels
  async getSeverityLevels() {
    return [...SEVERITY_LEVELS];
  }

  // Get finding statuses
  async getFindingStatuses() {
    return [...FINDING_STATUSES];
  }

  // Get common tags
  async getCommonTags() {
    return [...COMMON_TAGS];
  }

  // Helper method to find assessment containing a finding
  async _findAssessmentIdForFinding(findingId, clientId) {
    let assessmentId;
    
    try {
      // Get all assessments for the client
      const assessments = await get(`/assessments?clientId=${Number(clientId)}`);
      
      // Find the assessment that contains this finding
      for (const assessment of assessments) {
        if (assessment.generatedFindings) {
          // Handle both array and object formats
          const findings = Array.isArray(assessment.generatedFindings) 
            ? assessment.generatedFindings 
            : Object.values(assessment.generatedFindings);
            
          if (findings.some(f => f.id === findingId)) {
            assessmentId = assessment.id;
            break;
          }
        }
      }
    } catch (error) {
      console.warn('Error finding assessment for finding:', error);
      // Fallback to a default assessment ID based on the finding ID pattern
      assessmentId = findingId.includes('001') || findingId.includes('002') ? 
        'asmt-001' : 'asmt-002';
    }

    return assessmentId;
  }

  // Delete a finding
  async deleteFinding(findingId, clientId) {
    validateRequired({ findingId, clientId }, ['findingId', 'clientId']);
    
    try {
      // Find which assessment this finding belongs to
      const assessmentId = await this._findAssessmentIdForFinding(findingId, clientId);

      if (assessmentId) {
        // Get the current assessment
        const assessment = await get(`/assessments/${assessmentId}`);
        
        // Remove the finding from the assessment
        let updatedFindings;
        
        if (Array.isArray(assessment.generatedFindings)) {
          // If generatedFindings is an array, filter out the finding
          updatedFindings = assessment.generatedFindings.filter(finding => finding.id !== findingId);
        } else {
          // If generatedFindings is an object, remove the finding from the object
          updatedFindings = { ...assessment.generatedFindings };
          delete updatedFindings[findingId];
        }
        
        // Update the assessment
        await patch(`/assessments/${assessmentId}`, {
          generatedFindings: updatedFindings
        });
        
        return { success: true };
      } else {
        throw new Error('Could not find assessment for this finding');
      }
    } catch (error) {
      console.error('Delete finding error:', error);
      throw error;
    }
  }

  // Update finding status
  async updateFindingStatus(findingId, clientId, status) {
    validateRequired({ findingId, clientId, status }, ['findingId', 'clientId', 'status']);
    
    try {
      // Find which assessment this finding belongs to
      const assessmentId = await this._findAssessmentIdForFinding(findingId, clientId);

      if (assessmentId) {
        // Get the current assessment
        const assessment = await get(`/assessments/${assessmentId}`);
        
        // Update the finding status
        let updatedFindings;
        
        if (Array.isArray(assessment.generatedFindings)) {
          // If generatedFindings is an array, update the finding in the array
          updatedFindings = assessment.generatedFindings.map(finding => {
            if (finding.id === findingId) {
              return {
                ...finding,
                status: status
              };
            }
            return finding;
          });
        } else {
          // If generatedFindings is an object, update the finding in the object
          updatedFindings = { ...assessment.generatedFindings };
          if (updatedFindings[findingId]) {
            updatedFindings[findingId] = {
              ...updatedFindings[findingId],
              status: status
            };
          }
        }
        
        // Update the assessment
        await patch(`/assessments/${assessmentId}`, {
          generatedFindings: updatedFindings
        });
        
        return { success: true };
      } else {
        throw new Error('Could not find assessment for this finding');
      }
    } catch (error) {
      console.error('Update finding status error:', error);
      throw error;
    }
  }

  // Promote finding to risk
  async promoteToRisk(findingId, riskData) {
    validateRequired({ findingId, ...riskData }, ['findingId', 'name', 'description', 'impact', 'likelihood', 'category']);
    
    try {
      // Create a new risk assessment
      const risk = await riskAssessmentApi.createRisk(riskData.clientId, {
        name: riskData.name,
        description: riskData.description,
        impact: riskData.impact,
        likelihood: riskData.likelihood,
        category: riskData.category,
        source: `Finding: ${findingId}`,
        status: 'open',
        sourceFindings: [{
          findingId: findingId,
          title: riskData.name,
          sourceType: 'security_assessment',
          date: new Date().toISOString()
        }]
      });

      // Determine which assessment this finding belongs to
      const assessmentId = await this._findAssessmentIdForFinding(findingId, riskData.clientId);

      if (assessmentId) {
        // Get the current assessment
        const assessment = await get(`/assessments/${assessmentId}`);
        
        // Update the finding in the assessment
        let updatedFindings;
        
        if (Array.isArray(assessment.generatedFindings)) {
          // If generatedFindings is an array, update the finding in the array
          updatedFindings = assessment.generatedFindings.map(finding => {
            if (finding.id === findingId) {
              return {
                ...finding,
                status: 'promoted_to_risk',
                riskId: risk.id,
                promotedToRisk: true
              };
            }
            return finding;
          });
        } else {
          // If generatedFindings is an object, update the finding in the object
          updatedFindings = { ...assessment.generatedFindings };
          if (updatedFindings[findingId]) {
            updatedFindings[findingId] = {
              ...updatedFindings[findingId],
              status: 'promoted_to_risk',
              riskId: risk.id,
              promotedToRisk: true
            };
          }
        }
        
        // Update the assessment
        await patch(`/assessments/${assessmentId}`, {
          generatedFindings: updatedFindings
        });
      }

      // Also update the findings_to_risk mapping
      try {
        await post(`/findings_to_risk/assessmentFindings`, {
          assessmentId: assessmentId || 'unknown',
          findingId: findingId,
          status: 'promoted_to_risk',
          riskId: risk.id,
          promotedToRisk: true
        });
      } catch (mappingError) {
        console.warn('Error updating findings_to_risk mapping:', mappingError);
      }

      return { success: true, riskId: risk.id };
    } catch (error) {
      console.error('Promote to risk error:', error);
      throw error;
    }
  }
}

export default new AuditApi();