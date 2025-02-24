/* eslint-disable no-unused-vars */
import { get, put } from '../apiHelpers';

const atoTrackerApi = {
  // Get ATO process data for a system
  getATOProcess: async (clientId, systemId) => {
    // Get the process steps template
    const processSteps = await get('/ato/process-steps');
    
    try {
      // Try to get existing tracker data for the system
      const trackerData = await get(`/ato/tracker/${systemId}`);
      return trackerData;
    } catch (error) {
      // If no tracker data exists, initialize it from process steps
      const initialData = {
        phases: processSteps.processSteps.map(phase => ({
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

      // Create new tracker data for the system
      return put(`/ato/tracker/${systemId}`, initialData);
    }
  },

  // Update task status
  updateTaskStatus: async (clientId, systemId, phaseId, sectionTitle, taskIndex, completed) => {
    // Get current tracker data
    const trackerData = await get(`/ato/tracker/${systemId}`);
    
    // Find and update the task
    const phase = trackerData.phases.find(p => p.id === phaseId);
    if (phase) {
      const section = phase.sections.find(s => s.title === sectionTitle);
      if (section && section.tasks[taskIndex]) {
        section.tasks[taskIndex].completed = completed;
        
        // Calculate and update phase progress
        const totalTasks = phase.sections.reduce((sum, s) => sum + s.tasks.length, 0);
        const completedTasks = phase.sections.reduce((sum, s) => 
          sum + s.tasks.filter(t => t.completed).length, 0);
        phase.progress = Math.round((completedTasks / totalTasks) * 100);
      }
    }

    // Update the tracker data
    return put(`/ato/tracker/${systemId}`, trackerData);
  },

  // Get phase progress
  getPhaseProgress: async (clientId, systemId, phaseId) => {
    const trackerData = await get(`/ato/tracker/${systemId}`);
    const phase = trackerData.phases.find(p => p.id === phaseId);
    return {
      value: phase ? phase.progress : 0
    };
  },

  // Reset process data (useful for testing)
  resetProcessData: async () => {
    // Get the process steps template
    const processSteps = await get('/ato/process-steps');
    
    // Initialize empty tracker data
    const initialData = {
      phases: processSteps.processSteps.map(phase => ({
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

    // Reset tracker data for the system
    return put('/ato/tracker/sys-001', initialData);
  }
};

export default atoTrackerApi;