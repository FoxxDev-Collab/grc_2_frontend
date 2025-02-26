// src/services/index.js

// Configuration
export { API_BASE_URL, API_TIMEOUT, API_VERSION, IS_MOCK } from './config';

// API Services
export { default as securityObjectivesApi } from './api/client/SecurityObjectivesApi';
export { default as riskAssessmentApi } from './api/client/RiskAssessmentApi';
export { default as authApi } from './api/grc/AuthApi';
export { default as systemApi } from './api/system/SystemApi';
export { default as clientApi } from './api/client/ClientApi';
export { default as clientUserApi } from './api/client/ClientUserApi';
export { default as grcUserApi } from './api/grc/GrcUserApi';
export { default as settingsApi } from './api/grc/settingsApi';
export { default as incidentApi } from './api/client/IncidentApi';
export { default as reportingApi } from './api/client/ReportingApi';
export { default as auditApi } from './api/client/AuditApi';
export { default as securityAssessmentsApi } from './api/client/SecurityAssessmentsApi';
export { default as securityStrategyApi } from './api/client/SecurityStrategyApi';
export { default as securityInitiativesApi } from './api/client/SecurityInitiativesApi';
export { default as systemComponentsApi } from './api/system/systemComponentsApi';
export { default as authorizationApi } from './api/system/authorizationApi';
export { default as initialAssessmentApi } from './api/system/InitialAssessmentApi';
export { default as systemCategorizationApi } from './api/system/SystemCategorizationApi';
export { default as systemControlsApi } from './api/system/systemControlsApi';
export { default as assessmentApi } from './api/system/AssessmentApi';
export { default as atoTrackerApi } from './api/system/AtoTrackerApi';
export { default as artifactsApi } from './api/system/ArtifactsApi';

// Re-export enums from systemApi
export { SecurityLevel, InformationLevel, SystemCategory } from './api/system/SystemApi';

// Add other API services as they are implemented

// Business Logic Services
export { default as securityObjectivesService } from './business/SecurityObjectivesService';
// Add other business logic services as they are implemented

// Hooks
export { useSecurityObjectives } from './hooks/useSecurityObjectives';
export { useAuth } from './hooks/useAuth';
// Add other hooks as they are implemented

// Utils
export {
  ApiError,
  fetchWithAuth,
  get,
  post,
  put,
  patch,
  del,
  validateRequired,
  validateEmail,
  checkExists
} from './utils/apiHelpers';

// Base Classes
export { BaseApiService } from './api/BaseApiService';

// Mock Database (for development and testing)
export { default as mockDb, generateId, delay } from './mocks/mockDb';

// Repository Pattern
export { Repository, getRepository } from './mocks/repositories/Repository';

// Mock Server Middleware
//export { mockServerMiddleware } from './mocks/middleware';

// Mock Routes
//export { default as mockRoutes } from './mocks/routes';
