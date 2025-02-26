# Services Restructure Plan

## Current Issues

After analyzing the current services structure, I've identified the following issues:

1. **Inconsistent API Implementation**: Each service file implements API calls differently, making the codebase harder to maintain.
2. **Hardcoded API URLs**: Each service defines its own API_URL constant instead of using a centralized configuration.
3. **Underutilization of Helper Functions**: The project has good API helper functions in `apiHelpers.js`, but they're not consistently used across services.
4. **Business Logic Mixed with API Calls**: Many service files contain complex business logic mixed with API calls, making them harder to test and maintain.
5. **Inconsistent Error Handling**: Some services have proper error handling, while others don't.
6. **Inconsistent HTTP Method Usage**: The services don't consistently use the appropriate HTTP methods for CRUD operations.
7. **Mock Database Complexity**: The current approach of merging multiple JSON files into a single db.json file is complex and difficult to maintain.
8. **Data Duplication**: The final db.json contains duplicated data, such as enum values appearing in multiple places.
9. **Relationship Management Challenges**: Managing relationships between entities (like risks to objectives) is difficult with the current approach.
10. **Maintenance Overhead**: Modifying data requires updating multiple files and regenerating db.json.

## Restructuring Goals

1. **Create a Consistent API Layer**: Implement a consistent pattern for API calls across all services.
2. **Separate Business Logic from API Calls**: Move business logic out of API services into separate modules.
3. **Centralize Configuration**: Use a centralized configuration for API URLs and other settings.
4. **Implement Proper Error Handling**: Ensure all API calls have proper error handling.
5. **Use Appropriate HTTP Methods**: Ensure all API calls use the appropriate HTTP methods for CRUD operations.
6. **Prepare for Backend Integration**: Structure the services to make it easy to switch from mock data to real backend API calls.
7. **Simplify Mock Database**: Implement a more maintainable approach to mock data.
8. **Reduce Data Duplication**: Store reference data (like enums) once and reference where needed.
9. **Improve Relationship Management**: Make it easier to manage relationships between entities.
10. **Reduce Maintenance Overhead**: Make it easier to modify mock data without regenerating everything.

## New Structure

```
src/
  services/
    config.js                 # Centralized configuration
    api/
      client/                 # Client-related API services
      system/                 # System-related API services
      grc/                    # GRC-related API services
    business/                 # Business logic services
    hooks/                    # React hooks for API calls
    adapters/                 # Adapters for transforming data
    utils/                    # Utility functions
    mocks/
      mockDb.js               # In-memory mock database
      repositories/           # Repository pattern implementation
      middleware.js           # Custom middleware for mock server
      routes.js               # Route definitions for mock server
    index.js                  # Main export file
```

## Implementation Plan

### 1. Create Centralized Configuration

Create a `config.js` file that exports configuration values like API URLs, authentication settings, etc.

```javascript
// src/services/config.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
export const API_TIMEOUT = 30000; // 30 seconds
export const API_VERSION = 'v1';
export const IS_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || true;
```

### 2. Enhance API Helpers

Enhance the existing `apiHelpers.js` to include more robust error handling, request/response interceptors, and better TypeScript support.

```javascript
// src/services/utils/apiHelpers.js
import { API_BASE_URL } from '../config';

// Error class
export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Request interceptor
const requestInterceptor = (options) => {
  // Add authentication, logging, etc.
  return options;
};

// Response interceptor
const responseInterceptor = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.message || 'API request failed', response.status, error);
  }
  return response.json();
};

// Base fetch function
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const enhancedOptions = requestInterceptor({
    ...options,
    headers,
  });

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, enhancedOptions);
    return await responseInterceptor(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'An unexpected error occurred');
  }
};

// HTTP method helpers
export const get = (url, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  return fetchWithAuth(fullUrl, {
    method: 'GET',
  });
};

export const post = (url, data) => {
  return fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const put = (url, data) => {
  return fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const patch = (url, data) => {
  return fetchWithAuth(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const del = (url) => {
  return fetchWithAuth(url, {
    method: 'DELETE',
  });
};

// Validation helpers
export const validateRequired = (data, fields) => {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new ApiError(`Missing required fields: ${missing.join(', ')}`, 400);
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError('Invalid email format', 400);
  }
};

export const checkExists = (item, itemType) => {
  if (!item) {
    throw new ApiError(`${itemType} not found`, 404);
  }
};
```

### 3. Create Base API Service Class

Create a base API service class that all API services will extend.

