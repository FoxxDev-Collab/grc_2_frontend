import { validateRequired } from '../apiHelpers';

const API_URL = 'http://localhost:3001';

export const securityAssessmentsApi = {
  // Get all assessments for a client
  getAssessments: async (clientId, options = {}) => {
    validateRequired({ clientId }, ['clientId']);
    
    const response = await fetch(`${API_URL}/assessmentHistory?clientId=${clientId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assessments');
    }
    let assessments = await response.json();

    // Apply filters
    if (options.status && options.status !== 'all') {
      assessments = assessments.filter(a => a.status === options.status);
    }
    if (options.type && options.type !== 'all') {
      assessments = assessments.filter(a => a.type === options.type);
    }
    if (options.dateRange) {
      const { start, end } = options.dateRange;
      assessments = assessments.filter(a => {
        const assessmentDate = new Date(a.date);
        return assessmentDate >= new Date(start) && assessmentDate <= new Date(end);
      });
    }

    // Apply sorting
    if (options.sortBy) {
      assessments.sort((a, b) => {
        switch (options.sortBy) {
          case 'date':
            return new Date(b.date) - new Date(a.date);
          case 'score':
            return (b.score || 0) - (a.score || 0);
          default:
            return 0;
        }
      });
    }

    return assessments;
  },

  // Get assessment by ID
  getAssessment: async (assessmentId) => {
    validateRequired({ assessmentId }, ['assessmentId']);
    const response = await fetch(`${API_URL}/assessmentHistory/${assessmentId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assessment');
    }
    return response.json();
  },

  // Get findings for an assessment
  getFindings: async (assessmentId) => {
    validateRequired({ assessmentId }, ['assessmentId']);
    const response = await fetch(`${API_URL}/assessmentHistory/${assessmentId}/generatedFindings`);
    if (!response.ok) {
      throw new Error('Failed to fetch findings');
    }
    return response.json();
  },

  // Submit a new assessment
  submitAssessment: async (clientId, assessmentData) => {
    validateRequired(assessmentData, ['type', 'name', 'answers']);
    
    const response = await fetch(`${API_URL}/assessmentHistory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: Number(clientId),
        date: new Date().toISOString(),
        status: 'pending_review',
        ...assessmentData
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit assessment');
    }

    return response.json();
  },

  // Update assessment status
  updateAssessmentStatus: async (assessmentId, status) => {
    validateRequired({ assessmentId, status }, ['assessmentId', 'status']);
    
    const response = await fetch(`${API_URL}/assessmentHistory/${assessmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        lastUpdated: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update assessment status');
    }

    return response.json();
  },

  // Review assessment
  reviewAssessment: async (assessmentId, reviewData) => {
    validateRequired(reviewData, ['reviewer', 'status']);
    
    const response = await fetch(`${API_URL}/assessmentHistory/${assessmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer: reviewData.reviewer,
        status: reviewData.status,
        reviewNotes: reviewData.notes,
        reviewDate: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to review assessment');
    }

    return response.json();
  }
};

export default securityAssessmentsApi;