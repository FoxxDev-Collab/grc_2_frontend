import { validateRequired, checkExists } from '../apiHelpers';

const API_URL = 'http://localhost:3001';

export const riskAssessmentApi = {
  // Get all risks
  getRisks: async (clientId) => {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      const response = await fetch(`${API_URL}/risks?clientId=${Number(clientId)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch risks');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching risks:', error);
      return [];
    }
  },

  // Get risk by ID
  getRisk: async (clientId, riskId) => {
    validateRequired({ clientId, riskId }, ['clientId', 'riskId']);
    
    try {
      const response = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`);
      if (!response.ok) {
        throw new Error('Risk not found');
      }
      
      const risk = await response.json();
      checkExists(risk, 'Risk');
      return risk;
    } catch (error) {
      console.error('Error fetching risk:', error);
      throw error;
    }
  },

  // Create new risk
  createRisk: async (clientId, riskData) => {
    validateRequired(riskData, ['name', 'description', 'impact', 'likelihood', 'category']);

    const newRisk = {
      clientId: Number(clientId),
      lastAssessed: new Date().toISOString(),
      sourceFindings: [],
      businessImpact: {
        financial: '',
        operational: '',
        reputational: '',
        compliance: ''
      },
      treatment: {
        approach: 'mitigate',
        plan: '',
        status: 'not_started',
        objectives: []
      },
      ...riskData
    };

    try {
      const response = await fetch(`${API_URL}/risks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRisk)
      });

      if (!response.ok) {
        throw new Error('Failed to create risk');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating risk:', error);
      throw error;
    }
  },

  // Update risk
  updateRisk: async (clientId, riskId, updates) => {
    validateRequired({ clientId, riskId }, ['clientId', 'riskId']);

    try {
      // First get the existing risk
      const riskResponse = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`);
      if (!riskResponse.ok) {
        throw new Error('Risk not found');
      }
      
      const existingRisk = await riskResponse.json();
      checkExists(existingRisk, 'Risk');

      // Prepare updated risk data
      const updatedRisk = {
        ...existingRisk,
        ...updates,
        lastAssessed: new Date().toISOString()
      };

      // Send the update
      const updateResponse = await fetch(`${API_URL}/risks/${riskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRisk)
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update risk');
      }

      return await updateResponse.json();
    } catch (error) {
      console.error('Error updating risk:', error);
      throw error;
    }
  },

  // Delete risk
  deleteRisk: async (clientId, riskId) => {
    validateRequired({ clientId, riskId }, ['clientId', 'riskId']);

    try {
      const response = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete risk');
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting risk:', error);
      throw error;
    }
  },

  // Add finding to risk
  addFindingToRisk: async (clientId, riskId, findingData) => {
    validateRequired(findingData, ['findingId', 'title', 'sourceType']);

    try {
      // First get the existing risk
      const riskResponse = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`);
      if (!riskResponse.ok) {
        throw new Error('Risk not found');
      }
      
      const existingRisk = await riskResponse.json();
      checkExists(existingRisk, 'Risk');

      // Add the finding
      const updatedRisk = {
        ...existingRisk,
        sourceFindings: [
          ...(existingRisk.sourceFindings || []),
          {
            ...findingData,
            date: new Date().toISOString()
          }
        ]
      };

      // Send the update
      const updateResponse = await fetch(`${API_URL}/risks/${riskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRisk)
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to add finding to risk');
      }

      return await updateResponse.json();
    } catch (error) {
      console.error('Error adding finding to risk:', error);
      throw error;
    }
  },

  // Remove finding from risk
  removeFindingFromRisk: async (clientId, riskId, findingId) => {
    validateRequired({ clientId, riskId, findingId }, ['clientId', 'riskId', 'findingId']);

    try {
      // First get the existing risk
      const riskResponse = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`);
      if (!riskResponse.ok) {
        throw new Error('Risk not found');
      }
      
      const existingRisk = await riskResponse.json();
      checkExists(existingRisk, 'Risk');

      // Remove the finding
      const updatedRisk = {
        ...existingRisk,
        sourceFindings: existingRisk.sourceFindings.filter(f => f.findingId !== findingId)
      };

      // Send the update
      const updateResponse = await fetch(`${API_URL}/risks/${riskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRisk)
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to remove finding from risk');
      }

      return await updateResponse.json();
    } catch (error) {
      console.error('Error removing finding from risk:', error);
      throw error;
    }
  },

  // Update risk treatment
  updateRiskTreatment: async (clientId, riskId, treatmentData) => {
    validateRequired(treatmentData, ['approach', 'plan']);

    try {
      // First get the existing risk
      const riskResponse = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`);
      if (!riskResponse.ok) {
        throw new Error('Risk not found');
      }
      
      const existingRisk = await riskResponse.json();
      checkExists(existingRisk, 'Risk');

      // Update the treatment
      const updatedRisk = {
        ...existingRisk,
        treatment: {
          ...existingRisk.treatment,
          ...treatmentData,
          lastUpdated: new Date().toISOString()
        }
      };

      // Send the update
      const updateResponse = await fetch(`${API_URL}/risks/${riskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRisk)
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update risk treatment');
      }

      return await updateResponse.json();
    } catch (error) {
      console.error('Error updating risk treatment:', error);
      throw error;
    }
  },

  // Link objective to risk treatment
  linkObjectiveToRisk: async (clientId, riskId, objectiveId) => {
    validateRequired({ clientId, riskId, objectiveId }, ['clientId', 'riskId', 'objectiveId']);

    try {
      // First get the existing risk
      const riskResponse = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`);
      if (!riskResponse.ok) {
        throw new Error('Risk not found');
      }
      
      const existingRisk = await riskResponse.json();
      checkExists(existingRisk, 'Risk');

      // Initialize objectives array if it doesn't exist
      if (!existingRisk.treatment.objectives) {
        existingRisk.treatment.objectives = [];
      }

      // Add the objective if it doesn't already exist
      if (!existingRisk.treatment.objectives.includes(objectiveId)) {
        const updatedRisk = {
          ...existingRisk,
          treatment: {
            ...existingRisk.treatment,
            objectives: [...existingRisk.treatment.objectives, objectiveId]
          }
        };

        // Send the update
        const updateResponse = await fetch(`${API_URL}/risks/${riskId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRisk)
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to link objective to risk');
        }

        // Also update the risk_to_objective mapping
        await riskAssessmentApi.createRiskObjectiveMapping(clientId, riskId, objectiveId);

        return await updateResponse.json();
      }

      return existingRisk;
    } catch (error) {
      console.error('Error linking objective to risk:', error);
      throw error;
    }
  },

  // Unlink objective from risk treatment
  unlinkObjectiveFromRisk: async (clientId, riskId, objectiveId) => {
    validateRequired({ clientId, riskId, objectiveId }, ['clientId', 'riskId', 'objectiveId']);

    try {
      // First get the existing risk
      const riskResponse = await fetch(`${API_URL}/risks/${riskId}?clientId=${Number(clientId)}`);
      if (!riskResponse.ok) {
        throw new Error('Risk not found');
      }
      
      const existingRisk = await riskResponse.json();
      checkExists(existingRisk, 'Risk');

      // Filter out the objective
      if (existingRisk.treatment.objectives) {
        const updatedRisk = {
          ...existingRisk,
          treatment: {
            ...existingRisk.treatment,
            objectives: existingRisk.treatment.objectives.filter(id => id !== objectiveId)
          }
        };

        // Send the update
        const updateResponse = await fetch(`${API_URL}/risks/${riskId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRisk)
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to unlink objective from risk');
        }

        // Also remove from the risk_to_objective mapping
        await riskAssessmentApi.deleteRiskObjectiveMapping(clientId, riskId, objectiveId);

        return await updateResponse.json();
      }

      return existingRisk;
    } catch (error) {
      console.error('Error unlinking objective from risk:', error);
      throw error;
    }
  },

  // Get risk statistics
  getRiskStats: async (clientId) => {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      // Get all risks for the client
      const response = await fetch(`${API_URL}/risks?clientId=${Number(clientId)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch risks');
      }
      
      const clientRisks = await response.json();

      // Calculate statistics
      return {
        total: clientRisks.length,
        byImpact: {
          high: clientRisks.filter(r => r.impact === 'high').length,
          medium: clientRisks.filter(r => r.impact === 'medium').length,
          low: clientRisks.filter(r => r.impact === 'low').length
        },
        byLikelihood: {
          high: clientRisks.filter(r => r.likelihood === 'high').length,
          medium: clientRisks.filter(r => r.likelihood === 'medium').length,
          low: clientRisks.filter(r => r.likelihood === 'low').length
        },
        byStatus: {
          active: clientRisks.filter(r => r.status === 'active').length,
          mitigated: clientRisks.filter(r => r.status === 'mitigated').length,
          accepted: clientRisks.filter(r => r.status === 'accepted').length,
          transferred: clientRisks.filter(r => r.status === 'transferred').length
        },
        byTreatment: {
          not_started: clientRisks.filter(r => r.treatment?.status === 'not_started').length,
          in_progress: clientRisks.filter(r => r.treatment?.status === 'in_progress').length,
          completed: clientRisks.filter(r => r.treatment?.status === 'completed').length,
          blocked: clientRisks.filter(r => r.treatment?.status === 'blocked').length
        },
        sourceAnalysis: {
          fromFindings: clientRisks.filter(r => r.sourceFindings?.length > 0).length,
          manuallyIdentified: clientRisks.filter(r => !r.sourceFindings?.length).length,
          bySourceType: {
            security_assessment: clientRisks.filter(r => 
              r.sourceFindings?.some(f => f.sourceType === 'security_assessment')
            ).length,
            vulnerability_scan: clientRisks.filter(r => 
              r.sourceFindings?.some(f => f.sourceType === 'vulnerability_scan')
            ).length,
            external_audit: clientRisks.filter(r => 
              r.sourceFindings?.some(f => f.sourceType === 'external_audit')
            ).length
          }
        }
      };
    } catch (error) {
      console.error('Error getting risk stats:', error);
      return {
        total: 0,
        byImpact: { high: 0, medium: 0, low: 0 },
        byLikelihood: { high: 0, medium: 0, low: 0 },
        byStatus: { active: 0, mitigated: 0, accepted: 0, transferred: 0 },
        byTreatment: { not_started: 0, in_progress: 0, completed: 0, blocked: 0 },
        sourceAnalysis: {
          fromFindings: 0,
          manuallyIdentified: 0,
          bySourceType: { security_assessment: 0, vulnerability_scan: 0, external_audit: 0 }
        }
      };
    }
  },

  // Get framework progress
  getFrameworkProgress: async (clientId) => {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      // Get all risks for the client
      const response = await fetch(`${API_URL}/risks?clientId=${Number(clientId)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch risks');
      }
      
      const clientRisks = await response.json();

      // Calculate progress
      return {
        riskManagement: {
          identified: clientRisks.length,
          assessed: clientRisks.filter(r => r.impact && r.likelihood).length,
          treated: clientRisks.filter(r => r.treatment?.plan).length,
          mitigated: clientRisks.filter(r => r.status === 'mitigated').length
        },
        coverage: {
          accessControl: clientRisks.filter(r => r.category === 'Access Control').length,
          dataProtection: clientRisks.filter(r => r.category === 'Data Protection').length,
          vulnerabilityManagement: clientRisks.filter(r => r.category === 'Vulnerability Management').length,
          thirdPartyRisk: clientRisks.filter(r => r.category === 'Third Party Risk').length,
          businessContinuity: clientRisks.filter(r => r.category === 'Business Continuity').length,
          compliance: clientRisks.filter(r => r.category === 'Compliance').length
        },
        trends: {
          newRisks: {
            last30Days: clientRisks.filter(r => 
              new Date(r.lastAssessed) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length,
            last90Days: clientRisks.filter(r => 
              new Date(r.lastAssessed) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
            ).length
          },
          mitigatedRisks: {
            last30Days: clientRisks.filter(r => 
              r.status === 'mitigated' && 
              new Date(r.lastAssessed) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length,
            last90Days: clientRisks.filter(r => 
              r.status === 'mitigated' && 
              new Date(r.lastAssessed) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
            ).length
          }
        }
      };
    } catch (error) {
      console.error('Error getting framework progress:', error);
      return {
        riskManagement: { identified: 0, assessed: 0, treated: 0, mitigated: 0 },
        coverage: {
          accessControl: 0, dataProtection: 0, vulnerabilityManagement: 0,
          thirdPartyRisk: 0, businessContinuity: 0, compliance: 0
        },
        trends: {
          newRisks: { last30Days: 0, last90Days: 0 },
          mitigatedRisks: { last30Days: 0, last90Days: 0 }
        }
      };
    }
  },

  // UPDATED METHODS FOR RISK-OBJECTIVE-INITIATIVE FLOW

  // Get all risk-to-objective mappings
  getRiskObjectiveMappings: async (clientId) => {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      const response = await fetch(`${API_URL}/risk_to_objective`);
      if (!response.ok) {
        throw new Error('Failed to fetch risk-objective mappings');
      }
      
      const data = await response.json();
      return data.riskObjectives || [];
    } catch (error) {
      console.error('Error fetching risk-objective mappings:', error);
      return [];
    }
  },

  // Get objectives linked to a specific risk
  getObjectivesForRisk: async (clientId, riskId) => {
    validateRequired({ clientId, riskId }, ['clientId', 'riskId']);
    
    try {
      // Get all mappings
      const mappings = await riskAssessmentApi.getRiskObjectiveMappings(clientId);
      
      // Filter mappings for this risk
      const riskObjectives = mappings.filter(mapping => mapping.riskId === riskId);
      
      // Return the objective IDs
      return riskObjectives.map(mapping => mapping.objectiveId);
    } catch (error) {
      console.error('Error getting objectives for risk:', error);
      return [];
    }
  },

  // Create a new risk-to-objective mapping
  createRiskObjectiveMapping: async (clientId, riskId, objectiveId) => {
    validateRequired({ clientId, riskId, objectiveId }, ['clientId', 'riskId', 'objectiveId']);
    
    try {
      // Get existing mappings
      const response = await fetch(`${API_URL}/risk_to_objective`);
      if (!response.ok) {
        throw new Error('Failed to fetch risk-objective mappings');
      }
      
      const data = await response.json();
      
      // Check if mapping already exists
      const existingMapping = data.riskObjectives.find(
        mapping => mapping.riskId === riskId && mapping.objectiveId === objectiveId
      );
      
      if (existingMapping) {
        return existingMapping; // Mapping already exists
      }
      
      // Create new mapping
      const newMapping = {
        id: `ro-${Date.now()}`,
        riskId,
        objectiveId,
        dateLinked: new Date().toISOString()
      };
      
      // Add to existing mappings
      const updatedMappings = [...data.riskObjectives, newMapping];
      
      // Update the data
      const updateResponse = await fetch(`${API_URL}/risk_to_objective`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          riskObjectives: updatedMappings
        })
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to create risk-objective mapping');
      }
      
      return newMapping;
    } catch (error) {
      console.error('Error creating risk-objective mapping:', error);
      throw error;
    }
  },

  // Delete a risk-to-objective mapping
  deleteRiskObjectiveMapping: async (clientId, riskId, objectiveId) => {
    validateRequired({ clientId, riskId, objectiveId }, ['clientId', 'riskId', 'objectiveId']);
    
    try {
      // Get existing mappings
      const response = await fetch(`${API_URL}/risk_to_objective`);
      if (!response.ok) {
        throw new Error('Failed to fetch risk-objective mappings');
      }
      
      const data = await response.json();
      
      // Filter out the mapping to delete
      const updatedMappings = data.riskObjectives.filter(
        mapping => !(mapping.riskId === riskId && mapping.objectiveId === objectiveId)
      );
      
      // Update the data
      const updateResponse = await fetch(`${API_URL}/risk_to_objective`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          riskObjectives: updatedMappings
        })
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to delete risk-objective mapping');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting risk-objective mapping:', error);
      throw error;
    }
  },

  // Get all objective-to-initiative mappings
  getObjectiveInitiativeMappings: async (clientId) => {
    validateRequired({ clientId }, ['clientId']);
    
    try {
      const response = await fetch(`${API_URL}/objective_to_initiative`);
      if (!response.ok) {
        throw new Error('Failed to fetch objective-initiative mappings');
      }
      
      const data = await response.json();
      return data.objectiveInitiatives || [];
    } catch (error) {
      console.error('Error fetching objective-initiative mappings:', error);
      return [];
    }
  },

  // Get initiatives linked to a specific objective
  getInitiativesForObjective: async (clientId, objectiveId) => {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    
    try {
      // Get all mappings
      const mappings = await riskAssessmentApi.getObjectiveInitiativeMappings(clientId);
      
      // Filter mappings for this objective
      const objectiveInitiatives = mappings.filter(mapping => mapping.objectiveId === objectiveId);
      
      // Return the initiative IDs
      return objectiveInitiatives.map(mapping => mapping.initiativeId);
    } catch (error) {
      console.error('Error getting initiatives for objective:', error);
      return [];
    }
  },

  // Create a new objective-to-initiative mapping
  createObjectiveInitiativeMapping: async (clientId, objectiveId, initiativeId) => {
    validateRequired({ clientId, objectiveId, initiativeId }, ['clientId', 'objectiveId', 'initiativeId']);
    
    try {
      // Get existing mappings
      const response = await fetch(`${API_URL}/objective_to_initiative`);
      if (!response.ok) {
        throw new Error('Failed to fetch objective-initiative mappings');
      }
      
      const data = await response.json();
      
      // Check if mapping already exists
      const existingMapping = data.objectiveInitiatives.find(
        mapping => mapping.objectiveId === objectiveId && mapping.initiativeId === initiativeId
      );
      
      if (existingMapping) {
        return existingMapping; // Mapping already exists
      }
      
      // Create new mapping
      const newMapping = {
        id: `oi-${Date.now()}`,
        objectiveId,
        initiativeId,
        dateLinked: new Date().toISOString()
      };
      
      // Add to existing mappings
      const updatedMappings = [...data.objectiveInitiatives, newMapping];
      
      // Update the data
      const updateResponse = await fetch(`${API_URL}/objective_to_initiative`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objectiveInitiatives: updatedMappings
        })
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to create objective-initiative mapping');
      }
      
      return newMapping;
    } catch (error) {
      console.error('Error creating objective-initiative mapping:', error);
      throw error;
    }
  },

  // Delete an objective-to-initiative mapping
  deleteObjectiveInitiativeMapping: async (clientId, objectiveId, initiativeId) => {
    validateRequired({ clientId, objectiveId, initiativeId }, ['clientId', 'objectiveId', 'initiativeId']);
    
    try {
      // Get existing mappings
      const response = await fetch(`${API_URL}/objective_to_initiative`);
      if (!response.ok) {
        throw new Error('Failed to fetch objective-initiative mappings');
      }
      
      const data = await response.json();
      
      // Filter out the mapping to delete
      const updatedMappings = data.objectiveInitiatives.filter(
        mapping => !(mapping.objectiveId === objectiveId && mapping.initiativeId === initiativeId)
      );
      
      // Update the data
      const updateResponse = await fetch(`${API_URL}/objective_to_initiative`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objectiveInitiatives: updatedMappings
        })
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to delete objective-initiative mapping');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting objective-initiative mapping:', error);
      throw error;
    }
  },

  // Get the complete risk-objective-initiative chain for a risk
  getRiskObjectiveInitiativeChain: async (clientId, riskId) => {
    validateRequired({ clientId, riskId }, ['clientId', 'riskId']);
    
    try {
      // Get the risk details
      const risk = await riskAssessmentApi.getRisk(clientId, riskId);
      
      // Get objectives linked to this risk
      const objectiveIds = await riskAssessmentApi.getObjectivesForRisk(clientId, riskId);
      
      // Build the chain
      const chain = {
        risk,
        objectives: []
      };
      
      // For each objective, get linked initiatives
      for (const objectiveId of objectiveIds) {
        // Get objective details
        const objectiveResponse = await fetch(`${API_URL}/security-objectives/${objectiveId}?clientId=${Number(clientId)}`);
        let objective;
        
        if (objectiveResponse.ok) {
          objective = await objectiveResponse.json();
        } else {
          // Handle risk-based objectives
          if (objectiveId.startsWith('risk-')) {
            const riskId = objectiveId.split('-')[1];
            const risk = await riskAssessmentApi.getRisk(clientId, riskId);
            
            objective = {
              id: objectiveId,
              name: `Address Risk: ${risk.name}`,
              description: risk.description,
              priority: risk.impact === 'high' ? 'High' : 'Medium',
              status: 'Planning',
              sourceRisk: risk.id
            };
          } else {
            // Skip if objective not found
            continue;
          }
        }
        
        // Get initiatives linked to this objective
        const initiativeIds = await riskAssessmentApi.getInitiativesForObjective(clientId, objectiveId);
        const initiatives = [];
        
        // Get initiative details
        for (const initiativeId of initiativeIds) {
          const initiativeResponse = await fetch(`${API_URL}/security-initiatives/${initiativeId}?clientId=${Number(clientId)}`);
          
          if (initiativeResponse.ok) {
            const initiative = await initiativeResponse.json();
            initiatives.push(initiative);
          }
        }
        
        // Add to chain
        chain.objectives.push({
          objective,
          initiatives
        });
      }
      
      return chain;
    } catch (error) {
      console.error('Error getting risk-objective-initiative chain:', error);
      throw new Error(`Failed to get risk-objective-initiative chain: ${error.message}`);
    }
  }
};

export default riskAssessmentApi;