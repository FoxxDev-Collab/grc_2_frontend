import { validateRequired, checkExists } from '../../utils/apiHelpers';

const API_URL = 'http://localhost:3001';

const initialAssessmentApi = {
  // Get initial assessment data
  getInitialAssessment: async (clientId, systemId) => {
    validateRequired({ clientId, systemId }, ['clientId', 'systemId']);
    
    const response = await fetch(`${API_URL}/systems/${systemId}?clientId=${clientId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch system data');
    }
    
    const system = await response.json();
    checkExists(system, 'System');
    
    return { 
      ...system.phases.initialAssessment,
      lastUpdated: system.updatedAt
    };
  },

  // Update system discovery
  updateSystemDiscovery: async (clientId, systemId, discoveryData) => {
    validateRequired({ 
      clientId, 
      systemId,
      ...discoveryData
    }, [
      'clientId',
      'systemId',
      'description',
      'purpose',
      'informationLevel',
    ]);

    const response = await fetch(`${API_URL}/systems/${systemId}`, {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch system data');
    }
    
    const system = await response.json();
    checkExists(system, 'System');

    const updatedSystem = {
      ...system,
      phases: {
        ...system.phases,
        initialAssessment: {
          ...system.phases.initialAssessment,
          discovery: {
            ...discoveryData,
            status: 'completed',
            updatedAt: new Date().toISOString()
          }
        }
      }
    };

    const updateResponse = await fetch(`${API_URL}/systems/${systemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedSystem)
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update system discovery');
    }

    const result = await updateResponse.json();
    return {
      success: true,
      data: result.phases.initialAssessment.discovery
    };
  },

  // Update environment analysis
  updateEnvironmentAnalysis: async (clientId, systemId, environmentData) => {
    validateRequired({ 
      clientId, 
      systemId,
      ...environmentData
    }, [
      'clientId',
      'systemId',
      'hosting',
      'components',
      'networkArchitecture',
      'dependencies',
      'interfaces'
    ]);

    const response = await fetch(`${API_URL}/systems/${systemId}`, {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch system data');
    }
    
    const system = await response.json();
    checkExists(system, 'System');

    const updatedSystem = {
      ...system,
      phases: {
        ...system.phases,
        initialAssessment: {
          ...system.phases.initialAssessment,
          environment: {
            ...environmentData,
            status: 'completed',
            updatedAt: new Date().toISOString()
          }
        }
      }
    };

    const updateResponse = await fetch(`${API_URL}/systems/${systemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedSystem)
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update environment analysis');
    }

    const result = await updateResponse.json();
    return {
      success: true,
      data: result.phases.initialAssessment.environment
    };
  },

  // Update network boundary
  updateNetworkBoundary: async (clientId, systemId, boundaryData) => {
    validateRequired({ 
      clientId, 
      systemId,
      ...boundaryData
    }, [
      'clientId',
      'systemId',
      'description',
      'ports',
      'protocols',
      'procedures'
    ]);

    const response = await fetch(`${API_URL}/systems/${systemId}`, {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch system data');
    }
    
    const system = await response.json();
    checkExists(system, 'System');

    const updatedSystem = {
      ...system,
      phases: {
        ...system.phases,
        initialAssessment: {
          ...system.phases.initialAssessment,
          boundary: {
            ...boundaryData,
            status: 'completed',
            updatedAt: new Date().toISOString()
          }
        }
      }
    };

    const updateResponse = await fetch(`${API_URL}/systems/${systemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedSystem)
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update network boundary');
    }

    const result = await updateResponse.json();
    return {
      success: true,
      data: result.phases.initialAssessment.boundary
    };
  },

  // Update stakeholders
  updateStakeholders: async (clientId, systemId, stakeholderData) => {
    validateRequired({ 
      clientId, 
      systemId,
      ...stakeholderData
    }, [
      'clientId',
      'systemId',
      'owners',
      'operators',
      'responsibilities',
      'contacts',
      'communicationChannels'
    ]);

    const response = await fetch(`${API_URL}/systems/${systemId}`, {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch system data');
    }
    
    const system = await response.json();
    checkExists(system, 'System');

    const updatedSystem = {
      ...system,
      phases: {
        ...system.phases,
        initialAssessment: {
          ...system.phases.initialAssessment,
          stakeholders: {
            ...stakeholderData,
            status: 'completed',
            updatedAt: new Date().toISOString()
          }
        }
      }
    };

    const updateResponse = await fetch(`${API_URL}/systems/${systemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedSystem)
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update stakeholders');
    }

    const result = await updateResponse.json();
    return {
      success: true,
      data: result.phases.initialAssessment.stakeholders
    };
  },

  // Get initial assessment progress
  getProgress: async (clientId, systemId) => {
    validateRequired({ clientId, systemId }, ['clientId', 'systemId']);
    
    const response = await fetch(`${API_URL}/systems/${systemId}?clientId=${clientId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch system data');
    }
    
    const system = await response.json();
    checkExists(system, 'System');

    const sections = [
      system.phases.initialAssessment?.discovery?.status,
      system.phases.initialAssessment?.environment?.status,
      system.phases.initialAssessment?.boundary?.status,
      system.phases.initialAssessment?.stakeholders?.status
    ];

    const completedSections = sections.filter(status => status === 'completed').length;
    const progress = Math.round((completedSections / sections.length) * 100);

    return {
      progress,
      sections: {
        discovery: system.phases.initialAssessment?.discovery?.status || 'not_started',
        environment: system.phases.initialAssessment?.environment?.status || 'not_started',
        boundary: system.phases.initialAssessment?.boundary?.status || 'not_started',
        stakeholders: system.phases.initialAssessment?.stakeholders?.status || 'not_started'
      }
    };
  }
};

export default initialAssessmentApi;