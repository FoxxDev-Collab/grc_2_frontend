/* eslint-disable no-unused-vars */
// src/services/api/client/ClientApi.js
import { validateRequired, validateEmail, get, post, put, del } from '../../utils/apiHelpers';
import { IS_MOCK } from '../../config';

// Define direct API URL constant (matching AuditApi.js approach)
const API_URL = 'http://localhost:3001';

// Helper function to get current date in ISO format
const getCurrentDate = () => new Date().toISOString();

class ClientApi {
  constructor() {
    this.endpoint = '/clients';
  }

  // Get all clients
  async getClients() {
    try {
      const response = await fetch(`${API_URL}${this.endpoint}`);
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }
  }

  // Get client by ID
  async getClient(id) {
    const numericId = Number(id);
    try {
      const response = await fetch(`${API_URL}${this.endpoint}/${numericId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch client');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch client: ${error.message}`);
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
      const response = await fetch(`${API_URL}${this.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create client');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to create client: ${error.message}`);
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

      const response = await fetch(`${API_URL}${this.endpoint}/${numericId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClient)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update client');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to update client: ${error.message}`);
    }
  }

  // Delete client
  async deleteClient(id) {
    const numericId = Number(id);
    try {
      const response = await fetch(`${API_URL}${this.endpoint}/${numericId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete client');
      }
      
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete client: ${error.message}`);
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
      throw new Error(`Failed to get client compliance: ${error.message}`);
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
      const response = await fetch(`${API_URL}${this.endpoint}/industries`);
      if (!response.ok) {
        throw new Error('Failed to fetch industries');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch industries: ${error.message}`);
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
      const response = await fetch(`${API_URL}${this.endpoint}/clientSizes`);
      if (!response.ok) {
        throw new Error('Failed to fetch client sizes');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch client sizes: ${error.message}`);
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
      const response = await fetch(`${API_URL}${this.endpoint}/clientStatuses`);
      if (!response.ok) {
        throw new Error('Failed to fetch client statuses');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch client statuses: ${error.message}`);
    }
  }

  // Department Management
  async getDepartments(clientId) {
    const numericClientId = Number(clientId);
    
    try {
      const response = await fetch(`${API_URL}${this.endpoint}/departments?clientId=${numericClientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch departments: ${error.message}`);
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
      const response = await fetch(`${API_URL}${this.endpoint}/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDepartment)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create department');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to create department: ${error.message}`);
    }
  }

  async updateDepartment(clientId, departmentId, updates) {
    const numericClientId = Number(clientId);
    const numericDepartmentId = Number(departmentId);

    try {
      // Get current department data
      const response = await fetch(`${API_URL}${this.endpoint}/departments/${numericDepartmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch department');
      }
      const currentDepartment = await response.json();

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

      const updateResponse = await fetch(`${API_URL}${this.endpoint}/departments/${numericDepartmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDepartment)
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update department');
      }
      
      return await updateResponse.json();
    } catch (error) {
      throw new Error(`Failed to update department: ${error.message}`);
    }
  }

  async deleteDepartment(clientId, departmentId) {
    const numericClientId = Number(clientId);
    const numericDepartmentId = Number(departmentId);

    try {
      // Verify department belongs to client before deletion
      const response = await fetch(`${API_URL}${this.endpoint}/departments/${numericDepartmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch department');
      }
      const department = await response.json();
      
      if (department.clientId !== numericClientId) {
        throw new Error('Department not found');
      }

      const deleteResponse = await fetch(`${API_URL}${this.endpoint}/departments/${numericDepartmentId}`, {
        method: 'DELETE'
      });
      
      if (!deleteResponse.ok) {
        throw new Error('Failed to delete department');
      }
      
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete department: ${error.message}`);
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
      const response = await fetch(`${API_URL}${this.endpoint}/documentCategories`);
      if (!response.ok) {
        throw new Error('Failed to fetch document categories');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch document categories: ${error.message}`);
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
      const response = await fetch(`${API_URL}${this.endpoint}/documentTypes`);
      if (!response.ok) {
        throw new Error('Failed to fetch document types');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch document types: ${error.message}`);
    }
  }

  async getCompanyDocuments(clientId) {
    const numericClientId = Number(clientId);
    
    try {
      const response = await fetch(`${API_URL}${this.endpoint}/documents?clientId=${numericClientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch documents: ${error.message}`);
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
      const response = await fetch(`${API_URL}${this.endpoint}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDocument)
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload document');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to upload document: ${error.message}`);
    }
  }

  async downloadDocument(clientId, documentId) {
    const numericClientId = Number(clientId);
    const numericDocumentId = Number(documentId);

    try {
      // Verify document exists and belongs to client
      const response = await fetch(`${API_URL}${this.endpoint}/documents/${numericDocumentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }
      const document = await response.json();
      
      if (document.clientId !== numericClientId) {
        throw new Error('Document not found');
      }

      // In a real implementation, this would handle file download
      return { success: true, message: 'Document download initiated' };
    } catch (error) {
      throw new Error(`Failed to download document: ${error.message}`);
    }
  }

  async deleteDocument(clientId, documentId) {
    const numericClientId = Number(clientId);
    const numericDocumentId = Number(documentId);

    try {
      // Verify document belongs to client before deletion
      const response = await fetch(`${API_URL}${this.endpoint}/documents/${numericDocumentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }
      const document = await response.json();
      
      if (document.clientId !== numericClientId) {
        throw new Error('Document not found');
      }

      const deleteResponse = await fetch(`${API_URL}${this.endpoint}/documents/${numericDocumentId}`, {
        method: 'DELETE'
      });
      
      if (!deleteResponse.ok) {
        throw new Error('Failed to delete document');
      }
      
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }
}

export default new ClientApi();