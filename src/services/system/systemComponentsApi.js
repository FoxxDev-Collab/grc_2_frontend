import { delay, validateRequired, checkExists, ApiError } from '../apiHelpers';
import {
  mockComponents,
  mockComponentTypes,
  mockComponentStatuses,
  generateMockId
} from '../mocks/systemComponentsMockData';

// Mutable copy of mock data for CRUD operations
let components = [...mockComponents];

export const systemComponentsApi = {
  // Get component types
  getComponentTypes: async () => {
    await delay(300);
    return [...mockComponentTypes];
  },
  
  // Get component statuses
  getComponentStatuses: async () => {
    await delay(300);
    return [...mockComponentStatuses];
  },

  // Get all components
  getComponents: async () => {
    await delay(500);
    return [...components];
  },

  // Get component by ID
  getComponent: async (id) => {
    await delay(300);
    const numericId = Number(id);
    const component = components.find(c => c.id === numericId);
    checkExists(component, 'Component');
    return { ...component };
  },

  // Create new component
  createComponent: async (componentData) => {
    await delay(500);
    validateRequired(componentData, ['name', 'type', 'description']);

    if (!mockComponentTypes.includes(componentData.type)) {
      throw new ApiError('Invalid component type', 400);
    }

    const newComponent = {
      id: generateMockId(),
      lastUpdated: new Date().toISOString(),
      status: 'ACTIVE',
      ...componentData
    };
    
    components.push(newComponent);
    return { ...newComponent };
  },

  // Update component
  updateComponent: async (id, updateData) => {
    await delay(500);
    const numericId = Number(id);
    const index = components.findIndex(c => c.id === numericId);
    checkExists(components[index], 'Component');

    if (updateData.type && !mockComponentTypes.includes(updateData.type)) {
      throw new ApiError('Invalid component type', 400);
    }

    if (updateData.status && !mockComponentStatuses.includes(updateData.status)) {
      throw new ApiError('Invalid component status', 400);
    }

    const updatedComponent = {
      ...components[index],
      ...updateData,
      lastUpdated: new Date().toISOString()
    };

    components[index] = updatedComponent;
    return { ...updatedComponent };
  },

  // Delete component
  deleteComponent: async (id) => {
    await delay(500);
    const numericId = Number(id);
    const index = components.findIndex(c => c.id === numericId);
    checkExists(components[index], 'Component');

    components = components.filter(c => c.id !== numericId);
    return { success: true, message: 'Component deleted successfully' };
  }
};

export default systemComponentsApi;