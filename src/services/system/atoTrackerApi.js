import { delay } from '../apiHelpers';
import { atoTrackerMockData } from '../mocks/atoTrackerMockData';

const atoTrackerApi = {
  // Get ATO process data for a system
  getATOProcess: async (clientId, systemId) => {
    await delay(500); // Simulate API delay
    return atoTrackerMockData.getProcessData(systemId);
  },

  // Update task status
  updateTaskStatus: async (clientId, systemId, phaseId, sectionTitle, taskIndex, completed) => {
    await delay(300); // Simulate API delay
    return atoTrackerMockData.updateTaskStatus(systemId, phaseId, sectionTitle, taskIndex, completed);
  },

  // Get phase progress
  getPhaseProgress: async (clientId, systemId, phaseId) => {
    await delay(200); // Simulate API delay
    return atoTrackerMockData.getPhaseProgress(systemId, phaseId);
  },

  // Reset process data (useful for testing)
  resetProcessData: async () => {
    await delay(200);
    atoTrackerMockData.resetMockData();
  }
};

export default atoTrackerApi;