import { delay, getCurrentDate, validateRequired, checkExists } from '../apiHelpers';
import {
  mockSystems,
  SystemStatus,
  ATOStatus,
  SecurityLevel,
  InformationLevel,
  SystemCategory,
  mockNetworkTypes,
  mockComponentTypes,
  mockProcedureTypes,
  mockCommonPorts
} from '../mocks/systemMockData';
import { mockAuthData } from '../mocks/authorizationMockData';

// Re-export enums for backward compatibility
export { SystemStatus, ATOStatus, SecurityLevel, InformationLevel, SystemCategory };

// In-memory storage for CRUD operations
let systems = [...mockSystems];

export const systemApi = {
  getSystems: async (clientId) => {
    await delay(500);
    validateRequired({ clientId }, ['clientId']);
    
    const numericClientId = Number(clientId);
    const filteredSystems = systems.filter(s => s.clientId === numericClientId);
    return [...filteredSystems];
  },

  getSystemTypes: async () => {
    await delay(300);
    return [
      'Major Application',
      'General Support System',
      'Minor Application',
      'Other'
    ];
  },

  getNetworkTypes: async () => {
    await delay(300);
    return [...mockNetworkTypes];
  },

  getComponentTypes: async () => {
    await delay(300);
    return [...mockComponentTypes];
  },

  getProcedureTypes: async () => {
    await delay(300);
    return [...mockProcedureTypes];
  },

  getCommonPorts: async () => {
    await delay(300);
    return [...mockCommonPorts];
  },

  getSystemStatuses: async () => {
    await delay(300);
    return Object.values(SystemStatus);
  },

  getATOStatuses: async () => {
    await delay(300);
    return Object.values(ATOStatus);
  },

  getSecurityLevels: async () => {
    await delay(300);
    return Object.values(SecurityLevel);
  },

  getInformationLevels: async () => {
    await delay(300);
    return Object.values(InformationLevel);
  },

  getSystemCategories: async () => {
    await delay(300);
    return Object.values(SystemCategory);
  },

  getSystem: async (clientId, systemId) => {
    await delay(300);
    validateRequired({ clientId, systemId }, ['clientId', 'systemId']);
    
    const numericClientId = Number(clientId);
    const system = systems.find(s => 
      s.clientId === numericClientId && 
      s.id === systemId
    );
    
    checkExists(system, 'System');

    // Get authorization data from mock data
    const authData = mockAuthData[clientId]?.[systemId] || {
      riskAssessment: { risks: [], nonCompliantControls: [] },
      package: {
        completed: [],
        pending: [],
        executiveSummary: '',
        status: 'not-started',
        validationStatus: 'pending',
        completionPercentage: 0,
      },
      decision: {
        result: '',
        official: '',
        date: '',
        expirationDate: '',
        justification: '',
        conditions: [],
        boundary: '',
      },
    };

    // Add authorization data to system response
    const systemWithAuth = {
      ...system,
      phases: {
        ...system.phases,
        authorization: authData
      }
    };
    
    return systemWithAuth;
  },

  createPOAMItem: async (clientId, systemId, poamData) => {
    await delay(800);
    validateRequired({ clientId, systemId, ...poamData }, ['clientId', 'systemId', 'controlId', 'mitigationPlan']);
    
    const numericClientId = Number(clientId);
    const systemIndex = systems.findIndex(s => 
      s.clientId === numericClientId && 
      s.id === systemId
    );
    
    checkExists(systems[systemIndex], 'System');

    const newPOAM = {
      id: `poam-${Date.now()}`,
      ...poamData,
      status: 'OPEN',
      dateCreated: getCurrentDate(),
    };

    // Update system's authorization data
    if (!systems[systemIndex].phases) {
      systems[systemIndex].phases = {};
    }
    if (!systems[systemIndex].phases.authorization) {
      systems[systemIndex].phases.authorization = mockAuthData[clientId]?.[systemId] || {
        riskAssessment: { risks: [], nonCompliantControls: [] },
        package: { completed: [], pending: [] },
        decision: {},
      };
    }

    systems[systemIndex].phases.authorization.riskAssessment.risks.push(newPOAM);
    systems[systemIndex].updatedAt = getCurrentDate();

    return newPOAM;
  },

  updateAuthorizationPackage: async (clientId, systemId, packageData) => {
    await delay(500);
    validateRequired({ clientId, systemId }, ['clientId', 'systemId']);
    
    const numericClientId = Number(clientId);
    const systemIndex = systems.findIndex(s => 
      s.clientId === numericClientId && 
      s.id === systemId
    );
    
    checkExists(systems[systemIndex], 'System');

    // Ensure authorization data exists
    if (!systems[systemIndex].phases) {
      systems[systemIndex].phases = {};
    }
    if (!systems[systemIndex].phases.authorization) {
      systems[systemIndex].phases.authorization = mockAuthData[clientId]?.[systemId] || {
        riskAssessment: { risks: [], nonCompliantControls: [] },
        package: { completed: [], pending: [] },
        decision: {},
      };
    }

    // Update package data
    systems[systemIndex].phases.authorization.package = {
      ...systems[systemIndex].phases.authorization.package,
      ...packageData,
    };
    systems[systemIndex].updatedAt = getCurrentDate();

    return systems[systemIndex].phases.authorization.package;
  },

  updateAuthorizationDecision: async (clientId, systemId, decisionData) => {
    await delay(500);
    validateRequired({ clientId, systemId }, ['clientId', 'systemId']);
    
    const numericClientId = Number(clientId);
    const systemIndex = systems.findIndex(s => 
      s.clientId === numericClientId && 
      s.id === systemId
    );
    
    checkExists(systems[systemIndex], 'System');

    // Ensure authorization data exists
    if (!systems[systemIndex].phases) {
      systems[systemIndex].phases = {};
    }
    if (!systems[systemIndex].phases.authorization) {
      systems[systemIndex].phases.authorization = mockAuthData[clientId]?.[systemId] || {
        riskAssessment: { risks: [], nonCompliantControls: [] },
        package: { completed: [], pending: [] },
        decision: {},
      };
    }

    // Update decision data
    systems[systemIndex].phases.authorization.decision = {
      ...systems[systemIndex].phases.authorization.decision,
      ...decisionData,
    };
    systems[systemIndex].updatedAt = getCurrentDate();

    return systems[systemIndex].phases.authorization.decision;
  },

  validateAuthorizationPackage: async (clientId, systemId) => {
    await delay(1000);
    validateRequired({ clientId, systemId }, ['clientId', 'systemId']);
    
    const numericClientId = Number(clientId);
    const system = systems.find(s => 
      s.clientId === numericClientId && 
      s.id === systemId
    );
    
    checkExists(system, 'System');

    // Simulate package validation
    return {
      status: 'VALIDATED',
      timestamp: getCurrentDate(),
      findings: [],
      recommendations: [
        'Ensure all POA&M items have detailed remediation plans',
        'Update system boundary documentation with network diagrams',
        'Include detailed testing results in security assessment report'
      ]
    };
  }
};

export default systemApi;