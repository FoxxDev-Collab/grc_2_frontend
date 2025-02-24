import { get, post, put, del } from '../apiHelpers';

export const artifactsApi = {
  // Get all artifacts
  getAllArtifacts: async () => {
    return get('/artifacts');
  },

  // Get artifact by ID
  getArtifactById: async (id) => {
    return get(`/artifacts/${id}`);
  },

  // Create new artifact
  createArtifact: async (artifactData) => {
    return post('/artifacts', {
      ...artifactData,
      uploadDate: new Date().toISOString()
    });
  },

  // Update artifact
  updateArtifact: async (id, updateData) => {
    return put(`/artifacts/${id}`, updateData);
  },

  // Delete artifact
  deleteArtifact: async (id) => {
    return del(`/artifacts/${id}`);
  },

  // Get artifact types
  getArtifactTypes: async () => {
    const response = await get('/artifactTypes');
    return response.artifactTypes.map(type => type.name);
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