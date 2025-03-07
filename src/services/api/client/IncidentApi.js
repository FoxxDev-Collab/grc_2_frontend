// src/services/api/incident/IncidentApi.js
import { BaseApiService } from '../BaseApiService';
import { validateRequired, get, post, patch } from '../../utils/apiHelpers';

const DEFAULT_STATS = {
  total: 0,
  active: 0,
  resolved: 0,
  avgResolutionTime: 0,
  bySeverity: {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  },
  byType: {}
};

class IncidentApi extends BaseApiService {
  constructor() {
    // Using the same pattern as other APIs
    super('/incidents', 'incidents');
  }

  // Get all incidents
  async getIncidents(clientId) {
    try {
      return await get(`/incidents?clientId=${clientId}`);
    } catch (error) {
      console.error('Get incidents error:', error);
      throw error;
    }
  }

  // Get single incident
  async getIncident(clientId, incidentId) {
    try {
      return await get(`/incidents/${incidentId}?clientId=${clientId}`);
    } catch (error) {
      console.error('Get incident error:', error);
      if (error.status === 404) throw new Error('Incident not found');
      throw error;
    }
  }

  // Create new incident
  async createIncident(clientId, incidentData) {
    try {
      validateRequired(incidentData, ['title', 'type', 'severity', 'priority', 'description']);

      const newIncident = {
        ...incidentData,
        clientId: Number(clientId),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        resolvedAt: null,
        actions: []
      };

      return await post('/incidents', newIncident);
    } catch (error) {
      console.error('Create incident error:', error);
      throw error;
    }
  }

  // Update incident
  async updateIncident(clientId, incidentId, updates) {
    try {
      const updatedIncident = {
        ...updates,
        clientId: Number(clientId),
        updatedAt: new Date().toISOString(),
        // If status is being updated to 'resolved', set resolvedAt
        ...(updates.status === 'resolved' ? { resolvedAt: new Date().toISOString() } : {})
      };

      return await patch(`/incidents/${incidentId}`, updatedIncident);
    } catch (error) {
      console.error('Update incident error:', error);
      if (error.status === 404) throw new Error('Incident not found');
      throw error;
    }
  }

  // Add action to incident
  async addAction(clientId, incidentId, actionData) {
    try {
      validateRequired(actionData, ['type', 'description', 'performedBy']);

      const incident = await this.getIncident(clientId, incidentId);
      const newAction = {
        id: Math.max(0, ...incident.actions.map(a => a.id)) + 1,
        timestamp: new Date().toISOString(),
        ...actionData
      };

      const updates = {
        actions: [...incident.actions, newAction],
        updatedAt: new Date().toISOString()
      };

      await patch(`/incidents/${incidentId}`, updates);
      
      return newAction;
    } catch (error) {
      console.error('Add action error:', error);
      throw error;
    }
  }

  // Get incident types
  async getIncidentTypes() {
    try {
      return await get('/incidentTypes');
    } catch (error) {
      console.error('Get incident types error:', error);
      throw error;
    }
  }

  // Get incident severities
  async getIncidentSeverities() {
    try {
      return await get('/incidentSeverities');
    } catch (error) {
      console.error('Get incident severities error:', error);
      throw error;
    }
  }

  // Get incident statuses
  async getIncidentStatuses() {
    try {
      return await get('/incidentStatuses');
    } catch (error) {
      console.error('Get incident statuses error:', error);
      throw error;
    }
  }

  // Get incident priorities
  async getIncidentPriorities() {
    try {
      return await get('/incidentPriorities');
    } catch (error) {
      console.error('Get incident priorities error:', error);
      throw error;
    }
  }

  // Get action types
  async getActionTypes() {
    try {
      return await get('/actionTypes');
    } catch (error) {
      console.error('Get action types error:', error);
      throw error;
    }
  }

  // Get teams
  async getTeams() {
    try {
      return await get('/teams');
    } catch (error) {
      console.error('Get teams error:', error);
      throw error;
    }
  }

  // Get system types
  async getSystemTypes() {
    try {
      return await get('/systemTypes');
    } catch (error) {
      console.error('Get system types error:', error);
      throw error;
    }
  }

  // Get incident statistics
  async getIncidentStats(clientId) {
    try {
      const [incidents, incidentTypes] = await Promise.all([
        this.getIncidents(clientId),
        this.getIncidentTypes()
      ]);
      
      if (!Array.isArray(incidents) || incidents.length === 0) {
        return {
          ...DEFAULT_STATS,
          byType: incidentTypes.reduce((acc, type) => ({ ...acc, [type]: 0 }), {})
        };
      }

      const activeIncidents = incidents.filter(inc => inc.status === 'active');
      const resolvedIncidents = incidents.filter(inc => inc.status === 'resolved');

      // Calculate average resolution time for resolved incidents
      const avgResolutionTime = resolvedIncidents.length ? 
        resolvedIncidents.reduce((acc, inc) => {
          const resolutionTime = new Date(inc.resolvedAt) - new Date(inc.createdAt);
          return acc + resolutionTime;
        }, 0) / resolvedIncidents.length : 0;

      return {
        total: incidents.length,
        active: activeIncidents.length,
        resolved: resolvedIncidents.length,
        avgResolutionTime: Math.round(avgResolutionTime / (1000 * 60 * 60)), // Convert to hours
        bySeverity: {
          critical: incidents.filter(inc => inc.severity === 'critical').length,
          high: incidents.filter(inc => inc.severity === 'high').length,
          medium: incidents.filter(inc => inc.severity === 'medium').length,
          low: incidents.filter(inc => inc.severity === 'low').length
        },
        byType: incidentTypes.reduce((acc, type) => ({
          ...acc,
          [type]: incidents.filter(inc => inc.type === type).length
        }), {})
      };
    } catch (error) {
      console.error('Get incident stats error:', error);
      return DEFAULT_STATS;
    }
  }
}

export default new IncidentApi();