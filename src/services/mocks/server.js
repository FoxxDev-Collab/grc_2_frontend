/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// src/services/mocks/server.js
import express from 'express';
import cors from 'cors';
import { getRepository } from './repositories/Repository';
import { delay } from './mockDb';

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`[${new Date().toISOString()}] [${requestId}] ${req.method} ${req.url} - Request started`);
  
  // Log request body if present
  if (req.method !== 'GET' && Object.keys(req.body).length > 0) {
    console.log(`[${requestId}] Request body:`, JSON.stringify(req.body, null, 2));
  }
  
  // Log query parameters if present
  if (Object.keys(req.query).length > 0) {
    console.log(`[${requestId}] Query params:`, req.query);
  }
  
  // Capture the original res.json to intercept responses
  const originalJson = res.json;
  res.json = function(body) {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] [${requestId}] ${req.method} ${req.url} - Response sent (${res.statusCode}) - ${duration}ms`);
    
    // Call the original json method
    return originalJson.call(this, body);
  };
  
  // Capture errors
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      console.error(`[${requestId}] Error response: ${res.statusCode}`);
    }
  });
  
  next();
});

// Middleware to simulate network delay
app.use(async (req, res, next) => {
  await delay(300);
  next();
});

// Create a generic REST endpoint for any entity
const createEntityEndpoints = (entityName, path) => {
  const router = express.Router();
  
  // GET all
  router.get('/', async (req, res) => {
    try {
      const repository = getRepository(entityName);
      const data = await repository.findAll(req.query);
      res.json(data);
    } catch (error) {
      console.error(`Error in GET ${path}:`, error);
      res.status(error.status || 500).json({ message: error.message });
    }
  });
  
  // GET by ID
  router.get('/:id', async (req, res) => {
    try {
      const repository = getRepository(entityName);
      const data = await repository.findById(req.params.id);
      res.json(data);
    } catch (error) {
      console.error(`Error in GET ${path}/${req.params.id}:`, error);
      res.status(error.status || 500).json({ message: error.message });
    }
  });
  
  // POST new entity
  router.post('/', async (req, res) => {
    try {
      const repository = getRepository(entityName);
      const data = await repository.create(req.body);
      console.log(`Created new ${entityName} with ID: ${data.id}`);
      res.status(201).json(data);
    } catch (error) {
      console.error(`Error in POST ${path}:`, error);
      res.status(error.status || 500).json({ message: error.message });
    }
  });
  
  // PUT update entity
  router.put('/:id', async (req, res) => {
    try {
      const repository = getRepository(entityName);
      const data = await repository.update(req.params.id, req.body);
      console.log(`Updated ${entityName} with ID: ${data.id}`);
      res.json(data);
    } catch (error) {
      console.error(`Error in PUT ${path}/${req.params.id}:`, error);
      res.status(error.status || 500).json({ message: error.message });
    }
  });
  
  // PATCH partial update entity
  router.patch('/:id', async (req, res) => {
    try {
      const repository = getRepository(entityName);
      const data = await repository.partialUpdate(req.params.id, req.body);
      console.log(`Partially updated ${entityName} with ID: ${data.id}`);
      res.json(data);
    } catch (error) {
      console.error(`Error in PATCH ${path}/${req.params.id}:`, error);
      res.status(error.status || 500).json({ message: error.message });
    }
  });
  
  // DELETE entity
  router.delete('/:id', async (req, res) => {
    try {
      const repository = getRepository(entityName);
      await repository.delete(req.params.id);
      console.log(`Deleted ${entityName} with ID: ${req.params.id}`);
      res.json({ success: true });
    } catch (error) {
      console.error(`Error in DELETE ${path}/${req.params.id}:`, error);
      res.status(error.status || 500).json({ message: error.message });
    }
  });
  
  app.use(path, router);
  console.log(`Registered routes for ${entityName} at ${path}`);
};

// Authentication endpoints
const authRouter = express.Router();

// Login endpoint
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.warn(`Login attempt with missing credentials: email=${!!email}, password=${!!password}`);
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const usersRepository = getRepository('users');
    const users = await usersRepository.findAll({ email });
    const user = users[0];
    
    if (!user || user.password !== password) {
      console.warn(`Failed login attempt for email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (!user.isActive) {
      console.warn(`Login attempt for inactive account: ${email}`);
      return res.status(403).json({ message: 'Account is inactive' });
    }
    
    // Generate a mock token
    const token = `mock-token-${Date.now()}`;
    
    // Update last active timestamp
    await usersRepository.partialUpdate(user.id, {
      lastActive: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    });
    
    console.log(`Successful login for user: ${email} (ID: ${user.id})`);
    
    // Return user data without sensitive information
    const { password: _password, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error in login endpoint:', error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Get current user
authRouter.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.warn('Unauthorized access attempt to /auth/me (no token)');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // In a real app, we would validate the token
    // For mock purposes, we'll just return the first user
    const usersRepository = getRepository('users');
    const users = await usersRepository.findAll();
    const user = users[0];
    
    if (!user) {
      console.error('No users found in the database for /auth/me');
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log(`Retrieved current user: ${user.email} (ID: ${user.id})`);
    
    // Return user data without sensitive information
    const { password: _password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error in /auth/me endpoint:', error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Logout endpoint
authRouter.post('/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(`User logged out (token: ${token?.substring(0, 10)}...)`);
  // In a real app, we would invalidate the token
  res.json({ success: true, message: 'Logged out successfully' });
});

// Register auth routes
app.use('/auth', authRouter);
console.log('Registered authentication routes at /auth');

// System-specific endpoints
const authorizationRouter = express.Router();

// Get authorization data
authorizationRouter.get('/:clientId/:systemId', async (req, res) => {
  try {
    const { clientId, systemId } = req.params;
    console.log(`Retrieving authorization data for client ${clientId}, system ${systemId}`);
    
    // Mock authorization data
    res.json({
      id: `auth-${systemId}`,
      systemId: systemId,
      clientId: Number(clientId),
      status: 'IN_PROGRESS',
      package: {
        completed: false,
        documents: [],
        lastUpdated: new Date().toISOString()
      },
      decision: {
        status: 'PENDING',
        approver: null,
        date: null,
        conditions: [],
        expirationDate: null
      },
      poam: []
    });
  } catch (error) {
    console.error(`Error retrieving authorization data for client ${req.params.clientId}, system ${req.params.systemId}:`, error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Create POAM item
authorizationRouter.post('/:clientId/:systemId/poam', async (req, res) => {
  try {
    const { clientId, systemId } = req.params;
    const poamData = req.body;
    
    console.log(`Creating POAM item for client ${clientId}, system ${systemId}`);
    
    // Mock POAM creation
    const poamId = `poam-${Date.now()}`;
    res.status(201).json({
      id: poamId,
      ...poamData,
      systemId: systemId,
      clientId: Number(clientId)
    });
    
    console.log(`Created POAM item with ID: ${poamId}`);
  } catch (error) {
    console.error(`Error creating POAM item for client ${req.params.clientId}, system ${req.params.systemId}:`, error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Update authorization package
authorizationRouter.put('/:clientId/:systemId/package', async (req, res) => {
  try {
    const { clientId, systemId } = req.params;
    const packageData = req.body;
    
    console.log(`Updating authorization package for client ${clientId}, system ${systemId}`);
    
    // Mock package update
    res.json({
      id: `auth-${systemId}`,
      systemId: systemId,
      clientId: Number(clientId),
      status: 'IN_PROGRESS',
      package: {
        ...packageData,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`Error updating authorization package for client ${req.params.clientId}, system ${req.params.systemId}:`, error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Update authorization decision
authorizationRouter.put('/:clientId/:systemId/decision', async (req, res) => {
  try {
    const { clientId, systemId } = req.params;
    const decisionData = req.body;
    
    console.log(`Updating authorization decision for client ${clientId}, system ${systemId}`);
    
    // Mock decision update
    res.json({
      id: `auth-${systemId}`,
      systemId: systemId,
      clientId: Number(clientId),
      status: decisionData.status || 'IN_PROGRESS',
      decision: {
        ...decisionData,
        date: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`Error updating authorization decision for client ${req.params.clientId}, system ${req.params.systemId}:`, error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Validate authorization package
authorizationRouter.put('/:clientId/:systemId/validate', async (req, res) => {
  try {
    const { clientId, systemId } = req.params;
    
    console.log(`Validating authorization package for client ${clientId}, system ${systemId}`);
    
    // Mock validation results
    res.json({
      status: 'VALIDATED',
      timestamp: new Date().toISOString(),
      findings: [],
      recommendations: [
        'Ensure all POA&M items have detailed remediation plans',
        'Update system boundary documentation with network diagrams',
        'Include detailed testing results in security assessment report'
      ]
    });
  } catch (error) {
    console.error(`Error validating authorization package for client ${req.params.clientId}, system ${req.params.systemId}:`, error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Register authorization routes
app.use('/authorization', authorizationRouter);
console.log('Registered authorization routes at /authorization');

// Client-specific endpoints
const clientRouter = express.Router();

// Get industries
app.get('/industries', (req, res) => {
  console.log('Retrieving industries list');
  res.json([
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Government',
    'Non-profit',
    'Other'
  ]);
});

// Get client sizes
app.get('/clientSizes', (req, res) => {
  console.log('Retrieving client sizes list');
  res.json([
    'Small (1-50 employees)',
    'Medium (51-500 employees)',
    'Large (501-5000 employees)',
    'Enterprise (5000+ employees)'
  ]);
});

// Get client statuses
app.get('/clientStatuses', (req, res) => {
  console.log('Retrieving client statuses list');
  res.json([
    'active',
    'inactive',
    'pending',
    'suspended'
  ]);
});

// Get document categories
app.get('/documentCategories', (req, res) => {
  console.log('Retrieving document categories list');
  res.json([
    'General',
    'Policies',
    'Procedures',
    'Contracts',
    'Reports',
    'Compliance',
    'Security',
    'Other'
  ]);
});

// Get document types
app.get('/documentTypes', (req, res) => {
  console.log('Retrieving document types list');
  res.json([
    'PDF',
    'DOCX',
    'XLSX',
    'PPTX',
    'TXT',
    'CSV',
    'ZIP',
    'JPG',
    'PNG'
  ]);
});

// Incident-related endpoints
app.get('/incidentTypes', (req, res) => {
  console.log('Retrieving incident types list');
  res.json([
    'security',
    'availability',
    'performance',
    'data_breach',
    'unauthorized_access',
    'malware',
    'phishing',
    'dos',
    'hardware_failure',
    'software_failure',
    'human_error',
    'other'
  ]);
});

app.get('/incidentSeverities', (req, res) => {
  console.log('Retrieving incident severities list');
  res.json([
    'critical',
    'high',
    'medium',
    'low'
  ]);
});

app.get('/incidentStatuses', (req, res) => {
  console.log('Retrieving incident statuses list');
  res.json([
    'active',
    'investigating',
    'resolved',
    'closed'
  ]);
});

app.get('/incidentPriorities', (req, res) => {
  console.log('Retrieving incident priorities list');
  res.json([
    'critical',
    'high',
    'medium',
    'low'
  ]);
});

app.get('/actionTypes', (req, res) => {
  console.log('Retrieving action types list');
  res.json([
    'investigation',
    'containment',
    'eradication',
    'recovery',
    'communication',
    'documentation',
    'other'
  ]);
});

app.get('/teams', (req, res) => {
  console.log('Retrieving teams list');
  res.json([
    'Security Operations',
    'Network Operations',
    'System Administration',
    'Development',
    'Management',
    'Legal',
    'PR',
    'HR',
    'Other'
  ]);
});

app.get('/systemTypes', (req, res) => {
  console.log('Retrieving system types list');
  res.json([
    'Web Application',
    'Database',
    'Network Infrastructure',
    'Cloud Service',
    'Desktop Application',
    'Mobile Application',
    'IoT Device',
    'Server',
    'Other'
  ]);
});

// Client user roles and permissions endpoints
app.get('/roles', (req, res) => {
  console.log('Retrieving roles list');
  const repository = getRepository('roles');
  repository.findAll()
    .then(data => res.json(data))
    .catch(error => {
      console.error('Error retrieving roles:', error);
      res.status(error.status || 500).json({ message: error.message });
    });
});

app.get('/rolePermissions', (req, res) => {
  console.log('Retrieving role permissions list');
  const repository = getRepository('rolePermissions');
  repository.findAll()
    .then(data => res.json(data))
    .catch(error => {
      console.error('Error retrieving role permissions:', error);
      res.status(error.status || 500).json({ message: error.message });
    });
});

app.get('/permissions', (req, res) => {
  console.log('Retrieving permissions list');
  const repository = getRepository('permissions');
  repository.findAll()
    .then(data => res.json(data))
    .catch(error => {
      console.error('Error retrieving permissions:', error);
      res.status(error.status || 500).json({ message: error.message });
    });
});

// Get titles
app.get('/titles', (req, res) => {
  console.log('Retrieving titles list');
  const repository = getRepository('titles');
  repository.findAll()
    .then(data => res.json(data))
    .catch(error => {
      console.error('Error retrieving titles:', error);
      res.status(error.status || 500).json({ message: error.message });
    });
});

// Get user statuses
app.get('/userStatus', (req, res) => {
  console.log('Retrieving user statuses list');
  const repository = getRepository('userStatus');
  repository.findAll()
    .then(data => res.json(data))
    .catch(error => {
      console.error('Error retrieving user statuses:', error);
      res.status(error.status || 500).json({ message: error.message });
    });
});

// Create endpoints for each entity
createEntityEndpoints('securityObjectives', '/security-objectives');
createEntityEndpoints('securityInitiatives', '/security-initiatives');
createEntityEndpoints('riskAssessment', '/risks');
createEntityEndpoints('users', '/users');
createEntityEndpoints('roles', '/roles');
createEntityEndpoints('systems', '/systems');
createEntityEndpoints('clients', '/clients');
createEntityEndpoints('departments', '/departments');
createEntityEndpoints('documents', '/documents');
createEntityEndpoints('assessmentHistory', '/assessmentHistory');
createEntityEndpoints('incidents', '/incidents');
createEntityEndpoints('clientUsers', '/client-users'); // Add endpoint for client users
createEntityEndpoints('titles', '/titles'); // Add endpoint for titles
createEntityEndpoints('userStatus', '/userStatus'); // Add endpoint for user statuses

// Add assessments endpoints
const assessmentsRouter = express.Router();

// GET all assessments
assessmentsRouter.get('/', async (req, res) => {
  try {
    console.log('Retrieving all assessments');
    const repository = getRepository('assessmentHistory');
    const data = await repository.findAll(req.query);
    res.json(data);
  } catch (error) {
    console.error('Error retrieving all assessments:', error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

// GET assessment by ID
assessmentsRouter.get('/:id', async (req, res) => {
  try {
    console.log(`Retrieving assessment with ID: ${req.params.id}`);
    const repository = getRepository('assessmentHistory');
    const data = await repository.findById(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(`Error retrieving assessment with ID ${req.params.id}:`, error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

// GET assessments by client ID
assessmentsRouter.get('/client/:clientId', async (req, res) => {
  try {
    console.log(`Retrieving assessments for client ID: ${req.params.clientId}`);
    const repository = getRepository('assessmentHistory');
    const data = await repository.findAll({ clientId: req.params.clientId });
    res.json(data);
  } catch (error) {
    console.error(`Error retrieving assessments for client ID ${req.params.clientId}:`, error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

// GET assessments by system ID
assessmentsRouter.get('/system/:systemId', async (req, res) => {
  try {
    console.log(`Retrieving assessments for system ID: ${req.params.systemId}`);
    const repository = getRepository('assessmentHistory');
    const data = await repository.findAll({ systemId: req.params.systemId });
    res.json(data);
  } catch (error) {
    console.error(`Error retrieving assessments for system ID ${req.params.systemId}:`, error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

// POST new assessment
assessmentsRouter.post('/', async (req, res) => {
  try {
    console.log('Creating new assessment');
    const repository = getRepository('assessmentHistory');
    const data = await repository.create(req.body);
    console.log(`Created new assessment with ID: ${data.id}`);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating new assessment:', error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

// PATCH update assessment
assessmentsRouter.patch('/:id', async (req, res) => {
  try {
    console.log(`Updating assessment with ID: ${req.params.id}`);
    const repository = getRepository('assessmentHistory');
    const data = await repository.partialUpdate(req.params.id, req.body);
    console.log(`Updated assessment with ID: ${data.id}`);
    res.json(data);
  } catch (error) {
    console.error(`Error updating assessment with ID ${req.params.id}:`, error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

// DELETE assessment
assessmentsRouter.delete('/:id', async (req, res) => {
  try {
    console.log(`Deleting assessment with ID: ${req.params.id}`);
    const repository = getRepository('assessmentHistory');
    await repository.delete(req.params.id);
    console.log(`Deleted assessment with ID: ${req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    console.error(`Error deleting assessment with ID ${req.params.id}:`, error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Register assessments routes
app.use('/assessments', assessmentsRouter);
console.log('Registered assessment routes at /assessments');

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`Mock server running on port ${PORT}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
  console.log(`API base URL: http://localhost:${PORT}`);
  console.log('='.repeat(50));
});

export default app;