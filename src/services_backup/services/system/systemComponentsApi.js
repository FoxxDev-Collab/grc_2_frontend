import { ApiError } from '../apiHelpers';

const API_URL = 'http://localhost:3001';

export const systemComponentsApi = {
  // Get component types
  getComponentTypes: async () => {
    const response = await fetch(`${API_URL}/system-component-types`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch component types', response.status);
    }
    const data = await response.json();
    return data.componentTypes.map(type => type.name);
  },
  
  // Get component statuses
  getComponentStatuses: async () => {
    const response = await fetch(`${API_URL}/system-component-statuses`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch component statuses', response.status);
    }
    const data = await response.json();
    return data.componentStatuses.map(status => status.name);
  },

  // Get all components
  getComponents: async () => {
    const response = await fetch(`${API_URL}/system-components`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch components', response.status);
    }
    return await response.json();
  },

  // Get component by ID
  getComponent: async (id) => {
    const response = await fetch(`${API_URL}/system-components/${id}`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch component', response.status);
    }
    return await response.json();
  },

  // Create new component
  createComponent: async (componentData) => {
    const newComponent = {
      ...componentData,
      lastUpdated: new Date().toISOString(),
      status: componentData.status || 'ACTIVE'
    };
    
    const response = await fetch(`${API_URL}/system-components`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newComponent),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to create component', response.status);
    }
    
    return await response.json();
  },

  // Update component
  updateComponent: async (id, updateData) => {
    const updatedComponent = {
      ...updateData,
      lastUpdated: new Date().toISOString()
    };

    const response = await fetch(`${API_URL}/system-components/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedComponent),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to update component', response.status);
    }
    
    return await response.json();
  },

  // Delete component
  deleteComponent: async (id) => {
    const response = await fetch(`${API_URL}/system-components/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to delete component', response.status);
    }
    
    return { success: true, message: 'Component deleted successfully' };
  }
};

export default systemComponentsApi;