/* eslint-disable no-unused-vars */
// src/services/api/system/SystemApi.js
import { BaseApiService } from '../BaseApiService';
import { validateRequired, get, post, put } from '../../utils/apiHelpers';
import { IS_MOCK } from '../../config';

// Re-export enums for backward compatibility
export const SystemStatus = {
  DRAFT: 'DRAFT',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
};

export const ATOStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  EXPIRED: 'EXPIRED'
};

export const SecurityLevel = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high'
};

export const InformationLevel = {
  PUBLIC: 'public',
  INTERNAL: 'internal',
  CONFIDENTIAL: 'confidential',
  RESTRICTED: 'restricted'
};

export const SystemCategory = {
  MISSION_CRITICAL: 'Mission Critical',
  BUSINESS_CRITICAL: 'Business Critical',
  BUSINESS_OPERATIONAL: 'Business Operational',
  BUSINESS_SUPPORT: 'Business Support'
};

class SystemApi extends BaseApiService {
  constructor() {
    super('/systems', 'systems');
  }

  // Get all systems for a client
  async getSystems(clientId) {
    validateRequired({ clientId }, ['clientId']);
    return this.getAll({ clientId: Number(clientId) });
  }

  // Get a single system
  async getSystem(clientId, systemId) {
    validateRequired({ clientId, systemId }, ['clientId', 'systemId']);
    
    try {
      // Get base system data
      const system = await this.getById(systemId);
      
      // Get authorization data
      const authResponse = await get(`${this.baseUrl}/authorization/${clientId}/${systemId}`);
      
      // Combine system and authorization data
      return {
        ...system,
        phases: {
          ...system.phases,
          authorization: authResponse
        }
      };
    } catch (error) {
      console.error('Error fetching system:', error);
      throw error;
    }
  }

  // Create a new POAM item
  async createPOAMItem(clientId, systemId, poamData) {
    validateRequired({ clientId, systemId }, ['clientId', 'systemId']);
    validateRequired(poamData, ['title', 'description', 'severity']);
    
    return post(`${this.baseUrl}/authorization/${clientId}/${systemId}/poam`, {
      ...poamData,
      status: 'OPEN',
      dateCreated: new Date().toISOString().split('T')[0]
    });
  }

  // Update authorization package
  async updateAuthorizationPackage(clientId, systemId, packageData) {
    validateRequired({ clientId, systemId }, ['clientId', 'systemId']);
    
    return put(`${this.baseUrl}/authorization/${clientId}/${systemId}/package`, packageData);
  }

  // Update authorization decision
  async updateAuthorizationDecision(clientId, systemId, decisionData) {
    validateRequired({ clientId, systemId }, ['clientId', 'systemId']);
    
    return put(`${this.baseUrl}/authorization/${clientId}/${systemId}/decision`, decisionData);
  }

  // Validate authorization package
  async validateAuthorizationPackage(clientId, systemId) {
    validateRequired({ clientId, systemId }, ['clientId', 'systemId']);
    
    if (IS_MOCK) {
      // Return mock validation results
      return {
        status: 'VALIDATED',
        timestamp: new Date().toISOString().split('T')[0],
        findings: [],
        recommendations: [
          'Ensure all POA&M items have detailed remediation plans',
          'Update system boundary documentation with network diagrams',
          'Include detailed testing results in security assessment report'
        ]
      };
    }
    
    return put(`${this.baseUrl}/authorization/${clientId}/${systemId}/validate`, {});
  }

  // Get system types
  async getSystemTypes() {
    if (IS_MOCK) {
      return ['Cloud', 'On-Premise', 'Hybrid', 'SaaS', 'PaaS', 'IaaS'];
    }
    const data = await get(`${this.baseUrl}/system-types`);
    return data.map(type => type.name);
  }

  // Get network types
  async getNetworkTypes() {
    if (IS_MOCK) {
      return ['LAN', 'WAN', 'VPN', 'Internet', 'Intranet', 'Extranet'];
    }
    const data = await get(`${this.baseUrl}/network-types`);
    return data.map(type => type.name);
  }

  // Get component types
  async getComponentTypes() {
    if (IS_MOCK) {
      return ['Server', 'Database', 'Application', 'Network Device', 'Security Device', 'Endpoint'];
    }
    const data = await get(`${this.baseUrl}/component-types`);
    return data.map(type => type.name);
  }

  // Get procedure types
  async getProcedureTypes() {
    if (IS_MOCK) {
      return ['Backup', 'Recovery', 'Incident Response', 'Change Management', 'Access Control'];
    }
    const data = await get(`${this.baseUrl}/procedure-types`);
    return data.map(type => type.name);
  }

  // Get common ports
  async getCommonPorts() {
    if (IS_MOCK) {
      return [
        { port: 80, service: 'HTTP' },
        { port: 443, service: 'HTTPS' },
        { port: 22, service: 'SSH' },
        { port: 21, service: 'FTP' },
        { port: 25, service: 'SMTP' },
        { port: 3306, service: 'MySQL' }
      ];
    }
    return get(`${this.baseUrl}/common-ports`);
  }

  // Get system statuses
  async getSystemStatuses() {
    if (IS_MOCK) {
      return Object.values(SystemStatus);
    }
    const data = await get(`${this.baseUrl}/system-statuses`);
    return data.map(status => status.name);
  }

  // Get ATO statuses
  async getATOStatuses() {
    if (IS_MOCK) {
      return Object.values(ATOStatus);
    }
    const data = await get(`${this.baseUrl}/ato-statuses`);
    return data.map(status => status.name);
  }

  // Get security levels
  async getSecurityLevels() {
    if (IS_MOCK) {
      return Object.values(SecurityLevel);
    }
    const data = await get(`${this.baseUrl}/security-levels`);
    return data.map(level => level.name);
  }

  // Get information levels
  async getInformationLevels() {
    if (IS_MOCK) {
      return Object.values(InformationLevel);
    }
    const data = await get(`${this.baseUrl}/information-levels`);
    return data.map(level => level.name);
  }

  // Get system categories
  async getSystemCategories() {
    if (IS_MOCK) {
      return Object.values(SystemCategory);
    }
    const data = await get(`${this.baseUrl}/system-categories`);
    return data.map(category => category.name);
  }
}

export default new SystemApi();