```javascript
// src/services/api/BaseApiService.js
import { get, post, put, patch, del, validateRequired } from '../utils/apiHelpers';
import { IS_MOCK } from '../config';
import { getRepository } from '../mocks/repositories';

export class BaseApiService {
  constructor(basePath, entityName) {
    this.basePath = basePath;
    this.entityName = entityName;
  }

  // Helper to build URL with path parameters
  buildUrl(path = '', pathParams = {}) {
    let url = `${this.basePath}${path}`;
    
    // Replace path parameters
    Object.entries(pathParams).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(value));
    });
    
    return url;
  }

  // CRUD operations with mock support
  async getAll(queryParams = {}) {
    if (IS_MOCK) {
      const repository = getRepository(this.entityName);
      return repository.findAll(queryParams);
    }
    return get(this.basePath, queryParams);
  }

  async getById(id, queryParams = {}) {
    validateRequired({ id }, ['id']);
    
    if (IS_MOCK) {
      const repository = getRepository(this.entityName);
      return repository.findById(id, queryParams);
    }
    return get(this.buildUrl(`/${id}`), queryParams);
  }

  async create(data) {
    if (IS_MOCK) {
      const repository = getRepository(this.entityName);
      return repository.create(data);
    }
    return post(this.basePath, data);
  }

  async update(id, data) {
    validateRequired({ id }, ['id']);
    
    if (IS_MOCK) {
      const repository = getRepository(this.entityName);
      return repository.update(id, data);
    }
    return put(this.buildUrl(`/${id}`), data);
  }

  async partialUpdate(id, data) {
    validateRequired({ id }, ['id']);
    
    if (IS_MOCK) {
      const repository = getRepository(this.entityName);
      return repository.partialUpdate(id, data);
    }
    return patch(this.buildUrl(`/${id}`), data);
  }

  async delete(id) {
    validateRequired({ id }, ['id']);
    
    if (IS_MOCK) {
      const repository = getRepository(this.entityName);
      return repository.delete(id);
    }
    return del(this.buildUrl(`/${id}`));
  }
}
```

### 4. Implement In-Memory Mock Database

Create an in-memory mock database that can be used by the API services.

```javascript
// src/services/mocks/mockDb.js
// Import mock data
import clientsData from './data/client_data/clients.json';
import securityObjectivesData from './data/client_data/securityObjectives.json';
import securityInitiativesData from './data/client_data/securityInitiatives.json';
// ... other imports

// Create a flatter structure for the mock database
const mockDb = {
  // Client domain
  clients: clientsData.clients || [],
  securityObjectives: securityObjectivesData.securityObjectives || [],
  securityInitiatives: securityInitiativesData.securityInitiatives || [],
  // ... other client data
  
  // System domain
  systems: [],
  components: [],
  // ... other system data
  
  // GRC domain
  grcUsers: [],
  settings: [],
  // ... other GRC data
  
  // Reference data (enums)
  enums: {
    objectiveStatuses: ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
    priorityLevels: ['High', 'Medium', 'Low'],
    // ... other enums
  }
};

// Helper to generate unique IDs
export const generateId = (prefix = '') => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper to add delay to simulate network latency
export const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export default mockDb;
```

### 5. Implement Repository Pattern

Create a repository pattern implementation for the mock database.

