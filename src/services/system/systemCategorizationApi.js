import { get, put } from '../apiHelpers';

export const systemCategorizationApi = {
  // Information Types
  getInformationTypes: async (clientId, systemId) => {
    const response = await get(`/categorization/${systemId}/information-types`);
    return response.informationTypes;
  },

  updateInformationTypes: async (clientId, systemId, data) => {
    const response = await put(`/categorization/${systemId}/information-types`, data);
    return response.informationTypes;
  },

  // Impact Analysis
  getImpactAnalysis: async (clientId, systemId) => {
    const response = await get(`/categorization/${systemId}/impact-analysis`);
    return response.impactAnalysis;
  },

  updateImpactAnalysis: async (clientId, systemId, data) => {
    const response = await put(`/categorization/${systemId}/impact-analysis`, data);
    return response.impactAnalysis;
  },

  // Security Objectives
  getSecurityObjectives: async (clientId, systemId) => {
    const response = await get(`/categorization/${systemId}/security-objectives`);
    return response.securityObjectives;
  },

  updateSecurityObjectives: async (clientId, systemId, data) => {
    const response = await put(`/categorization/${systemId}/security-objectives`, data);
    return response.securityObjectives;
  },

  // Progress tracking
  getProgress: async (clientId, systemId) => {
    const response = await get(`/categorization/${systemId}/progress`);
    return response.progress;
  }
};

export default systemCategorizationApi;