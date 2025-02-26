import { ApiError } from '../../api/BaseApiService';

const API_URL = 'http://localhost:3001';

const authorizationApi = {
  // Get authorization data for a system
  getAuthorizationData: async (clientId, systemId) => {
    const response = await fetch(`${API_URL}/authorization/${clientId}/${systemId}`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch authorization data', response.status);
    }
    return await response.json();
  },

  // Update risk assessment
  updateRiskAssessment: async (clientId, systemId, riskData) => {
    const response = await fetch(`${API_URL}/authorization/${clientId}/${systemId}/risk-assessment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(riskData),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to update risk assessment', response.status);
    }
    
    return await response.json();
  },

  // Create POA&M item
  createPOAMItem: async (clientId, systemId, poamItem) => {
    const response = await fetch(`${API_URL}/authorization/${clientId}/${systemId}/poam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(poamItem),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to create POA&M item', response.status);
    }
    
    return await response.json();
  },

  // Update authorization package
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

  // Validate authorization package
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
    
    return await response.json();
  },

  // Update authorization decision
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
  }
};

export default authorizationApi;