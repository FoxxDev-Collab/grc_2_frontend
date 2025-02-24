import { artifactsMockData, artifactTypes } from '../mocks/artifactsMockData';

let artifacts = [...artifactsMockData];

export const artifactsApi = {
  // Get all artifacts
  getAllArtifacts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(artifacts);
      }, 500);
    });
  },

  // Get artifact by ID
  getArtifactById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const artifact = artifacts.find(a => a.id === id);
        if (artifact) {
          resolve(artifact);
        } else {
          reject(new Error('Artifact not found'));
        }
      }, 500);
    });
  },

  // Create new artifact
  createArtifact: async (artifactData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newArtifact = {
          id: `art-${String(artifacts.length + 1).padStart(3, '0')}`,
          uploadDate: new Date().toISOString(),
          ...artifactData
        };
        artifacts.push(newArtifact);
        resolve(newArtifact);
      }, 500);
    });
  },

  // Update artifact
  updateArtifact: async (id, updateData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = artifacts.findIndex(a => a.id === id);
        if (index !== -1) {
          artifacts[index] = {
            ...artifacts[index],
            ...updateData,
            id // Ensure ID cannot be changed
          };
          resolve(artifacts[index]);
        } else {
          reject(new Error('Artifact not found'));
        }
      }, 500);
    });
  },

  // Delete artifact
  deleteArtifact: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = artifacts.findIndex(a => a.id === id);
        if (index !== -1) {
          artifacts = artifacts.filter(a => a.id !== id);
          resolve({ success: true });
        } else {
          reject(new Error('Artifact not found'));
        }
      }, 500);
    });
  },

  // Get artifact types
  getArtifactTypes: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(artifactTypes);
      }, 500);
    });
  },

  // Upload artifact file (mock implementation)
  uploadArtifactFile: async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate file upload and return a mock URL
        const mockUrl = `/artifacts/${file.name}`;
        resolve({
          fileUrl: mockUrl,
          fileType: file.type,
          size: file.size
        });
      }, 1000);
    });
  }
};

export default artifactsApi;