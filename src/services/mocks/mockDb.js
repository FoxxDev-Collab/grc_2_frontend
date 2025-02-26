// src/services/mocks/mockDb.js
// Import client data
import clientsData from './data/client_data/clients.json';
import securityObjectivesData from './data/client_data/securityObjectives.json';
import securityInitiativesData from './data/client_data/securityInitiatives.json';
import assessmentsData from './data/client_data/assessments.json';
import clientUsersData from './data/client_data/client_users.json';
import departmentsData from './data/client_data/departments.json';
import documentsData from './data/client_data/documents.json';
import findingsToRiskData from './data/client_data/findings_to_risk.json';
import keyPersonnelData from './data/client_data/key_personnel.json';
import objectiveToInitiativeData from './data/client_data/objective_to_initiative.json';
import referenceData from './data/client_data/reference_data.json';
import riskToObjectiveData from './data/client_data/risk_to_objective.json';
import scanResultsData from './data/client_data/scan_results.json';
import advancedQuestionsData from './data/client_data/advanced_questions.json';
import basicQuestionsData from './data/client_data/basic_questions.json';
import authorizationData from './data/client_data/authorization.json';
import incidentData from './data/client_data/incidents/incidents.json';
import incidentReferenceData from './data/client_data/incident_reference_data.json';

// Import system data
import systemsData from './data/system/systems.json';
import atoTrackerData from './data/system/ato_tracker.json';
import systemAuthorizationData from './data/system/authorization.json';
import categorizationData from './data/system/categorization.json';
import controlsData from './data/system/controls.json';
import enumsData from './data/system/enums.json';
import processStepsData from './data/system/process_steps.json';
import systemPackagesData from './data/system/system_packages.json';

// Import auth data
import usersData from './data/auth/users.json';

// Create a flatter structure for the mock database
const mockDb = {
  // Client domain
  clients: clientsData.clients || [],
  securityObjectives: securityObjectivesData.securityObjectives || [],
  securityInitiatives: securityInitiativesData.securityInitiatives || [],
  assessments: assessmentsData.assessments || [],
  clientUsers: clientUsersData.client_users || [],
  departments: departmentsData.departments || [],
  documents: documentsData.documents || [],
  findingsToRisk: findingsToRiskData.findings_to_risk || [],
  keyPersonnel: keyPersonnelData.key_personnel || [],
  objectiveToInitiative: objectiveToInitiativeData.objective_to_initiative || [],
  referenceData: referenceData.reference_data || [],
  riskToObjective: riskToObjectiveData.risk_to_objective || [],
  scanResults: scanResultsData.scan_results || [],
  advancedQuestions: advancedQuestionsData.advanced_questions || [],
  basicQuestions: basicQuestionsData.basic_questions || [],
  authorization: authorizationData.authorization || [],
  incidents: incidentData.incidents || [],
  
  // Incident reference data
  incidentTypes: incidentReferenceData.incidentTypes || [],
  incidentSeverities: incidentReferenceData.incidentSeverities || [],
  incidentStatuses: incidentReferenceData.incidentStatuses || [],
  incidentPriorities: incidentReferenceData.incidentPriorities || [],
  actionTypes: incidentReferenceData.actionTypes || [],
  teams: incidentReferenceData.teams || [],
  systemTypes: incidentReferenceData.systemTypes || [],
  
  // System domain
  systems: systemsData.systems || [],
  atoTracker: atoTrackerData.ato_tracker || [],
  systemAuthorization: systemAuthorizationData.authorization || [],
  categorization: categorizationData.categorization || [],
  controls: controlsData.controls || [],
  processSteps: processStepsData.process_steps || [],
  systemPackages: systemPackagesData.system_packages || [],
  
  // Auth domain
  users: usersData.users || [],
  
  // Client user roles and permissions - this is what we need to fix
  roles: clientUsersData.roles || [], // Use client user roles directly
  rolePermissions: clientUsersData.rolePermissions || [],
  permissions: clientUsersData.permissions || [],
  userStatus: clientUsersData.userStatus || [],
  titles: clientUsersData.titles || [],
  
  // Reference data (enums)
  enums: {
    objectiveStatuses: ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
    priorityLevels: ['High', 'Medium', 'Low'],
    riskLevels: ['Critical', 'High', 'Medium', 'Low', 'Negligible'],
    riskStatuses: ['Open', 'Mitigated', 'Accepted', 'Transferred', 'Closed'],
    incidentStatuses: ['Open', 'Investigating', 'Resolved', 'Closed'],
    incidentSeverities: ['Critical', 'High', 'Medium', 'Low'],
    ...enumsData.enums || {}
  }
};

// Helper to generate unique IDs
export const generateId = (prefix = '') => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper to add delay to simulate network latency
export const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export default mockDb;