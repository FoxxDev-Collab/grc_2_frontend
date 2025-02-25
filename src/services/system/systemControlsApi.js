import { validateRequired, ApiError } from '../apiHelpers';

const API_URL = 'http://localhost:3001';

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

    const response = await fetch(`${API_URL}${endpoint}?${queryParams}`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch controls', response.status);
    }
    return await response.json();
  },

  // Create a new control
  createControl: async (controlData) => {
    validateRequired(controlData, ['name', 'family', 'description']);
    
    const response = await fetch(`${API_URL}/security-controls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(controlData),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to create control', response.status);
    }
    
    return await response.json();
  },

  // Update a control
  updateControl: async (controlId, controlData) => {
    const response = await fetch(`${API_URL}/security-controls/${controlId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(controlData),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to update control', response.status);
    }
    
    return await response.json();
  },

  // Update control implementation status
  updateControlStatus: async (controlId, status) => {
    const response = await fetch(`${API_URL}/security-controls/${controlId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to update control status', response.status);
    }
    
    return await response.json();
  },

  // Get control families
  getControlFamilies: async () => {
    const response = await fetch(`${API_URL}/security-control-families`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch control families', response.status);
    }
    const data = await response.json();
    return data.families;
  },

  // Add evidence to a control
  addControlEvidence: async (controlId, evidence) => {
    // If evidence is a FormData object (file upload)
    if (evidence instanceof FormData) {
      const formData = new FormData();
      formData.append('evidence', evidence.get('evidence'));
      
      const response = await fetch(`${API_URL}/security-controls/${controlId}/evidence`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new ApiError('Failed to add control evidence', response.status);
      }
      
      return await response.json();
    }
    
    // If evidence is JSON data
    const response = await fetch(`${API_URL}/security-controls/${controlId}/evidence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evidence),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to add control evidence', response.status);
    }
    
    return await response.json();
  },

  // Delete evidence from a control
  deleteControlEvidence: async (controlId, evidenceId) => {
    const response = await fetch(`${API_URL}/security-controls/${controlId}/evidence/${evidenceId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to delete control evidence', response.status);
    }
    
    return await response.json();
  },

  // Get control implementation statistics
  getControlStats: async () => {
    const response = await fetch(`${API_URL}/security-control-stats`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch control stats', response.status);
    }
    return await response.json();
  }
};

export default systemControlsApi;