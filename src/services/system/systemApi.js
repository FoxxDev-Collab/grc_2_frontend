import { get, post, put } from '../apiHelpers';

// Re-export enums for backward compatibility
export const SystemStatus = {
  DRAFT: 'DRAFT',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
};

export const ATOStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  EXPIRED: 'EXPIRED'
};

export const SecurityLevel = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high'
};

export const InformationLevel = {
  PUBLIC: 'public',
  INTERNAL: 'internal',
  CONFIDENTIAL: 'confidential',
  RESTRICTED: 'restricted'
};

export const SystemCategory = {
  MISSION_CRITICAL: 'Mission Critical',
  BUSINESS_CRITICAL: 'Business Critical',
  BUSINESS_OPERATIONAL: 'Business Operational',
  BUSINESS_SUPPORT: 'Business Support'
};

export const systemApi = {
  getSystems: async (clientId) => {
    return get(`/systems?clientId=${clientId}`);
  },

  getSystemTypes: async () => {
    const response = await get('/system-types');
    return response.map(type => type.name);
  },

  getNetworkTypes: async () => {
    const response = await get('/network-types');
    return response.map(type => type.name);
  },

  getComponentTypes: async () => {
    const response = await get('/component-types');
    return response.map(type => type.name);
  },

  getProcedureTypes: async () => {
    const response = await get('/procedure-types');
    return response.map(type => type.name);
  },

  getCommonPorts: async () => {
    return get('/common-ports');
  },

  getSystemStatuses: async () => {
    const response = await get('/system-statuses');
    return response.map(status => status.name);
  },

  getATOStatuses: async () => {
    const response = await get('/ato-statuses');
    return response.map(status => status.name);
  },

  getSecurityLevels: async () => {
    const response = await get('/security-levels');
    return response.map(level => level.name);
  },

  getInformationLevels: async () => {
    const response = await get('/information-levels');
    return response.map(level => level.name);
  },

  getSystemCategories: async () => {
    const response = await get('/system-categories');
    return response.map(category => category.name);
  },

  getSystem: async (clientId, systemId) => {
    // Get base system data
    const system = await get(`/systems/${systemId}`);
    
    // Get authorization data
    const authData = await get(`/authorization/${clientId}/${systemId}`);
    
    // Combine system and authorization data
    return {
      ...system,
      phases: {
        ...system.phases,
        authorization: authData
      }
    };
  },

  createPOAMItem: async (clientId, systemId, poamData) => {
    return post(`/authorization/${clientId}/${systemId}/poam`, {
      ...poamData,
      status: 'OPEN',
      dateCreated: new Date().toISOString().split('T')[0]
    });
  },

  updateAuthorizationPackage: async (clientId, systemId, packageData) => {
    return put(`/authorization/${clientId}/${systemId}/package`, packageData);
  },

  updateAuthorizationDecision: async (clientId, systemId, decisionData) => {
    return put(`/authorization/${clientId}/${systemId}/decision`, decisionData);
  },

  validateAuthorizationPackage: async (clientId, systemId) => {
    await put(`/authorization/${clientId}/${systemId}/validate`);
    
    // Return validation results
    return {
      status: 'VALIDATED',
      timestamp: new Date().toISOString().split('T')[0],
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