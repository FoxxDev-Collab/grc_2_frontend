import { delay, getCurrentDate, validateRequired, checkExists } from '../apiHelpers';
import { mockRisks } from '../mocks/riskMockData';

// In-memory storage
let risks = [...mockRisks];

export const riskAssessmentApi = {
  // Get all risks
  getRisks: async (clientId) => {
    await delay(500);
    return risks.filter(risk => risk.clientId === Number(clientId));
  },

  // Get risk by ID
  getRisk: async (clientId, riskId) => {
    await delay(300);
    const risk = risks.find(r => r.clientId === Number(clientId) && r.id === riskId);
    checkExists(risk, 'Risk');
    return { ...risk };
  },

  // Create new risk
  createRisk: async (clientId, riskData) => {
    await delay(800);
    validateRequired(riskData, ['name', 'description', 'impact', 'likelihood', 'category']);

    const newRisk = {
      id: `r-${Date.now()}`,
      clientId: Number(clientId),
      lastAssessed: getCurrentDate(),
      sourceFindings: [],
      businessImpact: {
        financial: '',
        operational: '',
        reputational: '',
        compliance: ''
      },
      treatment: {
        approach: 'mitigate',
        plan: '',
        status: 'not_started',
        objectives: []
      },
      ...riskData
    };

    risks.push(newRisk);
    return { ...newRisk };
  },

  // Update risk
  updateRisk: async (clientId, riskId, updates) => {
    await delay(500);
    const index = risks.findIndex(r => r.clientId === Number(clientId) && r.id === riskId);
    checkExists(risks[index], 'Risk');

    risks[index] = {
      ...risks[index],
      ...updates,
      lastAssessed: getCurrentDate()
    };

    return { ...risks[index] };
  },

  // Delete risk
  deleteRisk: async (clientId, riskId) => {
    await delay(800);
    const index = risks.findIndex(r => r.clientId === Number(clientId) && r.id === riskId);
    checkExists(risks[index], 'Risk');

    risks = risks.filter(r => !(r.clientId === Number(clientId) && r.id === riskId));
    return { success: true };
  },

  // Add finding to risk
  addFindingToRisk: async (clientId, riskId, findingData) => {
    await delay(500);
    const index = risks.findIndex(r => r.clientId === Number(clientId) && r.id === riskId);
    checkExists(risks[index], 'Risk');

    validateRequired(findingData, ['findingId', 'title', 'sourceType']);

    risks[index].sourceFindings = [
      ...(risks[index].sourceFindings || []),
      {
        ...findingData,
        date: getCurrentDate()
      }
    ];

    return { ...risks[index] };
  },

  // Remove finding from risk
  removeFindingFromRisk: async (clientId, riskId, findingId) => {
    await delay(500);
    const index = risks.findIndex(r => r.clientId === Number(clientId) && r.id === riskId);
    checkExists(risks[index], 'Risk');

    risks[index].sourceFindings = risks[index].sourceFindings.filter(f => f.findingId !== findingId);

    return { ...risks[index] };
  },

  // Update risk treatment
  updateRiskTreatment: async (clientId, riskId, treatmentData) => {
    await delay(500);
    const index = risks.findIndex(r => r.clientId === Number(clientId) && r.id === riskId);
    checkExists(risks[index], 'Risk');

    validateRequired(treatmentData, ['approach', 'plan']);

    risks[index].treatment = {
      ...risks[index].treatment,
      ...treatmentData,
      lastUpdated: getCurrentDate()
    };

    return { ...risks[index] };
  },

  // Link objective to risk treatment
  linkObjectiveToRisk: async (clientId, riskId, objectiveId) => {
    await delay(500);
    const index = risks.findIndex(r => r.clientId === Number(clientId) && r.id === riskId);
    checkExists(risks[index], 'Risk');

    if (!risks[index].treatment.objectives) {
      risks[index].treatment.objectives = [];
    }

    if (!risks[index].treatment.objectives.includes(objectiveId)) {
      risks[index].treatment.objectives.push(objectiveId);
    }

    return { ...risks[index] };
  },

  // Unlink objective from risk treatment
  unlinkObjectiveFromRisk: async (clientId, riskId, objectiveId) => {
    await delay(500);
    const index = risks.findIndex(r => r.clientId === Number(clientId) && r.id === riskId);
    checkExists(risks[index], 'Risk');

    if (risks[index].treatment.objectives) {
      risks[index].treatment.objectives = risks[index].treatment.objectives.filter(id => id !== objectiveId);
    }

    return { ...risks[index] };
  },

  // Get risk statistics
  getRiskStats: async (clientId) => {
    await delay(400);
    const clientRisks = risks.filter(risk => risk.clientId === Number(clientId));

    return {
      total: clientRisks.length,
      byImpact: {
        high: clientRisks.filter(r => r.impact === 'high').length,
        medium: clientRisks.filter(r => r.impact === 'medium').length,
        low: clientRisks.filter(r => r.impact === 'low').length
      },
      byLikelihood: {
        high: clientRisks.filter(r => r.likelihood === 'high').length,
        medium: clientRisks.filter(r => r.likelihood === 'medium').length,
        low: clientRisks.filter(r => r.likelihood === 'low').length
      },
      byStatus: {
        active: clientRisks.filter(r => r.status === 'active').length,
        mitigated: clientRisks.filter(r => r.status === 'mitigated').length,
        accepted: clientRisks.filter(r => r.status === 'accepted').length,
        transferred: clientRisks.filter(r => r.status === 'transferred').length
      },
      byTreatment: {
        not_started: clientRisks.filter(r => r.treatment?.status === 'not_started').length,
        in_progress: clientRisks.filter(r => r.treatment?.status === 'in_progress').length,
        completed: clientRisks.filter(r => r.treatment?.status === 'completed').length,
        blocked: clientRisks.filter(r => r.treatment?.status === 'blocked').length
      },
      sourceAnalysis: {
        fromFindings: clientRisks.filter(r => r.sourceFindings?.length > 0).length,
        manuallyIdentified: clientRisks.filter(r => !r.sourceFindings?.length).length,
        bySourceType: {
          security_assessment: clientRisks.filter(r => 
            r.sourceFindings?.some(f => f.sourceType === 'security_assessment')
          ).length,
          vulnerability_scan: clientRisks.filter(r => 
            r.sourceFindings?.some(f => f.sourceType === 'vulnerability_scan')
          ).length,
          external_audit: clientRisks.filter(r => 
            r.sourceFindings?.some(f => f.sourceType === 'external_audit')
          ).length
        }
      }
    };
  },

  // Get framework progress
  getFrameworkProgress: async (clientId) => {
    await delay(400);
    const clientRisks = risks.filter(risk => risk.clientId === Number(clientId));

    return {
      riskManagement: {
        identified: clientRisks.length,
        assessed: clientRisks.filter(r => r.impact && r.likelihood).length,
        treated: clientRisks.filter(r => r.treatment?.plan).length,
        mitigated: clientRisks.filter(r => r.status === 'mitigated').length
      },
      coverage: {
        accessControl: clientRisks.filter(r => r.category === 'Access Control').length,
        dataProtection: clientRisks.filter(r => r.category === 'Data Protection').length,
        vulnerabilityManagement: clientRisks.filter(r => r.category === 'Vulnerability Management').length,
        thirdPartyRisk: clientRisks.filter(r => r.category === 'Third Party Risk').length,
        businessContinuity: clientRisks.filter(r => r.category === 'Business Continuity').length,
        compliance: clientRisks.filter(r => r.category === 'Compliance').length
      },
      trends: {
        newRisks: {
          last30Days: clientRisks.filter(r => 
            new Date(r.lastAssessed) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ).length,
          last90Days: clientRisks.filter(r => 
            new Date(r.lastAssessed) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          ).length
        },
        mitigatedRisks: {
          last30Days: clientRisks.filter(r => 
            r.status === 'mitigated' && 
            new Date(r.lastAssessed) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ).length,
          last90Days: clientRisks.filter(r => 
            r.status === 'mitigated' && 
            new Date(r.lastAssessed) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          ).length
        }
      }
    };
  }
};

export default riskAssessmentApi;