```javascript
// src/services/mocks/repositories/Repository.js
import mockDb, { generateId, delay } from '../mockDb';
import { ApiError } from '../../utils/apiHelpers';

export class Repository {
  constructor(entityName) {
    this.entityName = entityName;
    this.collection = mockDb[entityName] || [];
  }

  // Find all entities with optional filtering
  async findAll(queryParams = {}) {
    await delay();
    
    let results = [...this.collection];
    
    // Apply filters from queryParams
    Object.entries(queryParams).forEach(([key, value]) => {
      if (key === 'sort' || key === 'order' || key === 'limit' || key === 'offset') {
        return; // Skip special params
      }
      
      results = results.filter(item => {
        if (typeof value === 'string' && value.includes(',')) {
          // Handle array values (e.g., status=open,closed)
          const values = value.split(',');
          return values.includes(String(item[key]));
        }
        return String(item[key]) === String(value);
      });
    });
    
    // Apply sorting
    if (queryParams.sort) {
      const sortField = queryParams.sort;
      const sortOrder = queryParams.order === 'desc' ? -1 : 1;
      
      results.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortOrder;
        if (a[sortField] > b[sortField]) return 1 * sortOrder;
        return 0;
      });
    }
    
    // Apply pagination
    if (queryParams.limit) {
      const limit = parseInt(queryParams.limit, 10);
      const offset = parseInt(queryParams.offset, 10) || 0;
      
      results = results.slice(offset, offset + limit);
    }
    
    return results;
  }

  // Find entity by ID
  async findById(id, queryParams = {}) {
    await delay();
    
    const entity = this.collection.find(item => String(item.id) === String(id));
    
    if (!entity) {
      throw new ApiError(`${this.entityName} not found with id: ${id}`, 404);
    }
    
    return entity;
  }

  // Create new entity
  async create(data) {
    await delay();
    
    const newEntity = {
      id: data.id || generateId(this.entityName.slice(0, 3) + '-'),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.collection.push(newEntity);
    mockDb[this.entityName] = this.collection;
    
    return newEntity;
  }

  // Update entity
  async update(id, data) {
    await delay();
    
    const index = this.collection.findIndex(item => String(item.id) === String(id));
    
    if (index === -1) {
      throw new ApiError(`${this.entityName} not found with id: ${id}`, 404);
    }
    
    const updatedEntity = {
      ...this.collection[index],
      ...data,
      id: this.collection[index].id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    this.collection[index] = updatedEntity;
    mockDb[this.entityName] = this.collection;
    
    return updatedEntity;
  }

  // Partial update entity
  async partialUpdate(id, data) {
    return this.update(id, data);
  }

  // Delete entity
  async delete(id) {
    await delay();
    
    const index = this.collection.findIndex(item => String(item.id) === String(id));
    
    if (index === -1) {
      throw new ApiError(`${this.entityName} not found with id: ${id}`, 404);
    }
    
    this.collection.splice(index, 1);
    mockDb[this.entityName] = this.collection;
    
    return { success: true, message: `${this.entityName} deleted successfully` };
  }
}

// Factory function to get repository instance
export const getRepository = (entityName) => {
  if (!mockDb[entityName]) {
    mockDb[entityName] = [];
  }
  
  return new Repository(entityName);
};
```

### 6. Implement API Services

Implement API services for each domain (client, system, GRC) using the base API service class.

Example for Security Objectives API:

```javascript
// src/services/api/client/SecurityObjectivesApi.js
import { BaseApiService } from '../BaseApiService';
import { validateRequired } from '../../utils/apiHelpers';
import { IS_MOCK } from '../../config';
import mockDb from '../../mocks/mockDb';

class SecurityObjectivesApi extends BaseApiService {
  constructor() {
    super('/security-objectives', 'securityObjectives');
  }

  // Get all objectives for a client
  async getObjectives(clientId, options = {}) {
    validateRequired({ clientId }, ['clientId']);
    return this.getAll({ clientId: Number(clientId), ...options });
  }

  // Get single objective
  async getObjective(clientId, objectiveId) {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    return this.getById(objectiveId, { clientId: Number(clientId) });
  }

  // Create new objective
  async createObjective(clientId, objectiveData) {
    validateRequired({ clientId }, ['clientId']);
    validateRequired(objectiveData, ['name', 'priority', 'dueDate']);
    
    // Validate priority level
    if (IS_MOCK && !mockDb.enums.priorityLevels.includes(objectiveData.priority)) {
      throw new Error('Invalid priority level');
    }
    
    // Validate status
    if (objectiveData.status && IS_MOCK && !mockDb.enums.objectiveStatuses.includes(objectiveData.status)) {
      throw new Error('Invalid status');
    }
    
    return this.create({
      clientId: Number(clientId),
      ...objectiveData,
      status: objectiveData.status || 'Planning',
      progress: objectiveData.progress || 0,
      metrics: objectiveData.metrics || {
        successCriteria: [],
        currentMetrics: []
      }
    });
  }

  // Update objective
  async updateObjective(clientId, objectiveId, updates) {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    
    // Validate priority level
    if (updates.priority && IS_MOCK && !mockDb.enums.priorityLevels.includes(updates.priority)) {
      throw new Error('Invalid priority level');
    }
    
    // Validate status
    if (updates.status && IS_MOCK && !mockDb.enums.objectiveStatuses.includes(updates.status)) {
      throw new Error('Invalid status');
    }
    
    return this.partialUpdate(objectiveId, {
      clientId: Number(clientId),
      ...updates
    });
  }

  // Delete objective
  async deleteObjective(clientId, objectiveId) {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    
    // Special case for risk-based objectives
    if (objectiveId.startsWith('risk-')) {
      throw new Error('Cannot delete risk-based objectives directly. Address the underlying risk instead.');
    }
    
    return this.delete(objectiveId);
  }

  // Update objective metrics
  async updateObjectiveMetrics(clientId, objectiveId, metrics) {
    validateRequired({ clientId, objectiveId }, ['clientId', 'objectiveId']);
    validateRequired(metrics, ['successCriteria', 'currentMetrics']);
    
    return this.partialUpdate(objectiveId, {
      metrics
    });
  }

  // Get objective statuses
  async getObjectiveStatuses() {
    if (IS_MOCK) {
      return mockDb.enums.objectiveStatuses;
    }
    return get(`${this.basePath}/statuses`);
  }

  // Get priority levels
  async getPriorityLevels() {
    if (IS_MOCK) {
      return mockDb.enums.priorityLevels;
    }
    return get(`${this.basePath}/priority-levels`);
  }
}

export default new SecurityObjectivesApi();
```

