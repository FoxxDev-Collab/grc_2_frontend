import { handleApiResponse, handleApiError } from '../apiHelpers';
import {
  mockSecurityControls,
  mockControlStats,
  mockControlFamilies,
} from '../mocks/securityControlsMockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IS_DEVELOPMENT = import.meta.env.DEV;

export const systemControlsApi = {
  // Get controls for a system with filtering options
  getControls: async (systemId, filters = {}) => {
    if (IS_DEVELOPMENT) {
      let controls = Object.values(mockSecurityControls).flat();
      
      // Filter by family if specified
      if (filters.family) {
        controls = controls.filter(control => control.family.startsWith(filters.family));
      }

      // Filter by impact level
      if (filters.impactLevel) {
        switch (filters.impactLevel) {
          case 'LOW':
            controls = controls.filter(control => control.baselineImpact === 'LOW');
            break;
          case 'MODERATE':
            controls = controls.filter(control => 
              ['LOW', 'MODERATE'].includes(control.baselineImpact)
            );
            break;
          case 'HIGH':
            controls = controls.filter(control => 
              ['LOW', 'MODERATE', 'HIGH'].includes(control.baselineImpact)
            );
            break;
        }
      }

      return controls;
    }

    try {
      const queryParams = new URLSearchParams();
      if (filters.family) queryParams.append('family', filters.family);
      if (filters.impactLevel) queryParams.append('impactLevel', filters.impactLevel);

      const response = await fetch(
        `${BASE_URL}/api/systems/${systemId}/controls?${queryParams}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create a new control
  createControl: async (systemId, controlData) => {
    if (IS_DEVELOPMENT) {
      return { ...controlData, id: Date.now().toString() };
    }

    try {
      const response = await fetch(`${BASE_URL}/api/systems/${systemId}/controls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(controlData),
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update a control
  updateControl: async (systemId, controlId, controlData) => {
    if (IS_DEVELOPMENT) {
      return { ...controlData, id: controlId };
    }

    try {
      const response = await fetch(`${BASE_URL}/api/systems/${systemId}/controls/${controlId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(controlData),
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update control implementation status
  updateControlStatus: async (systemId, controlId, status) => {
    if (IS_DEVELOPMENT) {
      return { id: controlId, status };
    }

    try {
      const response = await fetch(`${BASE_URL}/api/systems/${systemId}/controls/${controlId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get control families
  getControlFamilies: async (systemId) => {
    if (IS_DEVELOPMENT) {
      return mockControlFamilies;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/systems/${systemId}/controls/families`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Add evidence to a control
  addControlEvidence: async (systemId, controlId, evidence) => {
    if (IS_DEVELOPMENT) {
      return {
        id: Date.now().toString(),
        title: evidence.get('evidence').name,
        dateAdded: new Date().toISOString(),
      };
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/systems/${systemId}/controls/${controlId}/evidence`,
        {
          method: 'POST',
          body: evidence,
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete evidence from a control
  deleteControlEvidence: async (systemId, controlId, evidenceId) => {
    if (IS_DEVELOPMENT) {
      return { success: true };
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/systems/${systemId}/controls/${controlId}/evidence/${evidenceId}`,
        {
          method: 'DELETE',
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get control implementation statistics
  getControlStats: async (systemId) => {
    if (IS_DEVELOPMENT) {
      return mockControlStats;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/systems/${systemId}/controls/stats`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default systemControlsApi;