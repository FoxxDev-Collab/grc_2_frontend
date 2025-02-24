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
      
      // Extract findings from all assessments
      let allFindings = assessments.flatMap(assessment => 
        (assessment.generatedFindings || []).map(finding => ({
          ...finding,
          sourceType: SOURCE_TYPES.SECURITY_ASSESSMENT,
          sourceDetails: `Security Assessment: ${assessment.name}`,
          createdDate: assessment.date,
          assessmentId: assessment.id
        }))
      );

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
          deferred: findings.filter(f => f.status === 'deferred').length
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
        status: 'open'
      });

      // Update the original finding to mark it as promoted
      const sourceType = findingId.split('-')[0];
      if (sourceType === 'sa') {
        const assessmentId = findingId.substring(3);
        const response = await fetch(`${API_URL}/assessmentHistory/${assessmentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            generatedFindings: {
              [findingId]: {
                status: 'promoted_to_risk',
                riskId: risk.id,
                promotedToRisk: true
              }
            }
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update finding promotion status');
        }
      }

      return { success: true, riskId: risk.id };
    } catch (error) {
      throw new Error(`Failed to promote finding to risk: ${error.message}`);
    }
  }
};

export default auditApi;