### 7. Create Business Logic Services

Create separate services for business logic that use the API services.

Example for Security Objectives Business Logic:

```javascript
// src/services/business/SecurityObjectivesService.js
import securityObjectivesApi from '../api/client/SecurityObjectivesApi';
import riskAssessmentApi from '../api/client/RiskAssessmentApi';

class SecurityObjectivesService {
  // Get all objectives for a client, including risk-based objectives
  async getObjectives(clientId) {
    try {
      // Get objectives from API
      const objectives = await securityObjectivesApi.getObjectives(clientId);

      // Get risks that should be addressed
      const risks = await riskAssessmentApi.getRisks(clientId);
      const highPriorityRisks = risks.filter(risk => 
        risk.status === 'open' && 
        (risk.impact === 'high' || risk.likelihood === 'high')
      );

      // Convert risks to objectives if they don't exist yet
      const riskBasedObjectives = highPriorityRisks
        .filter(risk => !objectives.some(obj => obj.sourceRisk === risk.id))
        .map(risk => this.createRiskBasedObjective(risk, clientId));

      return [...objectives, ...riskBasedObjectives];
    } catch (error) {
      console.error('Error fetching objectives:', error);
      return [];
    }
  }

  // Create a risk-based objective
  createRiskBasedObjective(risk, clientId) {
    return {
      id: `risk-${risk.id}`,
      clientId: Number(clientId),
      name: `Address Risk: ${risk.name}`,
      description: risk.description,
      priority: risk.impact === 'high' ? 'High' : 'Medium',
      status: 'Planning',
      progress: 0,
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      metrics: {
        successCriteria: ['Risk mitigation completed', 'Controls implemented', 'Verification performed'],
        currentMetrics: []
      },
      sourceRisk: risk.id
    };
  }

  // Get single objective, including risk-based objectives
  async getObjective(clientId, objectiveId) {
    try {
      // Check if this is a risk-based objective
      if (objectiveId.startsWith('risk-')) {
        const riskId = objectiveId.split('-')[1];
        const risk = await riskAssessmentApi.getRisk(clientId, riskId);
        if (!risk) {
          throw new Error('Security Objective not found');
        }
        return this.createRiskBasedObjective(risk, clientId);
      }

      // Get objective from API
      return await securityObjectivesApi.getObjective(clientId, objectiveId);
    } catch (error) {
      console.error('Error fetching objective:', error);
      throw error;
    }
  }

  // Update objective, handling risk-based objectives specially
  async updateObjective(clientId, objectiveId, updates) {
    try {
      // For risk-based objectives, some updates may need to reflect back to the risk
      if (objectiveId.startsWith('risk-')) {
        const riskId = objectiveId.split('-')[1];
        const risk = await riskAssessmentApi.getRisk(clientId, riskId);
        if (!risk) {
          throw new Error('Security Objective not found');
        }

        // Update risk status if objective is completed
        if (updates.status === 'Completed') {
          await riskAssessmentApi.updateRisk(clientId, riskId, {
            status: 'mitigated'
          });
        }

        // Return updated risk-based objective
        return {
          ...this.createRiskBasedObjective(risk, clientId),
          status: updates.status || 'Planning',
          progress: updates.progress || 0,
          dueDate: updates.dueDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          metrics: updates.metrics || {
            successCriteria: ['Risk mitigation completed', 'Controls implemented', 'Verification performed'],
            currentMetrics: []
          }
        };
      }

      // Update regular objective
      return await securityObjectivesApi.updateObjective(clientId, objectiveId, updates);
    } catch (error) {
      console.error('Error updating objective:', error);
      throw error;
    }
  }
}

export default new SecurityObjectivesService();
```

### 8. Create React Hooks for API Services

Create React hooks for API services to make them easier to use in components.

