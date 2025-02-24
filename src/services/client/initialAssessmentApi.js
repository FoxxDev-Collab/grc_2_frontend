import { delay, validateRequired, checkExists } from '../apiHelpers';
import { mockSystems } from '../mocks/systemMockData';

// In-memory storage for CRUD operations
let systems = [...mockSystems];

const initialAssessmentApi = {
  // Get initial assessment data
  getInitialAssessment: async (clientId, systemId) => {
    await delay(300);
    validateRequired({ clientId, systemId }, ['clientId', 'systemId']);
    
    const numericClientId = Number(clientId);
    const system = systems.find(s => 
      s.clientId === numericClientId && 
      s.id === systemId
    );
    
    checkExists(system, 'System');
    return { 
      ...system.phases.initialAssessment,
      lastUpdated: system.updatedAt
    };
  },

  // Update system discovery
  updateSystemDiscovery: async (clientId, systemId, discoveryData) => {
    await delay(500);
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

    const numericClientId = Number(clientId);
    const index = systems.findIndex(s => 
      s.clientId === numericClientId && 
      s.id === systemId
    );
    
    checkExists(systems[index], 'System');

    systems[index] = {
      ...systems[index],
      phases: {
        ...systems[index].phases,
        initialAssessment: {
          ...systems[index].phases.initialAssessment,
          discovery: {
            ...discoveryData,
            status: 'completed',
            updatedAt: new Date().toISOString()
          }
        }
      }
    };

    return {
      success: true,
      data: systems[index].phases.initialAssessment.discovery
    };
  },

  // Update environment analysis
  updateEnvironmentAnalysis: async (clientId, systemId, environmentData) => {
    await delay(500);
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

    const numericClientId = Number(clientId);
    const index = systems.findIndex(s => 
      s.clientId === numericClientId && 
      s.id === systemId
    );
    
    checkExists(systems[index], 'System');

    systems[index] = {
      ...systems[index],
      phases: {
        ...systems[index].phases,
        initialAssessment: {
          ...systems[index].phases.initialAssessment,
          environment: {
            ...environmentData,
            status: 'completed',
            updatedAt: new Date().toISOString()
          }
        }
      }
    };

    return {
      success: true,
      data: systems[index].phases.initialAssessment.environment
    };
  },

  // Update network boundary
  updateNetworkBoundary: async (clientId, systemId, boundaryData) => {
    await delay(500);
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

    const numericClientId = Number(clientId);
    const index = systems.findIndex(s => 
      s.clientId === numericClientId && 
      s.id === systemId
    );
    
    checkExists(systems[index], 'System');

    systems[index] = {
      ...systems[index],
      phases: {
        ...systems[index].phases,
        initialAssessment: {
          ...systems[index].phases.initialAssessment,
          boundary: {
            ...boundaryData,
            status: 'completed',
            updatedAt: new Date().toISOString()
          }
        }
      }
    };

    return {
      success: true,
      data: systems[index].phases.initialAssessment.boundary
    };
  },

  // Update stakeholders
  updateStakeholders: async (clientId, systemId, stakeholderData) => {
    await delay(500);
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

    const numericClientId = Number(clientId);
    const index = systems.findIndex(s => 
      s.clientId === numericClientId && 
      s.id === systemId
    );
    
    checkExists(systems[index], 'System');

    systems[index] = {
      ...systems[index],
      phases: {
        ...systems[index].phases,
        initialAssessment: {
          ...systems[index].phases.initialAssessment,
          stakeholders: {
            ...stakeholderData,
            status: 'completed',
            updatedAt: new Date().toISOString()
          }
        }
      }
    };

    return {
      success: true,
      data: systems[index].phases.initialAssessment.stakeholders
    };
  },

  // Get initial assessment progress
  getProgress: async (clientId, systemId) => {
    await delay(300);
    validateRequired({ clientId, systemId }, ['clientId', 'systemId']);
    
    const numericClientId = Number(clientId);
    const system = systems.find(s => 
      s.clientId === numericClientId && 
      s.id === systemId
    );
    
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