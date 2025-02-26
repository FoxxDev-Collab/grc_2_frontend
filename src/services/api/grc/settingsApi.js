import { delay, ApiError } from '../../api/BaseApiService';

// In-memory storage for settings
let systemSettings = {
  s3: {
    enabled: false,
    region: '',
    accessKeyId: '',
    secretAccessKey: '',
    defaultBucket: '',
    buckets: []
  }
};

const settingsApi = {
  // Get all system settings
  getSettings: async () => {
    await delay(300);
    return { ...systemSettings };
  },

  // Update S3 configuration
  updateS3Config: async (config) => {
    await delay(500);
    
    // Validate required fields
    const requiredFields = ['region', 'accessKeyId', 'secretAccessKey'];
    for (const field of requiredFields) {
      if (!config[field]) {
        throw new ApiError(`${field} is required`, 400);
      }
    }

    // In a real implementation, we would validate the credentials here
    // For now, we'll simulate a connection test
    await delay(1000); // Simulate AWS SDK validation

    systemSettings.s3 = {
      ...systemSettings.s3,
      ...config,
      enabled: true
    };

    return { 
      success: true, 
      message: 'S3 configuration updated successfully',
      config: { ...systemSettings.s3 }
    };
  },

  // Test S3 connection
  testS3Connection: async () => {
    await delay(800);
    
    if (!systemSettings.s3.enabled) {
      throw new ApiError('S3 is not configured', 400);
    }

    // In a real implementation, we would test the connection here
    // For now, we'll simulate a successful connection
    return {
      success: true,
      message: 'Successfully connected to S3'
    };
  },

  // List S3 buckets
  listS3Buckets: async () => {
    await delay(500);

    if (!systemSettings.s3.enabled) {
      throw new ApiError('S3 is not configured', 400);
    }

    // In a real implementation, we would fetch buckets from AWS
    // For now, return mock buckets
    return [
      { name: 'grc-documents', region: systemSettings.s3.region, createdAt: '2024-01-01T00:00:00Z' },
      { name: 'grc-backups', region: systemSettings.s3.region, createdAt: '2024-01-01T00:00:00Z' }
    ];
  },

  // Create new S3 bucket
  createS3Bucket: async (bucketName) => {
    await delay(800);

    if (!systemSettings.s3.enabled) {
      throw new ApiError('S3 is not configured', 400);
    }

    if (!bucketName) {
      throw new ApiError('Bucket name is required', 400);
    }

    // Validate bucket name (simplified AWS S3 bucket naming rules)
    const bucketNameRegex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
    if (!bucketNameRegex.test(bucketName)) {
      throw new ApiError('Invalid bucket name. Must be 3-63 characters, lowercase, numbers, hyphens', 400);
    }

    // In a real implementation, we would create the bucket in AWS
    const newBucket = {
      name: bucketName,
      region: systemSettings.s3.region,
      createdAt: new Date().toISOString()
    };

    systemSettings.s3.buckets.push(newBucket);

    return {
      success: true,
      message: 'Bucket created successfully',
      bucket: { ...newBucket }
    };
  },

  // Set default S3 bucket
  setDefaultBucket: async (bucketName) => {
    await delay(300);

    if (!systemSettings.s3.enabled) {
      throw new ApiError('S3 is not configured', 400);
    }

    if (!bucketName) {
      throw new ApiError('Bucket name is required', 400);
    }

    // In a real implementation, we would verify the bucket exists in AWS
    systemSettings.s3.defaultBucket = bucketName;

    return {
      success: true,
      message: 'Default bucket updated successfully',
      defaultBucket: bucketName
    };
  }
};

export default settingsApi;