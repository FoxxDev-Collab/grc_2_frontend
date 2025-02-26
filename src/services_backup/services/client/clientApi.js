import { 
  validateRequired, 
  validateEmail, 
  getCurrentDate, 
  ApiError,
  get,
  post,
  put,
  del
} from '../apiHelpers';

const API_URL = 'http://localhost:3001';

const clientApi = {
  // Get all clients
  getClients: async () => {
    return get(`${API_URL}/clients`);
  },

  // Get available industries
  getIndustries: async () => {
    return get(`${API_URL}/industries`);
  },

  // Get available client sizes
  getClientSizes: async () => {
    return get(`${API_URL}/clientSizes`);
  },

  // Get available client statuses
  getClientStatuses: async () => {
    return get(`${API_URL}/clientStatuses`);
  },

  // Get client by ID
  getClient: async (id) => {
    const numericId = Number(id);
    return get(`${API_URL}/clients/${numericId}`);
  },

  // Create new client
  createClient: async (clientData) => {
    validateRequired(clientData, ['name', 'industry', 'email', 'phone', 'primaryContact']);
    validateEmail(clientData.email);

    const newClient = {
      ...clientData,
      createdAt: getCurrentDate(),
      lastActivity: getCurrentDate(),
      complianceScore: 0,
      status: 'active',
      address: clientData.address || {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      },
      size: clientData.size || '',
      employeeCount: clientData.employeeCount || 0,
      website: clientData.website || ''
    };

    return post(`${API_URL}/clients`, newClient);
  },

  // Update client
  updateClient: async (id, updates) => {
    const numericId = Number(id);
    
    if (updates.email) {
      validateEmail(updates.email);
    }

    // Get current client data
    const currentClient = await get(`${API_URL}/clients/${numericId}`);

    const updatedClient = {
      ...currentClient,
      ...updates,
      lastActivity: getCurrentDate()
    };

    return put(`${API_URL}/clients/${numericId}`, updatedClient);
  },

  // Delete client
  deleteClient: async (id) => {
    const numericId = Number(id);
    return del(`${API_URL}/clients/${numericId}`);
  },

  // Get client compliance overview
  getClientCompliance: async (id) => {
    const numericId = Number(id);
    const client = await get(`${API_URL}/clients/${numericId}`);
    
    return {
      clientId: numericId,
      overallScore: client.complianceScore,
      lastUpdated: client.lastActivity,
      frameworks: {
        nist: 85,
        hipaa: 90,
        pci: 88
      }
    };
  },

  // Department Management
  getDepartments: async (clientId) => {
    const numericClientId = Number(clientId);
    return get(`${API_URL}/departments`, { clientId: numericClientId });
  },

  createDepartment: async (clientId, departmentData) => {
    validateRequired(departmentData, ['name', 'head', 'headTitle']);

    const newDepartment = {
      clientId: Number(clientId),
      ...departmentData,
      employeeCount: departmentData.employeeCount || 0,
      positions: departmentData.positions || [],
      lastUpdated: getCurrentDate()
    };

    // Ensure positions have proper structure
    if (newDepartment.positions.length > 0) {
      newDepartment.positions = newDepartment.positions.map((position, index) => ({
        id: position.id || index + 1,
        name: position.name
      }));
    }

    return post(`${API_URL}/departments`, newDepartment);
  },

  updateDepartment: async (clientId, departmentId, updates) => {
    const numericClientId = Number(clientId);
    const numericDepartmentId = Number(departmentId);

    // Get current department data
    const currentDepartment = await get(`${API_URL}/departments/${numericDepartmentId}`);

    // Verify department belongs to client
    if (currentDepartment.clientId !== numericClientId) {
      throw new ApiError('Department not found', 404);
    }

    // Handle positions update
    let positions = currentDepartment.positions;
    if (updates.positions) {
      positions = updates.positions.map((position, index) => ({
        id: position.id || index + 1,
        name: position.name
      }));
    }

    const updatedDepartment = {
      ...currentDepartment,
      ...updates,
      positions,
      clientId: numericClientId,
      lastUpdated: getCurrentDate()
    };

    return put(`${API_URL}/departments/${numericDepartmentId}`, updatedDepartment);
  },

  deleteDepartment: async (clientId, departmentId) => {
    const numericClientId = Number(clientId);
    const numericDepartmentId = Number(departmentId);

    // Verify department belongs to client before deletion
    const department = await get(`${API_URL}/departments/${numericDepartmentId}`);
    if (department.clientId !== numericClientId) {
      throw new ApiError('Department not found', 404);
    }

    return del(`${API_URL}/departments/${numericDepartmentId}`);
  },

  // Document Management
  getDocumentCategories: async () => {
    return get(`${API_URL}/documentCategories`);
  },

  getDocumentTypes: async () => {
    return get(`${API_URL}/documentTypes`);
  },

  getCompanyDocuments: async (clientId) => {
    const numericClientId = Number(clientId);
    return get(`${API_URL}/documents`, { clientId: numericClientId });
  },

  uploadDocument: async (clientId, formData) => {
    const file = formData.get('file');
    if (!file) {
      throw new ApiError('No file provided', 400);
    }

    const fileType = file.name.split('.').pop().toUpperCase();
    const documentTypes = await get(`${API_URL}/documentTypes`);
    const validTypes = documentTypes.map(type => type.name);
    
    if (!validTypes.includes(fileType)) {
      throw new ApiError('Unsupported file type', 400);
    }

    const newDocument = {
      clientId: Number(clientId),
      name: file.name,
      type: fileType,
      lastUpdated: getCurrentDate(),
      category: formData.get('category') || 'General',
      size: file.size,
      uploadedBy: 'Current User' // This should be replaced with actual user info from auth context
    };

    return post(`${API_URL}/documents`, newDocument);
  },

  downloadDocument: async (clientId, documentId) => {
    const numericClientId = Number(clientId);
    const numericDocumentId = Number(documentId);

    // Verify document exists and belongs to client
    const document = await get(`${API_URL}/documents/${numericDocumentId}`);
    if (document.clientId !== numericClientId) {
      throw new ApiError('Document not found', 404);
    }

    // In a real implementation, this would handle file download
    return { success: true, message: 'Document download initiated' };
  },

  deleteDocument: async (clientId, documentId) => {
    const numericClientId = Number(clientId);
    const numericDocumentId = Number(documentId);

    // Verify document belongs to client before deletion
    const document = await get(`${API_URL}/documents/${numericDocumentId}`);
    if (document.clientId !== numericClientId) {
      throw new ApiError('Document not found', 404);
    }

    return del(`${API_URL}/documents/${numericDocumentId}`);
  }
};

export default clientApi;