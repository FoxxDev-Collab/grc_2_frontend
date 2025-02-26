import { fetchWithAuth, validateRequired } from '../../utils/apiHelpers';

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

const incidentApi = {
  // Get all incidents
  getIncidents: async (clientId) => {
    try {
      const response = await fetchWithAuth(`/incidents?clientId=${clientId}`);
      return response;
    } catch (error) {
      console.error('Error fetching incidents:', error);
      throw new Error('Failed to fetch incidents');
    }
  },

  // Get single incident
  getIncident: async (clientId, incidentId) => {
    try {
      const response = await fetchWithAuth(`/incidents/${incidentId}?clientId=${clientId}`);
      return response;
    } catch (error) {
      console.error('Error fetching incident:', error);
      if (error.status === 404) throw new Error('Incident not found');
      throw new Error('Failed to fetch incident');
    }
  },

  // Create new incident
  createIncident: async (clientId, incidentData) => {
    try {
      validateRequired(incidentData, ['title', 'type', 'severity', 'priority', 'description']);

      const response = await fetchWithAuth('/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...incidentData,
          clientId: Number(clientId),
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          resolvedAt: null,
          actions: []
        })
      });
      
      return response;
    } catch (error) {
      console.error('Error creating incident:', error);
      throw new Error('Failed to create incident');
    }
  },

  // Update incident
  updateIncident: async (clientId, incidentId, updates) => {
    try {
      const response = await fetchWithAuth(`/incidents/${incidentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updates,
          clientId: Number(clientId),
          updatedAt: new Date().toISOString(),
          // If status is being updated to 'resolved', set resolvedAt
          ...(updates.status === 'resolved' ? { resolvedAt: new Date().toISOString() } : {})
        })
      });
      
      return response;
    } catch (error) {
      console.error('Error updating incident:', error);
      if (error.status === 404) throw new Error('Incident not found');
      throw new Error('Failed to update incident');
    }
  },

  // Add action to incident
  addAction: async (clientId, incidentId, actionData) => {
    try {
      validateRequired(actionData, ['type', 'description', 'performedBy']);

      const incident = await incidentApi.getIncident(clientId, incidentId);
      const newAction = {
        id: Math.max(0, ...incident.actions.map(a => a.id)) + 1,
        timestamp: new Date().toISOString(),
        ...actionData
      };

      // eslint-disable-next-line no-unused-vars
      const response = await fetchWithAuth(`/incidents/${incidentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actions: [...incident.actions, newAction],
          updatedAt: new Date().toISOString()
        })
      });
      
      return newAction;
    } catch (error) {
      console.error('Error adding action:', error);
      throw new Error('Failed to add action');
    }
  },

  // Get incident types
  getIncidentTypes: async () => {
    try {
      const response = await fetchWithAuth('/incidentTypes');
      return response;
    } catch (error) {
      console.error('Error fetching incident types:', error);
      throw new Error('Failed to fetch incident types');
    }
  },

  // Get incident severities
  getIncidentSeverities: async () => {
    try {
      const response = await fetchWithAuth('/incidentSeverities');
      return response;
    } catch (error) {
      console.error('Error fetching incident severities:', error);
      throw new Error('Failed to fetch incident severities');
    }
  },

  // Get incident statuses
  getIncidentStatuses: async () => {
    try {
      const response = await fetchWithAuth('/incidentStatuses');
      return response;
    } catch (error) {
      console.error('Error fetching incident statuses:', error);
      throw new Error('Failed to fetch incident statuses');
    }
  },

  // Get incident priorities
  getIncidentPriorities: async () => {
    try {
      const response = await fetchWithAuth('/incidentPriorities');
      return response;
    } catch (error) {
      console.error('Error fetching incident priorities:', error);
      throw new Error('Failed to fetch incident priorities');
    }
  },

  // Get action types
  getActionTypes: async () => {
    try {
      const response = await fetchWithAuth('/actionTypes');
      return response;
    } catch (error) {
      console.error('Error fetching action types:', error);
      throw new Error('Failed to fetch action types');
    }
  },

  // Get teams
  getTeams: async () => {
    try {
      const response = await fetchWithAuth('/teams');
      return response;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw new Error('Failed to fetch teams');
    }
  },

  // Get system types
  getSystemTypes: async () => {
    try {
      const response = await fetchWithAuth('/systemTypes');
      return response;
    } catch (error) {
      console.error('Error fetching system types:', error);
      throw new Error('Failed to fetch system types');
    }
  },

  // Get incident statistics
  getIncidentStats: async (clientId) => {
    try {
      const [incidents, incidentTypes] = await Promise.all([
        incidentApi.getIncidents(clientId),
        incidentApi.getIncidentTypes()
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
      console.error('Error getting incident stats:', error);
      return DEFAULT_STATS;
    }
  }
};

export default incidentApi;