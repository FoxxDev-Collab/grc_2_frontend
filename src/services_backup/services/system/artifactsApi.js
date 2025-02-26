import { validateRequired, ApiError } from '../apiHelpers';

const API_URL = 'http://localhost:3001';

export const artifactsApi = {
  // Get all artifacts
  getAllArtifacts: async () => {
    const response = await fetch(`${API_URL}/artifacts`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch artifacts', response.status);
    }
    return await response.json();
  },

  // Get artifact by ID
  getArtifactById: async (id) => {
    const response = await fetch(`${API_URL}/artifacts/${id}`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch artifact', response.status);
    }
    return await response.json();
  },

  // Create new artifact
  createArtifact: async (artifactData) => {
    validateRequired(artifactData, ['name', 'type']);
    
    const response = await fetch(`${API_URL}/artifacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...artifactData,
        uploadDate: new Date().toISOString()
      }),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to create artifact', response.status);
    }
    
    return await response.json();
  },

  // Update artifact
  updateArtifact: async (id, updateData) => {
    const response = await fetch(`${API_URL}/artifacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to update artifact', response.status);
    }
    
    return await response.json();
  },

  // Delete artifact
  deleteArtifact: async (id) => {
    const response = await fetch(`${API_URL}/artifacts/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new ApiError('Failed to delete artifact', response.status);
    }
    
    return await response.json();
  },

  // Get artifact types
  getArtifactTypes: async () => {
    const response = await fetch(`${API_URL}/artifactTypes`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch artifact types', response.status);
    }
    const data = await response.json();
    return data.artifactTypes.map(type => type.name);
  },

  // Upload artifact file (mock implementation)
  uploadArtifactFile: async (file) => {
    // Simulate file upload and return a mock URL
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      fileUrl: `/artifacts/${file.name}`,
      fileType: file.type,
      size: file.size
    };
  }
};

export default artifactsApi;