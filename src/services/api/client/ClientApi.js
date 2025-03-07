/* eslint-disable no-unused-vars */
// src/services/api/client/ClientApi.js
import { BaseApiService } from '../BaseApiService';
import { validateRequired, validateEmail, get, post, put, del } from '../../utils/apiHelpers';
import { IS_MOCK } from '../../config';

// Helper function to get current date in ISO format
const getCurrentDate = () => new Date().toISOString();

class ClientApi extends BaseApiService {
  constructor() {
    // Using the same pattern as AuthApi - BaseApiService(endpoint, serviceName)
    super('/clients', 'clients');
    
    // We don't rely on this.endpoint for building paths
    // Instead we use explicit paths in each method
  }

  // Get all clients
  async getClients() {
    try {
      // Use the full path including the leading slash
      // The endpoint property already includes the leading slash from BaseApiService
      return await get('/clients');
    } catch (error) {
      console.error('Get clients error:', error);
      throw error;
    }
  }

  // Get client by ID
  async getClient(id) {
    const numericId = Number(id);
    try {
      // Use explicit path pattern
      return await get(`/clients/${numericId}`);
    } catch (error) {
      console.error('Get client error:', error);
      throw error;
    }
  }

  // Create new client
  async createClient(clientData) {
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

    try {
      // Use explicit path
      return await post('/clients', newClient);
    } catch (error) {
      console.error('Create client error:', error);
      throw error;
    }
  }

  // Update client
  async updateClient(id, updates) {
    const numericId = Number(id);
    
    if (updates.email) {
      validateEmail(updates.email);
    }

    try {
      // Get current client data
      const currentClient = await this.getClient(numericId);

      const updatedClient = {
        ...currentClient,
        ...updates,
        lastActivity: getCurrentDate()
      };

      return await put(`/clients/${numericId}`, updatedClient);
    } catch (error) {
      console.error('Update client error:', error);
      throw error;
    }
  }

  // Delete client
  async deleteClient(id) {
    const numericId = Number(id);
    try {
      await del(`/clients/${numericId}`);
      return { success: true };
    } catch (error) {
      console.error('Delete client error:', error);
      throw error;
    }
  }

  // Get client compliance overview
  async getClientCompliance(id) {
    const numericId = Number(id);
    
    try {
      const client = await this.getClient(numericId);
      
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
    } catch (error) {
      console.error('Get client compliance error:', error);
      throw error;
    }
  }

  // Get available industries
  async getIndustries() {
    if (IS_MOCK) {
      return [
        'Technology',
        'Healthcare',
        'Finance',
        'Manufacturing',
        'Retail',
        'Education',
        'Government',
        'Non-profit',
        'Other'
      ];
    }
    
    try {
      return await get('/clients/industries');
    } catch (error) {
      console.error('Get industries error:', error);
      throw error;
    }
  }

  // Get available client sizes
  async getClientSizes() {
    if (IS_MOCK) {
      return [
        'Small (1-50 employees)',
        'Medium (51-500 employees)',
        'Large (501-5000 employees)',
        'Enterprise (5000+ employees)'
      ];
    }
    
    try {
      return await get('/clients/clientSizes');
    } catch (error) {
      console.error('Get client sizes error:', error);
      throw error;
    }
  }

  // Get available client statuses
  async getClientStatuses() {
    if (IS_MOCK) {
      return [
        'active',
        'inactive',
        'pending',
        'suspended'
      ];
    }
    
    try {
      return await get('/clients/clientStatuses');
    } catch (error) {
      console.error('Get client statuses error:', error);
      throw error;
    }
  }

  // Department Management
  async getDepartments(clientId) {
    const numericClientId = Number(clientId);
    
    try {
      return await get(`/departments?clientId=${numericClientId}`);
    } catch (error) {
      console.error('Get departments error:', error);
      throw error;
    }
  }

