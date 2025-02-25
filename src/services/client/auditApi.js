import { validateRequired } from '../apiHelpers';
import riskAssessmentApi from './riskAssessmentApi';

const API_URL = 'http://localhost:3001';

// Source types that map to different APIs
const SOURCE_TYPES = {
  SECURITY_ASSESSMENT: 'security_assessment',
  VULNERABILITY_SCAN: 'vulnerability_scan',
  COMPLIANCE_REVIEW: 'compliance_review',
  EXTERNAL_AUDIT: 'external_audit',
  INTERNAL_AUDIT: 'internal_audit',
  INCIDENT_REVIEW: 'incident_review'
};

const SEVERITY_LEVELS = ['critical', 'high', 'medium', 'low', 'informational'];
const FINDING_STATUSES = ['open', 'in_progress', 'closed', 'reopened', 'duplicate', 'deferred'];
const COMMON_TAGS = [
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

export const auditApi = {
  // Get all findings by aggregating from different sources
  getFindings: async (clientId, filters = {}) => {
    validateRequired({ clientId }, ['clientId']);
    const numericClientId = Number(clientId);

    try {
      // Get all assessments for the client
      const response = await fetch(`${API_URL}/assessmentHistory?clientId=${numericClientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }
      const assessments = await response.json();
      
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
      throw new Error(`Failed to fetch findings: ${error.message}`);
    }
  },

  // Get finding metrics
  getFindingMetrics: async (clientId) => {
    try {
      const findings = await auditApi.getFindings(Number(clientId));

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
      throw new Error(`Failed to fetch finding metrics: ${error.message}`);
    }
  },

  // Get source types
  getSourceTypes: async () => {
    return Object.values(SOURCE_TYPES);
  },

  // Get severity levels
  getSeverityLevels: async () => {
    return [...SEVERITY_LEVELS];
  },

  // Get finding statuses
  getFindingStatuses: async () => {
    return [...FINDING_STATUSES];
  },

  // Get common tags
  getCommonTags: async () => {
    return [...COMMON_TAGS];
  },

  // Delete a finding
  deleteFinding: async (findingId, clientId) => {
    validateRequired({ findingId, clientId }, ['findingId', 'clientId']);
    
    try {
      // Find which assessment this finding belongs to
      let assessmentId;
      
      try {
        // Get all assessments for the client
        const response = await fetch(`${API_URL}/assessmentHistory?clientId=${Number(clientId)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch assessments');
        }
        
        const assessments = await response.json();
        
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

      if (assessmentId) {
        // Get the current assessment
        const assessmentResponse = await fetch(`${API_URL}/assessmentHistory/${assessmentId}`);
        if (!assessmentResponse.ok) {
          throw new Error('Failed to fetch assessment');
        }
        
        const assessment = await assessmentResponse.json();
        
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
        const updateResponse = await fetch(`${API_URL}/assessmentHistory/${assessmentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            generatedFindings: updatedFindings
          })
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to delete finding');
        }
        
        return { success: true };
      } else {
        throw new Error('Could not find assessment for this finding');
      }
    } catch (error) {
      throw new Error(`Failed to delete finding: ${error.message}`);
    }
  },

  // Update finding status
  updateFindingStatus: async (findingId, clientId, status) => {
    validateRequired({ findingId, clientId, status }, ['findingId', 'clientId', 'status']);
    
    try {
      // Find which assessment this finding belongs to
      let assessmentId;
      
      try {
        // Get all assessments for the client
        const response = await fetch(`${API_URL}/assessmentHistory?clientId=${Number(clientId)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch assessments');
        }
        
        const assessments = await response.json();
        
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

      if (assessmentId) {
        // Get the current assessment
        const assessmentResponse = await fetch(`${API_URL}/assessmentHistory/${assessmentId}`);
        if (!assessmentResponse.ok) {
          throw new Error('Failed to fetch assessment');
        }
        
        const assessment = await assessmentResponse.json();
        
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
        const updateResponse = await fetch(`${API_URL}/assessmentHistory/${assessmentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            generatedFindings: updatedFindings
          })
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update finding status');
        }
        
        return { success: true };
      } else {
        throw new Error('Could not find assessment for this finding');
      }
    } catch (error) {
      throw new Error(`Failed to update finding status: ${error.message}`);
    }
  },

  // Promote finding to risk
  promoteToRisk: async (findingId, riskData) => {
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
      let assessmentId;
      
      try {
        // Get all assessments for the client
        const response = await fetch(`${API_URL}/assessmentHistory?clientId=${Number(riskData.clientId)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch assessments');
        }
        
        const assessments = await response.json();
        
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

      if (assessmentId) {
        // Get the current assessment
        const assessmentResponse = await fetch(`${API_URL}/assessmentHistory/${assessmentId}`);
        if (!assessmentResponse.ok) {
          throw new Error('Failed to fetch assessment');
        }
        
        const assessment = await assessmentResponse.json();
        
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
        const updateResponse = await fetch(`${API_URL}/assessmentHistory/${assessmentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            generatedFindings: updatedFindings
          })
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update finding promotion status');
        }
      }

      // Also update the findings_to_risk mapping
      try {
        const mappingResponse = await fetch(`${API_URL}/findings_to_risk/assessmentFindings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessmentId: assessmentId || 'unknown',
            findingId: findingId,
            status: 'promoted_to_risk',
            riskId: risk.id,
            promotedToRisk: true
          })
        });

        if (!mappingResponse.ok) {
          console.warn('Failed to update findings_to_risk mapping, but risk was created');
        }
      } catch (mappingError) {
        console.warn('Error updating findings_to_risk mapping:', mappingError);
      }

      return { success: true, riskId: risk.id };
    } catch (error) {
      throw new Error(`Failed to promote finding to risk: ${error.message}`);
    }
  }
};

export default auditApi;