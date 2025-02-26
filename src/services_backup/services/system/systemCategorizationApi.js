import { ApiError } from '../apiHelpers';

const API_URL = 'http://localhost:3001';

export const systemCategorizationApi = {
  // Information Types
  getInformationTypes: async (clientId, systemId) => {
    const response = await fetch(`${API_URL}/categorization/${systemId}/information-types`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch information types', response.status);
    }
    const data = await response.json();
    return data.informationTypes;
  },

  updateInformationTypes: async (clientId, systemId, data) => {
    const response = await fetch(`${API_URL}/categorization/${systemId}/information-types`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to update information types', response.status);
    }
    
    const responseData = await response.json();
    return responseData.informationTypes;
  },

  // Impact Analysis
  getImpactAnalysis: async (clientId, systemId) => {
    const response = await fetch(`${API_URL}/categorization/${systemId}/impact-analysis`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch impact analysis', response.status);
    }
    const data = await response.json();
    return data.impactAnalysis;
  },

  updateImpactAnalysis: async (clientId, systemId, data) => {
    const response = await fetch(`${API_URL}/categorization/${systemId}/impact-analysis`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to update impact analysis', response.status);
    }
    
    const responseData = await response.json();
    return responseData.impactAnalysis;
  },

  // Security Objectives
  getSecurityObjectives: async (clientId, systemId) => {
    const response = await fetch(`${API_URL}/categorization/${systemId}/security-objectives`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch security objectives', response.status);
    }
    const data = await response.json();
    return data.securityObjectives;
  },

  updateSecurityObjectives: async (clientId, systemId, data) => {
    const response = await fetch(`${API_URL}/categorization/${systemId}/security-objectives`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to update security objectives', response.status);
    }
    
    const responseData = await response.json();
    return responseData.securityObjectives;
  },

  // Progress tracking
  getProgress: async (clientId, systemId) => {
    const response = await fetch(`${API_URL}/categorization/${systemId}/progress`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch progress', response.status);
    }
    const data = await response.json();
    return data.progress;
  }
};

export default systemCategorizationApi;