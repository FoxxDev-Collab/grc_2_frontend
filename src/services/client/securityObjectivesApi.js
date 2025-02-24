import { delay, validateRequired, checkExists } from '../apiHelpers';
import {
  mockObjectives,
  mockObjectiveStatus,
  mockPriorityLevels
} from '../mocks/securityObjectivesMockData';

// In-memory storage
let objectives = [...mockObjectives];

const securityObjectivesApi = {
  // Get all objectives for a client
  getObjectives: async (clientId) => {
    await delay(500);
    const numericClientId = Number(clientId);
    return objectives
      .filter(obj => obj.clientId === numericClientId)
      .map(obj => ({ ...obj }));
  },

  // Get single objective
  getObjective: async (clientId, objectiveId) => {
    await delay(300);
    const numericClientId = Number(clientId);
    const numericObjectiveId = Number(objectiveId);
    const objective = objectives.find(
      obj => obj.clientId === numericClientId && obj.id === numericObjectiveId
    );
    checkExists(objective, 'Security Objective');
    return { ...objective };
  },

  // Create new objective
  createObjective: async (clientId, objectiveData) => {
    await delay(500);
    validateRequired(objectiveData, ['name', 'priority', 'dueDate']);

    if (!mockPriorityLevels.includes(objectiveData.priority)) {
      throw new Error('Invalid priority level');
    }

    if (!objectiveData.status) {
      objectiveData.status = 'Planning';
    } else if (!mockObjectiveStatus.includes(objectiveData.status)) {
      throw new Error('Invalid status');
    }

    const newObjective = {
      id: Math.max(0, ...objectives.map(obj => obj.id)) + 1,
      clientId: Number(clientId),
      progress: 0,
      metrics: {
        successCriteria: [],
        currentMetrics: []
      },
      ...objectiveData
    };

    objectives.push(newObjective);
    return { ...newObjective };
  },

  // Update objective
  updateObjective: async (clientId, objectiveId, updates) => {
    await delay(500);
    const numericClientId = Number(clientId);
    const numericObjectiveId = Number(objectiveId);
    const index = objectives.findIndex(
      obj => obj.clientId === numericClientId && obj.id === numericObjectiveId
    );
    checkExists(objectives[index], 'Security Objective');

    if (updates.priority && !mockPriorityLevels.includes(updates.priority)) {
      throw new Error('Invalid priority level');
    }

    if (updates.status && !mockObjectiveStatus.includes(updates.status)) {
      throw new Error('Invalid status');
    }

    objectives[index] = {
      ...objectives[index],
      ...updates
    };

    return { ...objectives[index] };
  },

  // Delete objective
  deleteObjective: async (clientId, objectiveId) => {
    await delay(500);
    const numericClientId = Number(clientId);
    const numericObjectiveId = Number(objectiveId);
    const index = objectives.findIndex(
      obj => obj.clientId === numericClientId && obj.id === numericObjectiveId
    );
    checkExists(objectives[index], 'Security Objective');

    objectives = objectives.filter(obj => !(obj.clientId === numericClientId && obj.id === numericObjectiveId));
    return { success: true, message: 'Security objective deleted successfully' };
  },

  // Update objective metrics
  updateObjectiveMetrics: async (clientId, objectiveId, metrics) => {
    await delay(300);
    const numericClientId = Number(clientId);
    const numericObjectiveId = Number(objectiveId);
    const index = objectives.findIndex(
      obj => obj.clientId === numericClientId && obj.id === numericObjectiveId
    );
    checkExists(objectives[index], 'Security Objective');

    validateRequired(metrics, ['successCriteria', 'currentMetrics']);

    objectives[index].metrics = {
      ...objectives[index].metrics,
      ...metrics
    };

    return { ...objectives[index] };
  },

  // Get objective statuses
  getObjectiveStatuses: async () => {
    await delay(200);
    return [...mockObjectiveStatus];
  },

  // Get priority levels
  getPriorityLevels: async () => {
    await delay(200);
    return [...mockPriorityLevels];
  }
};

export default securityObjectivesApi;