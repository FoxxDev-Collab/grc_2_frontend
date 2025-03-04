/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { assetManagementApi } from '../../services';
import { AssetList, AssetForm } from '../../components/asset_management';

const AssetManagementPage = () => {
  const { clientId } = useParams();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetTypes, setAssetTypes] = useState([]);
  const [assetStatuses, setAssetStatuses] = useState([]);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load assets and reference data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        // Load assets for the client
        const assetsData = await assetManagementApi.getAssets(Number(clientId));
        setAssets(assetsData);

        // Load asset types
        const typesData = await assetManagementApi.getAssetTypes();
        setAssetTypes(typesData);

        // Load asset statuses
        const statusesData = await assetManagementApi.getAssetStatuses();
        setAssetStatuses(statusesData);
      } catch (err) {
        console.error('Error loading asset data:', err);
        setError(err.message || 'Failed to load asset data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clientId]);

  const handleOpenDialog = (asset = null) => {
    setSelectedAsset(asset);
    setOpenDialog(true);
    setFormError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAsset(null);
    setFormError('');
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setFormError('');

      let updatedAsset;
      if (selectedAsset) {
        // Update existing asset
        updatedAsset = await assetManagementApi.updateAsset(
          Number(clientId),
          selectedAsset.id,
          formData
        );
        
        // Update assets list
        setAssets(prev =>
          prev.map(asset => asset.id === updatedAsset.id ? updatedAsset : asset)
        );
      } else {
        // Create new asset
        updatedAsset = await assetManagementApi.createAsset(
          Number(clientId),
          formData
        );
        
        // Add to assets list
        setAssets(prev => [...prev, updatedAsset]);
      }

      handleCloseDialog();
    } catch (err) {
      console.error('Error saving asset:', err);
      setFormError(err.message || 'Failed to save asset');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (assetId) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) {
      return;
    }

    try {
      setLoading(true);
      await assetManagementApi.deleteAsset(Number(clientId), assetId);
      
      // Remove from assets list
      setAssets(prev => prev.filter(asset => asset.id !== assetId));
      setError('');
    } catch (err) {
      console.error('Error deleting asset:', err);
      setError(err.message || 'Failed to delete asset');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    loadFilteredAssets(term);
  };

  const loadFilteredAssets = async (term) => {
    try {
      setLoading(true);
      setError('');

      // In a real implementation, this would pass the search term to the API
      // For now, we'll just filter the existing assets client-side
      if (!term) {
        const assetsData = await assetManagementApi.getAssets(Number(clientId));
        setAssets(assetsData);
      } else {
        const assetsData = await assetManagementApi.getAssets(Number(clientId));
        const filteredAssets = assetsData.filter(asset => 
          asset.name.toLowerCase().includes(term.toLowerCase()) ||
          asset.model.toLowerCase().includes(term.toLowerCase()) ||
          asset.serialNumber.toLowerCase().includes(term.toLowerCase()) ||
          (asset.location && asset.location.toLowerCase().includes(term.toLowerCase()))
        );
        setAssets(filteredAssets);
      }
    } catch (err) {
      console.error('Error searching assets:', err);
      setError(err.message || 'Failed to search assets');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Asset Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Asset
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Overview
        </Typography>
        <Typography variant="body1" paragraph>
          Manage all client assets including workstations, laptops, desktops, tablets, mobile phones, 
          desk phones, network equipment, and other valuable items. Track asset details, lifecycle information,
          and maintain accurate inventory records.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Proper asset management enhances security by maintaining accountability of all client assets.
          Regular audits and updates to this inventory help identify potential security risks and ensure
          compliance with security policies.
        </Typography>
      </Paper>

      {loading && assets.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <AssetList
          assets={assets}
          onEdit={handleOpenDialog}
          onDelete={handleDelete}
          onSearch={handleSearch}
          loading={loading}
        />
      )}

      <AssetForm
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        asset={selectedAsset}
        assetTypes={assetTypes}
        assetStatuses={assetStatuses}
        loading={formLoading}
        error={formError}
      />
    </Container>
  );
};

export default AssetManagementPage;