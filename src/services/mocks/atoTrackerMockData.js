import { processSteps } from '../../pages/system/atoProcessData';

// Initialize mock data from process steps
const initializeProcessData = () => {
  return {
    phases: processSteps.map(phase => ({
      ...phase,
      progress: 0,
      sections: phase.sections.map(section => ({
        ...section,
        tasks: section.tasks.map(task => ({
          description: task,
          completed: false
        }))
      }))
    }))
  };
};

// Mock data store
let mockProcessData = {};

// Helper to get or initialize process data for a system
const getSystemProcessData = (systemId) => {
  if (!mockProcessData[systemId]) {
    mockProcessData[systemId] = initializeProcessData();
  }
  return mockProcessData[systemId];
};

// Helper to calculate phase progress
const calculatePhaseProgress = (phase) => {
  let totalTasks = 0;
  let completedTasks = 0;

  phase.sections.forEach(section => {
    section.tasks.forEach(task => {
      totalTasks++;
      if (task.completed) {
        completedTasks++;
      }
    });
  });

  return Math.round((completedTasks / totalTasks) * 100);
};

// Helper to update phase progress
const updatePhaseProgress = (phase) => {
  return {
    ...phase,
    progress: calculatePhaseProgress(phase)
  };
};

export const atoTrackerMockData = {
  getProcessData: (systemId) => {
    return getSystemProcessData(systemId);
  },

  updateTaskStatus: (systemId, phaseId, sectionTitle, taskIndex, completed) => {
    const data = getSystemProcessData(systemId);
    
    // Find and update the task
    const phase = data.phases.find(p => p.id === phaseId);
    if (phase) {
      const section = phase.sections.find(s => s.title === sectionTitle);
      if (section && section.tasks[taskIndex]) {
        section.tasks[taskIndex].completed = completed;
        
        // Update phase progress
        const updatedPhase = updatePhaseProgress(phase);
        data.phases = data.phases.map(p => 
          p.id === phaseId ? updatedPhase : p
        );
      }
    }

    return data;
  },

  getPhaseProgress: (systemId, phaseId) => {
    const data = getSystemProcessData(systemId);
    const phase = data.phases.find(p => p.id === phaseId);
    return {
      value: phase ? phase.progress : 0
    };
  },

  // Reset mock data (useful for testing)
  resetMockData: () => {
    mockProcessData = {};
  }
};