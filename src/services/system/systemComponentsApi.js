import { get, post, put, del } from '../apiHelpers';

export const systemComponentsApi = {
  // Get component types
  getComponentTypes: async () => {
    const response = await get('/system-component-types');
    return response.componentTypes.map(type => type.name);
  },
  
  // Get component statuses
  getComponentStatuses: async () => {
    const response = await get('/system-component-statuses');
    return response.componentStatuses.map(status => status.name);
  },

  // Get all components
  getComponents: async () => {
    return get('/system-components');
  },

  // Get component by ID
  getComponent: async (id) => {
    return get(`/system-components/${id}`);
  },

  // Create new component
  createComponent: async (componentData) => {
    const newComponent = {
      ...componentData,
      lastUpdated: new Date().toISOString(),
      status: componentData.status || 'ACTIVE'
    };
    
    return post('/system-components', newComponent);
  },

  // Update component
  updateComponent: async (id, updateData) => {
    const updatedComponent = {
      ...updateData,
      lastUpdated: new Date().toISOString()
    };

    return put(`/system-components/${id}`, updatedComponent);
  },

  // Delete component
  deleteComponent: async (id) => {
    await del(`/system-components/${id}`);
    return { success: true, message: 'Component deleted successfully' };
  }
};

export default systemComponentsApi;