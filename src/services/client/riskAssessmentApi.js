import { validateRequired, checkExists } from '../apiHelpers';

const API_URL = 'http://localhost:3001';

export const riskAssessmentApi = {
  // Get all risks
  getRisks: async (clientId) => {
    validateRequired({ clientId }, ['clientId']);
    
    const response = await fetch(`${API_URL}/risks?clientId=${Number(clientId)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch risks');
    }
    
    return await response.json();
  },

  // Get risk by ID
  getRisk: async (clientId, riskId) => {
    validateRequired({ clientId, riskId }, ['clientId', 'riskId']);
    
    const response = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`);
    if (!response.ok) {
      throw new Error('Risk not found');
    }
    
    const risk = await response.json();
    checkExists(risk, 'Risk');
    return risk;
  },

  // Create new risk
  createRisk: async (clientId, riskData) => {
    validateRequired(riskData, ['name', 'description', 'impact', 'likelihood', 'category']);

    const newRisk = {
      clientId: Number(clientId),
      lastAssessed: new Date().toISOString(),
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

    const response = await fetch(`${API_URL}/risks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRisk)
    });

    if (!response.ok) {
      throw new Error('Failed to create risk');
    }

    return await response.json();
  },

  // Update risk
  updateRisk: async (clientId, riskId, updates) => {
    validateRequired({ clientId, riskId }, ['clientId', 'riskId']);

    // First get the existing risk
    const riskResponse = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`);
    if (!riskResponse.ok) {
      throw new Error('Risk not found');
    }
    
    const existingRisk = await riskResponse.json();
    checkExists(existingRisk, 'Risk');

    // Prepare updated risk data
    const updatedRisk = {
      ...existingRisk,
      ...updates,
      lastAssessed: new Date().toISOString()
    };

    // Send the update
    const updateResponse = await fetch(`${API_URL}/risks/${riskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRisk)
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update risk');
    }

    return await updateResponse.json();
  },

  // Delete risk
  deleteRisk: async (clientId, riskId) => {
    validateRequired({ clientId, riskId }, ['clientId', 'riskId']);

    const response = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete risk');
    }

    return { success: true };
  },

  // Add finding to risk
  addFindingToRisk: async (clientId, riskId, findingData) => {
    validateRequired(findingData, ['findingId', 'title', 'sourceType']);

    // First get the existing risk
    const riskResponse = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`);
    if (!riskResponse.ok) {
      throw new Error('Risk not found');
    }
    
    const existingRisk = await riskResponse.json();
    checkExists(existingRisk, 'Risk');

    // Add the finding
    const updatedRisk = {
      ...existingRisk,
      sourceFindings: [
        ...(existingRisk.sourceFindings || []),
        {
          ...findingData,
          date: new Date().toISOString()
        }
      ]
    };

    // Send the update
    const updateResponse = await fetch(`${API_URL}/risks/${riskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRisk)
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to add finding to risk');
    }

    return await updateResponse.json();
  },

  // Remove finding from risk
  removeFindingFromRisk: async (clientId, riskId, findingId) => {
    validateRequired({ clientId, riskId, findingId }, ['clientId', 'riskId', 'findingId']);

    // First get the existing risk
    const riskResponse = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`);
    if (!riskResponse.ok) {
      throw new Error('Risk not found');
    }
    
    const existingRisk = await riskResponse.json();
    checkExists(existingRisk, 'Risk');

    // Remove the finding
    const updatedRisk = {
      ...existingRisk,
      sourceFindings: existingRisk.sourceFindings.filter(f => f.findingId !== findingId)
    };

    // Send the update
    const updateResponse = await fetch(`${API_URL}/risks/${riskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRisk)
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to remove finding from risk');
    }

    return await updateResponse.json();
  },

  // Update risk treatment
  updateRiskTreatment: async (clientId, riskId, treatmentData) => {
    validateRequired(treatmentData, ['approach', 'plan']);

    // First get the existing risk
    const riskResponse = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`);
    if (!riskResponse.ok) {
      throw new Error('Risk not found');
    }
    
    const existingRisk = await riskResponse.json();
    checkExists(existingRisk, 'Risk');

    // Update the treatment
    const updatedRisk = {
      ...existingRisk,
      treatment: {
        ...existingRisk.treatment,
        ...treatmentData,
        lastUpdated: new Date().toISOString()
      }
    };

    // Send the update
    const updateResponse = await fetch(`${API_URL}/risks/${riskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRisk)
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update risk treatment');
    }

    return await updateResponse.json();
  },

  // Link objective to risk treatment
  linkObjectiveToRisk: async (clientId, riskId, objectiveId) => {
    validateRequired({ clientId, riskId, objectiveId }, ['clientId', 'riskId', 'objectiveId']);

    // First get the existing risk
    const riskResponse = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`);
    if (!riskResponse.ok) {
      throw new Error('Risk not found');
    }
    
    const existingRisk = await riskResponse.json();
    checkExists(existingRisk, 'Risk');

    // Initialize objectives array if it doesn't exist
    if (!existingRisk.treatment.objectives) {
      existingRisk.treatment.objectives = [];
    }

    // Add the objective if it doesn't already exist
    if (!existingRisk.treatment.objectives.includes(objectiveId)) {
      const updatedRisk = {
        ...existingRisk,
        treatment: {
          ...existingRisk.treatment,
          objectives: [...existingRisk.treatment.objectives, objectiveId]
        }
      };

      // Send the update
      const updateResponse = await fetch(`${API_URL}/risks/${riskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRisk)
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to link objective to risk');
      }

      return await updateResponse.json();
    }

    return existingRisk;
  },

  // Unlink objective from risk treatment
  unlinkObjectiveFromRisk: async (clientId, riskId, objectiveId) => {
    validateRequired({ clientId, riskId, objectiveId }, ['clientId', 'riskId', 'objectiveId']);

    // First get the existing risk
    const riskResponse = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`);
    if (!riskResponse.ok) {
      throw new Error('Risk not found');
    }
    
    const existingRisk = await riskResponse.json();
    checkExists(existingRisk, 'Risk');

    // Filter out the objective
    if (existingRisk.treatment.objectives) {
      const updatedRisk = {
        ...existingRisk,
        treatment: {
          ...existingRisk.treatment,
          objectives: existingRisk.treatment.objectives.filter(id => id !== objectiveId)
        }
      };

      // Send the update
      const updateResponse = await fetch(`${API_URL}/risks/${riskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRisk)
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to unlink objective from risk');
      }

      return await updateResponse.json();
    }

    return existingRisk;
  },

  // Get risk statistics
  getRiskStats: async (clientId) => {
    validateRequired({ clientId }, ['clientId']);
    
    // Get all risks for the client
    const response = await fetch(`${API_URL}/risks?clientId=${Number(clientId)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch risks');
    }
    
    const clientRisks = await response.json();

    // Calculate statistics
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
    validateRequired({ clientId }, ['clientId']);
    
    // Get all risks for the client
    const response = await fetch(`${API_URL}/risks?clientId=${Number(clientId)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch risks');
    }
    
    const clientRisks = await response.json();

    // Calculate progress
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