// Initial mock data
const mockAuthData = {
  'client-1': {
    'sys-001': {
      riskAssessment: {
        risks: [
          {
            id: 'RISK-001',
            description: 'Insufficient access controls',
            likelihood: 'high',
            impact: 'high',
            status: 'open',
          },
        ],
        nonCompliantControls: [
          {
            controlId: 'AC-2',
            title: 'Account Management',
            status: 'non-compliant',
            findings: 'Missing automated account management procedures',
          },
        ],
      },
      package: {
        completed: ['System Security Plan', 'Risk Assessment Report'],
        pending: ['Privacy Impact Assessment', 'Contingency Plan'],
        executiveSummary: 'System implements moderate security controls with some gaps identified.',
        status: 'in-progress',
        validationStatus: 'pending',
        completionPercentage: 65,
      },
      decision: {
        result: 'pending',
        official: '',
        date: '',
        expirationDate: '',
        justification: '',
        conditions: [],
        boundary: 'System includes all components within the development network segment.',
      },
    },
  },
};

// Helper function to get client system data
const getClientSystemData = (clientId, systemId) => {
  const data = mockAuthData[clientId]?.[systemId];
  if (!data) {
    throw new Error('Authorization data not found');
  }
  return { ...data }; // Return a copy to prevent direct modification
};

const authorizationMockData = {
  getAuthorizationData: async (clientId, systemId) => {
    return getClientSystemData(clientId, systemId);
  },

  updateRiskAssessment: async (clientId, systemId, riskData) => {
    const currentData = getClientSystemData(clientId, systemId);
    mockAuthData[clientId][systemId].riskAssessment = {
      ...currentData.riskAssessment,
      ...riskData,
    };
    return { ...mockAuthData[clientId][systemId] };
  },

  createPOAMItem: async (clientId, systemId, poamItem) => {
    const newRisk = {
      id: `RISK-${Date.now()}`,
      ...poamItem,
      status: 'open',
    };
    mockAuthData[clientId][systemId].riskAssessment.risks.push(newRisk);
    return { ...mockAuthData[clientId][systemId] };
  },

  updateAuthorizationPackage: async (clientId, systemId, packageData) => {
    const currentData = getClientSystemData(clientId, systemId);
    mockAuthData[clientId][systemId].package = {
      ...currentData.package,
      ...packageData,
    };
    return { ...mockAuthData[clientId][systemId] };
  },

  validateAuthorizationPackage: async (clientId, systemId) => {
    getClientSystemData(clientId, systemId); // Verify system exists
    mockAuthData[clientId][systemId].package.validationStatus = 'validated';
    mockAuthData[clientId][systemId].package.completionPercentage = 100;
    return { ...mockAuthData[clientId][systemId] };
  },

  updateAuthorizationDecision: async (clientId, systemId, decisionData) => {
    const currentData = getClientSystemData(clientId, systemId);
    mockAuthData[clientId][systemId].decision = {
      ...currentData.decision,
      ...decisionData,
    };
    return { ...mockAuthData[clientId][systemId] };
  },
};

export { mockAuthData };
export default authorizationMockData;