  async createDepartment(clientId, departmentData) {
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

    try {
      return await post('/departments', newDepartment);
    } catch (error) {
      console.error('Create department error:', error);
      throw error;
    }
  }

  async updateDepartment(clientId, departmentId, updates) {
    const numericClientId = Number(clientId);
    const numericDepartmentId = Number(departmentId);

    try {
      // Get current department data
      const currentDepartment = await get(`/departments/${numericDepartmentId}`);

      // Verify department belongs to client
      if (currentDepartment.clientId !== numericClientId) {
        throw new Error('Department not found');
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

      return await put(`/departments/${numericDepartmentId}`, updatedDepartment);
    } catch (error) {
      console.error('Update department error:', error);
      throw error;
    }
  }

  async deleteDepartment(clientId, departmentId) {
    const numericClientId = Number(clientId);
    const numericDepartmentId = Number(departmentId);

    try {
      // Verify department belongs to client before deletion
      const department = await get(`/departments/${numericDepartmentId}`);
      
      if (department.clientId !== numericClientId) {
        throw new Error('Department not found');
      }

      await del(`/departments/${numericDepartmentId}`);
      return { success: true };
    } catch (error) {
      console.error('Delete department error:', error);
      throw error;
    }
  }

  // Document Management
  async getDocumentCategories() {
    if (IS_MOCK) {
      return [
        'General',
        'Policies',
        'Procedures',
        'Contracts',
        'Reports',
        'Compliance',
        'Security',
        'Other'
      ];
    }
    
    try {
      return await get('/clients/documentCategories');
    } catch (error) {
      console.error('Get document categories error:', error);
      throw error;
    }
  }

  async getDocumentTypes() {
    if (IS_MOCK) {
      return [
        'PDF',
        'DOCX',
        'XLSX',
        'PPTX',
        'TXT',
        'CSV',
        'ZIP',
        'JPG',
        'PNG'
      ];
    }
    
    try {
      return await get('/clients/documentTypes');
    } catch (error) {
      console.error('Get document types error:', error);
      throw error;
    }
  }

  async getCompanyDocuments(clientId) {
    const numericClientId = Number(clientId);
    
    try {
      return await get(`/documents?clientId=${numericClientId}`);
    } catch (error) {
      console.error('Get company documents error:', error);
      throw error;
    }
  }

  async uploadDocument(clientId, formData) {
    const file = formData.get('file');
    if (!file) {
      throw new Error('No file provided');
    }

    const fileType = file.name.split('.').pop().toUpperCase();
    const documentTypes = await this.getDocumentTypes();
    const validTypes = Array.isArray(documentTypes) ? documentTypes : documentTypes.map(type => type.name);
    
    if (!validTypes.includes(fileType)) {
      throw new Error('Unsupported file type');
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

    try {
      return await post('/documents', newDocument);
    } catch (error) {
      console.error('Upload document error:', error);
      throw error;
    }
  }

  async downloadDocument(clientId, documentId) {
    const numericClientId = Number(clientId);
    const numericDocumentId = Number(documentId);

    try {
      // Verify document exists and belongs to client
      const document = await get(`/documents/${numericDocumentId}`);
      
      if (document.clientId !== numericClientId) {
        throw new Error('Document not found');
      }

      // In a real implementation, this would handle file download
      return { success: true, message: 'Document download initiated' };
    } catch (error) {
      console.error('Download document error:', error);
      throw error;
    }
  }

  async deleteDocument(clientId, documentId) {
    const numericClientId = Number(clientId);
    const numericDocumentId = Number(documentId);

    try {
      // Verify document belongs to client before deletion
      const document = await get(`/documents/${numericDocumentId}`);
      
      if (document.clientId !== numericClientId) {
        throw new Error('Document not found');
      }

      await del(`/documents/${numericDocumentId}`);
      return { success: true };
    } catch (error) {
      console.error('Delete document error:', error);
      throw error;
    }
  }
}

export default new ClientApi();