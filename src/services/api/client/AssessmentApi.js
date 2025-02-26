const API_URL = 'http://localhost:3001';

const handleError = (error) => {
  console.error('API Error:', error);
  throw error;
};

const assessmentApi = {
  // Assessment Plan APIs
  getAssessmentPlan: async (clientId, systemId) => {
    try {
      const response = await fetch(
        `${API_URL}/assessmentPlans?clientId=${clientId}&systemId=${systemId}`
      );
      if (!response.ok) throw new Error('Failed to fetch assessment plan');
      const plans = await response.json();
      return plans[0]; // Return the first matching plan
    } catch (error) {
      return handleError(error);
    }
  },

  updateAssessmentPlan: async (clientId, systemId, planData) => {
    try {
      const response = await fetch(
        `${API_URL}/assessmentPlans/${planData.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...planData,
            updatedAt: new Date().toISOString()
          }),
        }
      );
      if (!response.ok) throw new Error('Failed to update assessment plan');
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  // Security Testing APIs
  getScanResults: async (clientId, systemId) => {
    try {
      const response = await fetch(
        `${API_URL}/scanResults?clientId=${clientId}&systemId=${systemId}`
      );
      if (!response.ok) throw new Error('Failed to fetch scan results');
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  uploadScanResults: async (clientId, systemId, formData) => {
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

      const response = await fetch(
        `${API_URL}/scanResults`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newScan)
        }
      );
      if (!response.ok) throw new Error('Failed to upload scan results');
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  deleteScanResult: async (clientId, systemId, scanId) => {
    try {
      const response = await fetch(
        `${API_URL}/scanResults/${scanId}`,
        {
          method: 'DELETE'
        }
      );
      if (!response.ok) throw new Error('Failed to delete scan result');
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  // Control Assessment APIs
  getControlAssessments: async (clientId, systemId) => {
    try {
      const response = await fetch(
        `${API_URL}/controls?clientId=${clientId}&systemId=${systemId}`
      );
      if (!response.ok) throw new Error('Failed to fetch control assessments');
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  updateControlAssessment: async (clientId, systemId, controlData) => {
    try {
      const response = await fetch(
        `${API_URL}/controls/${controlData.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...controlData,
            updatedAt: new Date().toISOString()
          }),
        }
      );
      if (!response.ok) throw new Error('Failed to update control assessment');
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  // Documentation Review APIs
  getDocumentationReview: async (clientId, systemId) => {
    try {
      const response = await fetch(
        `${API_URL}/assessmentDocuments?clientId=${clientId}&systemId=${systemId}`
      );
      if (!response.ok) throw new Error('Failed to fetch documentation review');
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  updateDocumentReview: async (clientId, systemId, documentData) => {
    try {
      const response = await fetch(
        `${API_URL}/assessmentDocuments/${documentData.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...documentData,
            updatedAt: new Date().toISOString()
          }),
        }
      );
      if (!response.ok) throw new Error('Failed to update document review');
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  getDocumentDownloadUrl: async (clientId, systemId, documentId) => {
    try {
      const response = await fetch(
        `${API_URL}/assessmentDocuments/${documentId}`
      );
      if (!response.ok) throw new Error('Failed to get document download URL');
      const doc = await response.json();
      return doc.downloadUrl || '#';
    } catch (error) {
      return handleError(error);
    }
  },
};

export default assessmentApi;