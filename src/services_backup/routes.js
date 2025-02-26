// src/services/mocks/routes.js
// This file defines the routes for the mock server

// Client domain routes
const clientRoutes = {
  // Security Objectives
  '/security-objectives': {
    GET: 'securityObjectives.findAll',
    POST: 'securityObjectives.create'
  },
  '/security-objectives/:id': {
    GET: 'securityObjectives.findById',
    PUT: 'securityObjectives.update',
    PATCH: 'securityObjectives.partialUpdate',
    DELETE: 'securityObjectives.delete'
  },
  '/security-objectives/statuses': {
    GET: 'securityObjectives.getStatuses'
  },
  '/security-objectives/priority-levels': {
    GET: 'securityObjectives.getPriorityLevels'
  },

  // Security Initiatives
  '/security-initiatives': {
    GET: 'securityInitiatives.findAll',
    POST: 'securityInitiatives.create'
  },
  '/security-initiatives/:id': {
    GET: 'securityInitiatives.findById',
    PUT: 'securityInitiatives.update',
    PATCH: 'securityInitiatives.partialUpdate',
    DELETE: 'securityInitiatives.delete'
  },

  // Risk Assessment
  '/risk-assessment': {
    GET: 'riskAssessment.findAll',
    POST: 'riskAssessment.create'
  },
  '/risk-assessment/:id': {
    GET: 'riskAssessment.findById',
    PUT: 'riskAssessment.update',
    PATCH: 'riskAssessment.partialUpdate',
    DELETE: 'riskAssessment.delete'
  },

  // Clients
  '/clients': {
    GET: 'clients.findAll',
    POST: 'clients.create'
  },
  '/clients/:id': {
    GET: 'clients.findById',
    PUT: 'clients.update',
    PATCH: 'clients.partialUpdate',
    DELETE: 'clients.delete'
  },

  // Client Users
  '/client-users': {
    GET: 'clientUsers.findAll',
    POST: 'clientUsers.create'
  },
  '/client-users/:id': {
    GET: 'clientUsers.findById',
    PUT: 'clientUsers.update',
    PATCH: 'clientUsers.partialUpdate',
    DELETE: 'clientUsers.delete'
  },

  // Assessments
  '/assessments': {
    GET: 'assessments.findAll',
    POST: 'assessments.create'
  },
  '/assessments/:id': {
    GET: 'assessments.findById',
    PUT: 'assessments.update',
    PATCH: 'assessments.partialUpdate',
    DELETE: 'assessments.delete'
  },

  // Incidents
  '/incidents': {
    GET: 'incidents.findAll',
    POST: 'incidents.create'
  },
  '/incidents/:id': {
    GET: 'incidents.findById',
    PUT: 'incidents.update',
    PATCH: 'incidents.partialUpdate',
    DELETE: 'incidents.delete'
  },

  // Reporting
  '/reporting/executive-dashboard': {
    GET: 'reporting.getExecutiveDashboard'
  },
  '/reporting/systems-overview': {
    GET: 'reporting.getSystemsOverview'
  },
  '/reporting/assessment-history': {
    GET: 'reporting.getAssessmentHistory'
  }
};

// System domain routes
const systemRoutes = {
  // Systems
  '/systems': {
    GET: 'systems.findAll',
    POST: 'systems.create'
  },
  '/systems/:id': {
    GET: 'systems.findById',
    PUT: 'systems.update',
    PATCH: 'systems.partialUpdate',
    DELETE: 'systems.delete'
  },

  // System Components
  '/systems/:systemId/components': {
    GET: 'systemComponents.findAll',
    POST: 'systemComponents.create'
  },
  '/systems/:systemId/components/:id': {
    GET: 'systemComponents.findById',
    PUT: 'systemComponents.update',
    PATCH: 'systemComponents.partialUpdate',
    DELETE: 'systemComponents.delete'
  },

  // System Controls
  '/systems/:systemId/controls': {
    GET: 'systemControls.findAll',
    POST: 'systemControls.create'
  },
  '/systems/:systemId/controls/:id': {
    GET: 'systemControls.findById',
    PUT: 'systemControls.update',
    PATCH: 'systemControls.partialUpdate',
    DELETE: 'systemControls.delete'
  },

  // ATO Tracker
  '/systems/:systemId/ato-tracker': {
    GET: 'atoTracker.findAll',
    POST: 'atoTracker.create'
  },
  '/systems/:systemId/ato-tracker/:id': {
    GET: 'atoTracker.findById',
    PUT: 'atoTracker.update',
    PATCH: 'atoTracker.partialUpdate',
    DELETE: 'atoTracker.delete'
  },

  // System Categorization
  '/systems/:systemId/categorization': {
    GET: 'systemCategorization.findAll',
    POST: 'systemCategorization.create'
  },
  '/systems/:systemId/categorization/:id': {
    GET: 'systemCategorization.findById',
    PUT: 'systemCategorization.update',
    PATCH: 'systemCategorization.partialUpdate',
    DELETE: 'systemCategorization.delete'
  },

  // Artifacts
  '/systems/:systemId/artifacts': {
    GET: 'artifacts.findAll',
    POST: 'artifacts.create'
  },
  '/systems/:systemId/artifacts/:id': {
    GET: 'artifacts.findById',
    PUT: 'artifacts.update',
    PATCH: 'artifacts.partialUpdate',
    DELETE: 'artifacts.delete'
  }
};

// GRC domain routes
const grcRoutes = {
  // GRC Users
  '/grc-users': {
    GET: 'grcUsers.findAll',
    POST: 'grcUsers.create'
  },
  '/grc-users/:id': {
    GET: 'grcUsers.findById',
    PUT: 'grcUsers.update',
    PATCH: 'grcUsers.partialUpdate',
    DELETE: 'grcUsers.delete'
  },

  // Settings
  '/settings': {
    GET: 'settings.findAll',
    POST: 'settings.create'
  },
  '/settings/:id': {
    GET: 'settings.findById',
    PUT: 'settings.update',
    PATCH: 'settings.partialUpdate',
    DELETE: 'settings.delete'
  }
};

// Auth routes
const authRoutes = {
  '/auth/login': {
    POST: 'auth.login'
  },
  '/auth/logout': {
    POST: 'auth.logout'
  },
  '/auth/refresh': {
    POST: 'auth.refresh'
  },
  '/auth/me': {
    GET: 'auth.me'
  }
};

// Combine all routes
const routes = {
  ...clientRoutes,
  ...systemRoutes,
  ...grcRoutes,
  ...authRoutes
};

export default routes;