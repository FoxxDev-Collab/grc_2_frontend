import { get, post, put } from '../apiHelpers';

const authorizationApi = {
  // Get authorization data for a system
  getAuthorizationData: async (clientId, systemId) => {
    return get(`/authorization/${clientId}/${systemId}`);
  },

  // Update risk assessment
  updateRiskAssessment: async (clientId, systemId, riskData) => {
    return put(`/authorization/${clientId}/${systemId}/risk-assessment`, riskData);
  },

  // Create POA&M item
  createPOAMItem: async (clientId, systemId, poamItem) => {
    return post(`/authorization/${clientId}/${systemId}/poam`, poamItem);
  },

  // Update authorization package
  updateAuthorizationPackage: async (clientId, systemId, packageData) => {
    return put(`/authorization/${clientId}/${systemId}/package`, packageData);
  },

  // Validate authorization package
  validateAuthorizationPackage: async (clientId, systemId) => {
    return put(`/authorization/${clientId}/${systemId}/validate`);
  },

  // Update authorization decision
  updateAuthorizationDecision: async (clientId, systemId, decisionData) => {
    return put(`/authorization/${clientId}/${systemId}/decision`, decisionData);
  }
};

export default authorizationApi;