import { get, post, put, del } from '../apiHelpers';

export const systemControlsApi = {
  // Get controls with filtering options
  getControls: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.family) queryParams.append('family', filters.family);
    if (filters.impactLevel) queryParams.append('impactLevel', filters.impactLevel);

    let endpoint = '/security-controls';
    if (filters.type) {
      endpoint = `/security-controls/${filters.type.toLowerCase()}`;
    }

    const controls = await get(`${endpoint}?${queryParams}`);
    return controls;
  },

  // Create a new control
  createControl: async (controlData) => {
    return post('/security-controls', controlData);
  },

  // Update a control
  updateControl: async (controlId, controlData) => {
    return put(`/security-controls/${controlId}`, controlData);
  },

  // Update control implementation status
  updateControlStatus: async (controlId, status) => {
    return put(`/security-controls/${controlId}/status`, { status });
  },

  // Get control families
  getControlFamilies: async () => {
    const response = await get('/security-control-families');
    return response.families;
  },

  // Add evidence to a control
  addControlEvidence: async (controlId, evidence) => {
    // If evidence is a FormData object (file upload)
    if (evidence instanceof FormData) {
      const formData = new FormData();
      formData.append('evidence', evidence.get('evidence'));
      return post(`/security-controls/${controlId}/evidence`, formData);
    }
    // If evidence is JSON data
    return post(`/security-controls/${controlId}/evidence`, evidence);
  },

  // Delete evidence from a control
  deleteControlEvidence: async (controlId, evidenceId) => {
    return del(`/security-controls/${controlId}/evidence/${evidenceId}`);
  },

  // Get control implementation statistics
  getControlStats: async () => {
    return get('/security-control-stats');
  }
};

export default systemControlsApi;