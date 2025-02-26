/* eslint-disable no-unused-vars */
import { ApiError } from '../../api/BaseApiService';

const API_URL = 'http://localhost:3001';

const atoTrackerApi = {
  // Get ATO process data for a system
  getATOProcess: async (clientId, systemId) => {
    // Get the process steps template
    const processStepsResponse = await fetch(`${API_URL}/ato/process-steps`);
    if (!processStepsResponse.ok) {
      throw new ApiError('Failed to fetch process steps', processStepsResponse.status);
    }
    const processSteps = await processStepsResponse.json();
    
    try {
      // Try to get existing tracker data for the system
      const trackerResponse = await fetch(`${API_URL}/ato/tracker/${systemId}`);
      if (!trackerResponse.ok) {
        throw new ApiError('Tracker data not found', trackerResponse.status);
      }
      return await trackerResponse.json();
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
      const createResponse = await fetch(`${API_URL}/ato/tracker/${systemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initialData),
      });
      
      if (!createResponse.ok) {
        throw new ApiError('Failed to create tracker data', createResponse.status);
      }
      
      return await createResponse.json();
    }
  },

  // Update task status
  updateTaskStatus: async (clientId, systemId, phaseId, sectionTitle, taskIndex, completed) => {
    // Get current tracker data
    const trackerResponse = await fetch(`${API_URL}/ato/tracker/${systemId}`);
    if (!trackerResponse.ok) {
      throw new ApiError('Failed to fetch tracker data', trackerResponse.status);
    }
    const trackerData = await trackerResponse.json();
    
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
    const updateResponse = await fetch(`${API_URL}/ato/tracker/${systemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackerData),
    });
    
    if (!updateResponse.ok) {
      throw new ApiError('Failed to update tracker data', updateResponse.status);
    }
    
    return await updateResponse.json();
  },

  // Get phase progress
  getPhaseProgress: async (clientId, systemId, phaseId) => {
    const trackerResponse = await fetch(`${API_URL}/ato/tracker/${systemId}`);
    if (!trackerResponse.ok) {
      throw new ApiError('Failed to fetch tracker data', trackerResponse.status);
    }
    const trackerData = await trackerResponse.json();
    const phase = trackerData.phases.find(p => p.id === phaseId);
    return {
      value: phase ? phase.progress : 0
    };
  },

  // Reset process data (useful for testing)
  resetProcessData: async () => {
    // Get the process steps template
    const processStepsResponse = await fetch(`${API_URL}/ato/process-steps`);
    if (!processStepsResponse.ok) {
      throw new ApiError('Failed to fetch process steps', processStepsResponse.status);
    }
    const processSteps = await processStepsResponse.json();
    
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
    const resetResponse = await fetch(`${API_URL}/ato/tracker/sys-001`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(initialData),
    });
    
    if (!resetResponse.ok) {
      throw new ApiError('Failed to reset tracker data', resetResponse.status);
    }
    
    return await resetResponse.json();
  }
};

export default atoTrackerApi;