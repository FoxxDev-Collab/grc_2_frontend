// src/services/api/client/AssetManagementApi.js
import { BaseApiService } from '../BaseApiService';
import { validateRequired } from '../../utils/apiHelpers';
import { IS_MOCK } from '../../config';

// Asset types enum
export const AssetType = {
  LAPTOP: 'laptop',
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE_PHONE: 'mobile_phone',
  DESK_PHONE: 'desk_phone',
  NETWORK_DEVICE: 'network_device',
  SERVER: 'server',
  PRINTER: 'printer',
  OTHER: 'other'
};

// Asset status enum
export const AssetStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
  DISPOSED: 'disposed',
  LOST: 'lost',
  STOLEN: 'stolen'
};

class AssetManagementApi extends BaseApiService {
  constructor() {
    super('/assets', 'assets');
  }

  // Get all assets for a client
  async getAssets(clientId, queryParams = {}) {
    validateRequired({ clientId }, ['clientId']);
    return this.getAll({ 
      clientId: Number(clientId),
      ...queryParams 
    });
  }

  // Get a single asset
  async getAsset(clientId, assetId) {
    validateRequired({ clientId, assetId }, ['clientId', 'assetId']);
    return this.getById(assetId);
  }

  // Create a new asset
  async createAsset(clientId, assetData) {
    validateRequired({ clientId }, ['clientId']);
    validateRequired(assetData, ['type', 'name', 'model', 'serialNumber']);
    
    // Prepare the asset data with client ID
    const newAssetData = {
      ...assetData,
      clientId: Number(clientId),
      status: assetData.status || AssetStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return this.create(newAssetData);
  }

  // Update an existing asset
  async updateAsset(clientId, assetId, assetData) {
    validateRequired({ clientId, assetId }, ['clientId', 'assetId']);
    
    // Prepare the update data
    const updateData = {
      ...assetData,
      clientId: Number(clientId),
      updatedAt: new Date().toISOString()
    };
    
    return this.update(assetId, updateData);
  }

  // Delete an asset
  async deleteAsset(clientId, assetId) {
    validateRequired({ clientId, assetId }, ['clientId', 'assetId']);
    return this.delete(assetId);
  }

  // Get asset types
  async getAssetTypes() {
    if (IS_MOCK) {
      return Object.entries(AssetType).map(([key, value]) => ({
        id: value,
        name: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
      }));
    }
    
    return this.executeRequest(
      () => this.get(`${this.basePath}/types`),
      'retrieval',
      `${this.basePath}/types`
    );
  }

  // Get asset statuses
  async getAssetStatuses() {
    if (IS_MOCK) {
      return Object.entries(AssetStatus).map(([key, value]) => ({
        id: value,
        name: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
      }));
    }
    
    return this.executeRequest(
      () => this.get(`${this.basePath}/statuses`),
      'retrieval',
      `${this.basePath}/statuses`
    );
  }

  // Bulk import assets
  async bulkImportAssets(clientId, assetsData) {
    validateRequired({ clientId }, ['clientId']);
    
    if (!Array.isArray(assetsData) || assetsData.length === 0) {
      throw new Error('Assets data must be a non-empty array');
    }
    
    // Prepare the assets data with client ID and timestamps
    const preparedAssetsData = assetsData.map(asset => ({
      ...asset,
      clientId: Number(clientId),
      status: asset.status || AssetStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    return this.bulkOperation(preparedAssetsData, 'create');
  }

  // Generate asset report
  async generateAssetReport(clientId, reportOptions = {}) {
    validateRequired({ clientId }, ['clientId']);
    
    if (IS_MOCK) {
      // Return mock report data
      return {
        generatedAt: new Date().toISOString(),
        totalAssets: 150,
        assetsByType: {
          laptop: 45,
          desktop: 30,
          mobile_phone: 35,
          tablet: 15,
          network_device: 20,
          other: 5
        },
        assetsByStatus: {
          active: 120,
          inactive: 10,
          maintenance: 15,
          disposed: 5
        },
        assetsNearingEndOfLife: 12,
        assetsNearingEndOfSupport: 18
      };
    }
    
    return this.executeRequest(
      () => this.post(`${this.basePath}/reports`, { clientId: Number(clientId), ...reportOptions }),
      'report generation',
      `${this.basePath}/reports`
    );
  }
}

export default new AssetManagementApi();