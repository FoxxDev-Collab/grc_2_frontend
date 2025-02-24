import { handleApiResponse, handleApiError } from '../apiHelpers';
import authorizationMockData from '../mocks/authorizationMockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const authorizationApi = {
  // Get authorization data for a system
  getAuthorizationData: async (clientId, systemId) => {
    if (USE_MOCK) return authorizationMockData.getAuthorizationData(clientId, systemId);
    
    try {
      const response = await fetch(
        `${BASE_URL}/clients/${clientId}/systems/${systemId}/authorization`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update risk assessment
  updateRiskAssessment: async (clientId, systemId, riskData) => {
    if (USE_MOCK) return authorizationMockData.updateRiskAssessment(clientId, systemId, riskData);
    
    try {
      const response = await fetch(
        `${BASE_URL}/clients/${clientId}/systems/${systemId}/authorization/risk-assessment`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(riskData),
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create POA&M item
  createPOAMItem: async (clientId, systemId, poamItem) => {
    if (USE_MOCK) return authorizationMockData.createPOAMItem(clientId, systemId, poamItem);
    
    try {
      const response = await fetch(
        `${BASE_URL}/clients/${clientId}/systems/${systemId}/authorization/poam`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(poamItem),
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update authorization package
  updateAuthorizationPackage: async (clientId, systemId, packageData) => {
    if (USE_MOCK) return authorizationMockData.updateAuthorizationPackage(clientId, systemId, packageData);
    
    try {
      const response = await fetch(
        `${BASE_URL}/clients/${clientId}/systems/${systemId}/authorization/package`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(packageData),
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Validate authorization package
  validateAuthorizationPackage: async (clientId, systemId) => {
    if (USE_MOCK) return authorizationMockData.validateAuthorizationPackage(clientId, systemId);
    
    try {
      const response = await fetch(
        `${BASE_URL}/clients/${clientId}/systems/${systemId}/authorization/package/validate`,
        {
          method: 'POST',
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update authorization decision
  updateAuthorizationDecision: async (clientId, systemId, decisionData) => {
    if (USE_MOCK) return authorizationMockData.updateAuthorizationDecision(clientId, systemId, decisionData);
    
    try {
      const response = await fetch(
        `${BASE_URL}/clients/${clientId}/systems/${systemId}/authorization/decision`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(decisionData),
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default authorizationApi;