```javascript
// src/services/hooks/useSecurityObjectives.js
import { useState, useEffect, useCallback } from 'react';
import securityObjectivesService from '../business/SecurityObjectivesService';

export const useSecurityObjectives = (clientId) => {
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchObjectives = useCallback(async () => {
    try {
      setLoading(true);
      const data = await securityObjectivesService.getObjectives(clientId);
      setObjectives(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch objectives');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    if (clientId) {
      fetchObjectives();
    }
  }, [clientId, fetchObjectives]);

  const createObjective = async (objectiveData) => {
    try {
      const newObjective = await securityObjectivesService.createObjective(clientId, objectiveData);
      setObjectives(prev => [...prev, newObjective]);
      return newObjective;
    } catch (err) {
      setError(err.message || 'Failed to create objective');
      throw err;
    }
  };

  const updateObjective = async (objectiveId, updates) => {
    try {
      const updatedObjective = await securityObjectivesService.updateObjective(clientId, objectiveId, updates);
      setObjectives(prev => prev.map(obj => obj.id === objectiveId ? updatedObjective : obj));
      return updatedObjective;
    } catch (err) {
      setError(err.message || 'Failed to update objective');
      throw err;
    }
  };

  const deleteObjective = async (objectiveId) => {
    try {
      await securityObjectivesService.deleteObjective(clientId, objectiveId);
      setObjectives(prev => prev.filter(obj => obj.id !== objectiveId));
    } catch (err) {
      setError(err.message || 'Failed to delete objective');
      throw err;
    }
  };

  return {
    objectives,
    loading,
    error,
    fetchObjectives,
    createObjective,
    updateObjective,
    deleteObjective
  };
};
```

### 9. Update Main Export File

Update the main export file to export all services.

```javascript
// src/services/index.js
// API Services
export { default as securityObjectivesApi } from './api/client/SecurityObjectivesApi';
export { default as securityInitiativesApi } from './api/client/SecurityInitiativesApi';
export { default as riskAssessmentApi } from './api/client/RiskAssessmentApi';
// ... other API services

// Business Logic Services
export { default as securityObjectivesService } from './business/SecurityObjectivesService';
export { default as securityInitiativesService } from './business/SecurityInitiativesService';
export { default as riskAssessmentService } from './business/RiskAssessmentService';
// ... other business logic services

// Hooks
export { useSecurityObjectives } from './hooks/useSecurityObjectives';
export { useSecurityInitiatives } from './hooks/useSecurityInitiatives';
export { useRiskAssessment } from './hooks/useRiskAssessment';
// ... other hooks

// Utils
export { ApiError, validateRequired, validateEmail, checkExists } from './utils/apiHelpers';

// Mock DB (for development and testing)
export { default as mockDb } from './mocks/mockDb';
```

## Migration Strategy

1. **Create New Structure**: Create the new directory structure and base files.
2. **Implement Mock Database**: Implement the in-memory mock database and repository pattern.
3. **Migrate One Domain at a Time**: Start with one domain (e.g., security objectives) and migrate it to the new structure.
4. **Update Components**: Update components to use the new services.
5. **Test Thoroughly**: Test the migrated services to ensure they work correctly.
6. **Migrate Remaining Domains**: Migrate the remaining domains one by one.
7. **Remove Old Files**: Once all domains are migrated and tested, remove the old files.

## Benefits of New Structure

1. **Consistency**: All API services follow the same pattern, making the codebase easier to understand and maintain.
2. **Separation of Concerns**: Business logic is separated from API calls, making the code more testable and maintainable.
3. **Centralized Configuration**: API URLs and other settings are centralized, making it easier to change them.
4. **Proper Error Handling**: All API calls have proper error handling, making the application more robust.
5. **Appropriate HTTP Methods**: All API calls use the appropriate HTTP methods for CRUD operations, making the API more RESTful.
6. **Ready for Backend Integration**: The services are structured to make it easy to switch from mock data to real backend API calls.
7. **React Hooks**: React hooks make it easier to use the services in components, reducing boilerplate code.
8. **Simplified Mock Database**: The in-memory mock database is easier to maintain than the current approach.
9. **Reduced Data Duplication**: Reference data is stored once and referenced where needed.
10. **Improved Relationship Management**: The repository pattern makes it easier to manage relationships between entities.
11. **Reduced Maintenance Overhead**: Modifying mock data is easier with the in-memory approach.

## Comparison with Current Approach

### Current Approach
- Multiple JSON files merged into a single db.json file
- Complex merging logic in generateDb.js
- Data duplication across files
- Difficult relationship management
- High maintenance overhead

### New Approach
- In-memory mock database with repository pattern
- Flatter, more maintainable data structure
- Reduced data duplication
- Easier relationship management
- Lower maintenance overhead
- Seamless transition between mock and real backend