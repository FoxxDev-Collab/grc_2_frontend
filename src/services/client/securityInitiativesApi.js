import { delay, validateRequired, checkExists } from '../apiHelpers';
import {
  mockInitiatives,
  mockInitiativeStatus,
  mockPhases
} from '../mocks/securityInitiativesMockData';

// In-memory storage
let initiatives = [...mockInitiatives];

const securityInitiativesApi = {
  // Get all initiatives for a client
  getInitiatives: async (clientId) => {
    await delay(500);
    const numericClientId = Number(clientId);
    return initiatives
      .filter(init => init.clientId === numericClientId)
      .map(init => ({ ...init }));
  },

  // Get initiatives by objective
  getInitiativesByObjective: async (clientId, objectiveId) => {
    await delay(300);
    const numericClientId = Number(clientId);
    const numericObjectiveId = Number(objectiveId);
    return initiatives
      .filter(init => init.clientId === numericClientId && init.objectiveId === numericObjectiveId)
      .map(init => ({ ...init }));
  },

  // Get single initiative
  getInitiative: async (clientId, initiativeId) => {
    await delay(300);
    const numericClientId = Number(clientId);
    const numericInitiativeId = Number(initiativeId);
    const initiative = initiatives.find(
      init => init.clientId === numericClientId && init.id === numericInitiativeId
    );
    checkExists(initiative, 'Security Initiative');
    return { ...initiative };
  },

  // Create new initiative
  createInitiative: async (clientId, initiativeData) => {
    await delay(500);
    validateRequired(initiativeData, ['name', 'phase', 'timeline', 'objectiveId']);

    if (!mockPhases.includes(initiativeData.phase)) {
      throw new Error('Invalid phase');
    }

    if (!initiativeData.status) {
      initiativeData.status = 'Planning';
    } else if (!mockInitiativeStatus.includes(initiativeData.status)) {
      throw new Error('Invalid status');
    }

    const newInitiative = {
      id: Math.max(0, ...initiatives.map(init => init.id)) + 1,
      clientId: Number(clientId),
      objectiveId: Number(initiativeData.objectiveId),
      milestones: [],
      resources: {
        team: [],
        budget: '0',
        tools: []
      },
      ...initiativeData
    };

    initiatives.push(newInitiative);
    return { ...newInitiative };
  },

  // Update initiative
  updateInitiative: async (clientId, initiativeId, updates) => {
    await delay(500);
    const numericClientId = Number(clientId);
    const numericInitiativeId = Number(initiativeId);
    const index = initiatives.findIndex(
      init => init.clientId === numericClientId && init.id === numericInitiativeId
    );
    checkExists(initiatives[index], 'Security Initiative');

    if (updates.phase && !mockPhases.includes(updates.phase)) {
      throw new Error('Invalid phase');
    }

    if (updates.status && !mockInitiativeStatus.includes(updates.status)) {
      throw new Error('Invalid status');
    }

    // Convert objectiveId if it's being updated
    if (updates.objectiveId) {
      updates.objectiveId = Number(updates.objectiveId);
    }

    initiatives[index] = {
      ...initiatives[index],
      ...updates
    };

    return { ...initiatives[index] };
  },

  // Delete initiative
  deleteInitiative: async (clientId, initiativeId) => {
    await delay(500);
    const numericClientId = Number(clientId);
    const numericInitiativeId = Number(initiativeId);
    const index = initiatives.findIndex(
      init => init.clientId === numericClientId && init.id === numericInitiativeId
    );
    checkExists(initiatives[index], 'Security Initiative');

    initiatives = initiatives.filter(init => !(init.clientId === numericClientId && init.id === numericInitiativeId));
    return { success: true, message: 'Security initiative deleted successfully' };
  },

  // Add milestone
  addMilestone: async (clientId, initiativeId, milestoneData) => {
    await delay(300);
    const numericClientId = Number(clientId);
    const numericInitiativeId = Number(initiativeId);
    const index = initiatives.findIndex(
      init => init.clientId === numericClientId && init.id === numericInitiativeId
    );
    checkExists(initiatives[index], 'Security Initiative');

    validateRequired(milestoneData, ['name']);

    const newMilestone = {
      id: Math.max(0, ...initiatives[index].milestones.map(m => m.id)) + 1,
      completed: false,
      ...milestoneData
    };

    initiatives[index].milestones.push(newMilestone);
    return { ...newMilestone };
  },

  // Update milestone
  updateMilestone: async (clientId, initiativeId, milestoneId, updates) => {
    await delay(300);
    const numericClientId = Number(clientId);
    const numericInitiativeId = Number(initiativeId);
    const numericMilestoneId = Number(milestoneId);
    const initiativeIndex = initiatives.findIndex(
      init => init.clientId === numericClientId && init.id === numericInitiativeId
    );
    checkExists(initiatives[initiativeIndex], 'Security Initiative');

    const milestoneIndex = initiatives[initiativeIndex].milestones.findIndex(
      m => m.id === numericMilestoneId
    );
    checkExists(initiatives[initiativeIndex].milestones[milestoneIndex], 'Milestone');

    initiatives[initiativeIndex].milestones[milestoneIndex] = {
      ...initiatives[initiativeIndex].milestones[milestoneIndex],
      ...updates
    };

    return { ...initiatives[initiativeIndex].milestones[milestoneIndex] };
  },

  // Delete milestone
  deleteMilestone: async (clientId, initiativeId, milestoneId) => {
    await delay(300);
    const numericClientId = Number(clientId);
    const numericInitiativeId = Number(initiativeId);
    const numericMilestoneId = Number(milestoneId);
    const initiativeIndex = initiatives.findIndex(
      init => init.clientId === numericClientId && init.id === numericInitiativeId
    );
    checkExists(initiatives[initiativeIndex], 'Security Initiative');

    const milestoneIndex = initiatives[initiativeIndex].milestones.findIndex(
      m => m.id === numericMilestoneId
    );
    checkExists(initiatives[initiativeIndex].milestones[milestoneIndex], 'Milestone');

    initiatives[initiativeIndex].milestones = initiatives[initiativeIndex].milestones.filter(
      m => m.id !== numericMilestoneId
    );

    return { success: true, message: 'Milestone deleted successfully' };
  },

  // Update resources
  updateResources: async (clientId, initiativeId, resources) => {
    await delay(300);
    const numericClientId = Number(clientId);
    const numericInitiativeId = Number(initiativeId);
    const index = initiatives.findIndex(
      init => init.clientId === numericClientId && init.id === numericInitiativeId
    );
    checkExists(initiatives[index], 'Security Initiative');

    validateRequired(resources, ['team', 'budget', 'tools']);

    initiatives[index].resources = {
      ...initiatives[index].resources,
      ...resources
    };

    return { ...initiatives[index] };
  },

  // Get initiative statuses
  getInitiativeStatuses: async () => {
    await delay(200);
    return [...mockInitiativeStatus];
  },

  // Get phases
  getPhases: async () => {
    await delay(200);
    return [...mockPhases];
  }
};

export default securityInitiativesApi;