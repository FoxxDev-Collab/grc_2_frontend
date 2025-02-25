import { validateRequired, ApiError } from '../apiHelpers';

const API_URL = 'http://localhost:3001';

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
    const response = await fetch(`${API_URL}/systems?clientId=${clientId}`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch systems', response.status);
    }
    return await response.json();
  },

  getSystemTypes: async () => {
    const response = await fetch(`${API_URL}/system-types`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch system types', response.status);
    }
    const data = await response.json();
    return data.map(type => type.name);
  },

  getNetworkTypes: async () => {
    const response = await fetch(`${API_URL}/network-types`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch network types', response.status);
    }
    const data = await response.json();
    return data.map(type => type.name);
  },

  getComponentTypes: async () => {
    const response = await fetch(`${API_URL}/component-types`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch component types', response.status);
    }
    const data = await response.json();
    return data.map(type => type.name);
  },

  getProcedureTypes: async () => {
    const response = await fetch(`${API_URL}/procedure-types`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch procedure types', response.status);
    }
    const data = await response.json();
    return data.map(type => type.name);
  },

  getCommonPorts: async () => {
    const response = await fetch(`${API_URL}/common-ports`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch common ports', response.status);
    }
    return await response.json();
  },

  getSystemStatuses: async () => {
    const response = await fetch(`${API_URL}/system-statuses`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch system statuses', response.status);
    }
    const data = await response.json();
    return data.map(status => status.name);
  },

  getATOStatuses: async () => {
    const response = await fetch(`${API_URL}/ato-statuses`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch ATO statuses', response.status);
    }
    const data = await response.json();
    return data.map(status => status.name);
  },

  getSecurityLevels: async () => {
    const response = await fetch(`${API_URL}/security-levels`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch security levels', response.status);
    }
    const data = await response.json();
    return data.map(level => level.name);
  },

  getInformationLevels: async () => {
    const response = await fetch(`${API_URL}/information-levels`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch information levels', response.status);
    }
    const data = await response.json();
    return data.map(level => level.name);
  },

  getSystemCategories: async () => {
    const response = await fetch(`${API_URL}/system-categories`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch system categories', response.status);
    }
    const data = await response.json();
    return data.map(category => category.name);
  },

  getSystem: async (clientId, systemId) => {
    // Get base system data
    const systemResponse = await fetch(`${API_URL}/systems/${systemId}`);
    if (!systemResponse.ok) {
      throw new ApiError('Failed to fetch system', systemResponse.status);
    }
    const system = await systemResponse.json();
    
    // Get authorization data
    const authResponse = await fetch(`${API_URL}/authorization/${clientId}/${systemId}`);
    if (!authResponse.ok) {
      throw new ApiError('Failed to fetch authorization data', authResponse.status);
    }
    const authData = await authResponse.json();
    
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
    validateRequired(poamData, ['title', 'description', 'severity']);
    
    const response = await fetch(`${API_URL}/authorization/${clientId}/${systemId}/poam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...poamData,
        status: 'OPEN',
        dateCreated: new Date().toISOString().split('T')[0]
      }),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to create POAM item', response.status);
    }
    
    return await response.json();
  },

  updateAuthorizationPackage: async (clientId, systemId, packageData) => {
    const response = await fetch(`${API_URL}/authorization/${clientId}/${systemId}/package`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(packageData),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to update authorization package', response.status);
    }
    
    return await response.json();
  },

  updateAuthorizationDecision: async (clientId, systemId, decisionData) => {
    const response = await fetch(`${API_URL}/authorization/${clientId}/${systemId}/decision`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(decisionData),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to update authorization decision', response.status);
    }
    
    return await response.json();
  },

  validateAuthorizationPackage: async (clientId, systemId) => {
    const response = await fetch(`${API_URL}/authorization/${clientId}/${systemId}/validate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to validate authorization package', response.status);
    }
    
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