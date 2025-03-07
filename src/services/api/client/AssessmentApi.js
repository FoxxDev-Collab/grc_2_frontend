// src/services/api/assessment/AssessmentApi.js
import { BaseApiService } from '../BaseApiService';
import { get, post, patch, del } from '../../utils/apiHelpers';

class AssessmentApi extends BaseApiService {
  constructor() {
    // Using the same pattern as AuthApi - BaseApiService(endpoint, serviceName)
    super('/assessments', 'assessments');
    
    // We don't rely on this.endpoint for building paths
    // Instead we use explicit paths in each method
  }

  // Assessment Plan APIs
  async getAssessmentPlan(clientId, systemId) {
    try {
      const response = await get(`/assessmentPlans?clientId=${clientId}&systemId=${systemId}`);
      // Return the first matching plan if it exists
      return Array.isArray(response) && response.length > 0 ? response[0] : null;
    } catch (error) {
      console.error('Get assessment plan error:', error);
      throw error;
    }
  }

  async updateAssessmentPlan(clientId, systemId, planData) {
    try {
      const updatedPlan = {
        ...planData,
        updatedAt: new Date().toISOString()
      };
      
      return await patch(`/assessmentPlans/${planData.id}`, updatedPlan);
    } catch (error) {
      console.error('Update assessment plan error:', error);
      throw error;
    }
  }

  // Security Testing APIs
  async getScanResults(clientId, systemId) {
    try {
      return await get(`/scanResults?clientId=${clientId}&systemId=${systemId}`);
    } catch (error) {
      console.error('Get scan results error:', error);
      throw error;
    }
  }

  async uploadScanResults(clientId, systemId, formData) {
    try {
      const newScan = {
        id: `scan-${Date.now()}`,
        type: formData.get('type') || 'STIG Scan',
        date: new Date().toISOString(),
        findings: {
          high: parseInt(formData.get('highFindings') || '0'),
          medium: parseInt(formData.get('mediumFindings') || '0'),
          low: parseInt(formData.get('lowFindings') || '0')
        },
        status: 'Completed',
        downloadUrl: '#',
        detailsUrl: '#',
        clientId,
        systemId,
        assessmentPlanId: formData.get('assessmentPlanId'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return await post('/scanResults', newScan);
    } catch (error) {
      console.error('Upload scan results error:', error);
      throw error;
    }
  }

  async deleteScanResult(clientId, systemId, scanId) {
    try {
      await del(`/scanResults/${scanId}`);
      return { success: true };
    } catch (error) {
      console.error('Delete scan result error:', error);
      throw error;
    }
  }

  // Control Assessment APIs
  async getControlAssessments(clientId, systemId) {
    try {
      return await get(`/controls?clientId=${clientId}&systemId=${systemId}`);
    } catch (error) {
      console.error('Get control assessments error:', error);
      throw error;
    }
  }

  async updateControlAssessment(clientId, systemId, controlData) {
    try {
      const updatedControl = {
        ...controlData,
        updatedAt: new Date().toISOString()
      };
      
      return await patch(`/controls/${controlData.id}`, updatedControl);
    } catch (error) {
      console.error('Update control assessment error:', error);
      throw error;
    }
  }

  // Documentation Review APIs
  async getDocumentationReview(clientId, systemId) {
    try {
      return await get(`/assessmentDocuments?clientId=${clientId}&systemId=${systemId}`);
    } catch (error) {
      console.error('Get documentation review error:', error);
      throw error;
    }
  }

  async updateDocumentReview(clientId, systemId, documentData) {
    try {
      const updatedDocument = {
        ...documentData,
        updatedAt: new Date().toISOString()
      };
      
      return await patch(`/assessmentDocuments/${documentData.id}`, updatedDocument);
    } catch (error) {
      console.error('Update document review error:', error);
      throw error;
    }
  }

  async getDocumentDownloadUrl(clientId, systemId, documentId) {
    try {
      const doc = await get(`/assessmentDocuments/${documentId}`);
      return doc.downloadUrl || '#';
    } catch (error) {
      console.error('Get document download URL error:', error);
      throw error;
    }
  }
}

export default new AssessmentApi();