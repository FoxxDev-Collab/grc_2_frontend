import { validateRequired } from '../apiHelpers';

const API_URL = 'http://localhost:3001';

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
    const response = await fetch(`${API_URL}/incidents?clientId=${clientId}`);
    if (!response.ok) throw new Error('Failed to fetch incidents');
    return response.json();
  },

  // Get single incident
  getIncident: async (clientId, incidentId) => {
    const response = await fetch(`${API_URL}/incidents/${incidentId}?clientId=${clientId}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error('Incident not found');
      throw new Error('Failed to fetch incident');
    }
    return response.json();
  },

  // Create new incident
  createIncident: async (clientId, incidentData) => {
    validateRequired(incidentData, ['title', 'type', 'severity', 'priority', 'description']);

    const response = await fetch(`${API_URL}/incidents`, {
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

    if (!response.ok) throw new Error('Failed to create incident');
    return response.json();
  },

  // Update incident
  updateIncident: async (clientId, incidentId, updates) => {
    const response = await fetch(`${API_URL}/incidents/${incidentId}`, {
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

    if (!response.ok) {
      if (response.status === 404) throw new Error('Incident not found');
      throw new Error('Failed to update incident');
    }
    return response.json();
  },

  // Add action to incident
  addAction: async (clientId, incidentId, actionData) => {
    validateRequired(actionData, ['type', 'description', 'performedBy']);

    const incident = await incidentApi.getIncident(clientId, incidentId);
    const newAction = {
      id: Math.max(0, ...incident.actions.map(a => a.id)) + 1,
      timestamp: new Date().toISOString(),
      ...actionData
    };

    const response = await fetch(`${API_URL}/incidents/${incidentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actions: [...incident.actions, newAction],
        updatedAt: new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error('Failed to add action');
    return newAction;
  },

  // Get incident types
  getIncidentTypes: async () => {
    const response = await fetch(`${API_URL}/incidentTypes`);
    if (!response.ok) throw new Error('Failed to fetch incident types');
    return response.json();
  },

  // Get incident severities
  getIncidentSeverities: async () => {
    const response = await fetch(`${API_URL}/incidentSeverities`);
    if (!response.ok) throw new Error('Failed to fetch incident severities');
    return response.json();
  },

  // Get incident statuses
  getIncidentStatuses: async () => {
    const response = await fetch(`${API_URL}/incidentStatuses`);
    if (!response.ok) throw new Error('Failed to fetch incident statuses');
    return response.json();
  },

  // Get incident priorities
  getIncidentPriorities: async () => {
    const response = await fetch(`${API_URL}/incidentPriorities`);
    if (!response.ok) throw new Error('Failed to fetch incident priorities');
    return response.json();
  },

  // Get action types
  getActionTypes: async () => {
    const response = await fetch(`${API_URL}/actionTypes`);
    if (!response.ok) throw new Error('Failed to fetch action types');
    return response.json();
  },

  // Get teams
  getTeams: async () => {
    const response = await fetch(`${API_URL}/teams`);
    if (!response.ok) throw new Error('Failed to fetch teams');
    return response.json();
  },

  // Get system types
  getSystemTypes: async () => {
    const response = await fetch(`${API_URL}/systemTypes`);
    if (!response.ok) throw new Error('Failed to fetch system types');
    return response.json();
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