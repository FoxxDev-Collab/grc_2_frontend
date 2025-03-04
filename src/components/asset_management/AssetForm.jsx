/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Alert,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AssetType, AssetStatus } from '../../services';

const AssetForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  asset, 
  assetTypes, 
  assetStatuses,
  loading,
  error 
}) => {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    model: '',
    serialNumber: '',
    location: '',
    purchaseDate: null,
    endOfLife: null,
    endOfSupport: null,
    status: AssetStatus.ACTIVE,
    notes: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  // Initialize form with asset data when editing
  useEffect(() => {
    if (asset) {
      setFormData({
        type: asset.type || '',
        name: asset.name || '',
        model: asset.model || '',
        serialNumber: asset.serialNumber || '',
        location: asset.location || '',
        purchaseDate: asset.purchaseDate ? dayjs(asset.purchaseDate) : null,
        endOfLife: asset.endOfLife ? dayjs(asset.endOfLife) : null,
        endOfSupport: asset.endOfSupport ? dayjs(asset.endOfSupport) : null,
        status: asset.status || AssetStatus.ACTIVE,
        notes: asset.notes || ''
      });
    } else {
      // Reset form when adding a new asset
      setFormData({
        type: '',
        name: '',
        model: '',
        serialNumber: '',
        location: '',
        purchaseDate: null,
        endOfLife: null,
        endOfSupport: null,
        status: AssetStatus.ACTIVE,
        notes: ''
      });
    }
    setFormErrors({});
  }, [asset, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.type) errors.type = 'Type is required';
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.model) errors.model = 'Model is required';
    if (!formData.serialNumber) errors.serialNumber = 'Serial number is required';
    
    // Validate dates
    if (formData.endOfLife && formData.purchaseDate && 
        formData.endOfLife.isBefore(formData.purchaseDate)) {
      errors.endOfLife = 'End of life date cannot be before purchase date';
    }
    
    if (formData.endOfSupport && formData.purchaseDate && 
        formData.endOfSupport.isBefore(formData.purchaseDate)) {
      errors.endOfSupport = 'End of support date cannot be before purchase date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Convert dayjs objects to ISO strings for API
      const formattedData = {
        ...formData,
        purchaseDate: formData.purchaseDate ? formData.purchaseDate.toISOString() : null,
        endOfLife: formData.endOfLife ? formData.endOfLife.toISOString() : null,
        endOfSupport: formData.endOfSupport ? formData.endOfSupport.toISOString() : null,
      };
      
      onSubmit(formattedData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {asset ? 'Edit Asset' : 'Add New Asset'}
      </DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.type}>
                <InputLabel id="asset-type-label">Asset Type *</InputLabel>
                <Select
                  labelId="asset-type-label"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Asset Type *"
                >
                  {assetTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.type && <FormHelperText>{formErrors.type}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Asset Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                placeholder="e.g., Marketing Laptop 01"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                error={!!formErrors.model}
                helperText={formErrors.model}
                placeholder="e.g., MacBook Pro 16-inch"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Serial Number"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                error={!!formErrors.serialNumber}
                helperText={formErrors.serialNumber}
                placeholder="e.g., C02ZW1ZRMD6T"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Main Office, 3rd Floor"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="asset-status-label">Status</InputLabel>
                <Select
                  labelId="asset-status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  {assetStatuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Purchase Date"
                value={formData.purchaseDate}
                onChange={(date) => handleDateChange('purchaseDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="End of Life Date"
                value={formData.endOfLife}
                onChange={(date) => handleDateChange('endOfLife', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    error: !!formErrors.endOfLife,
                    helperText: formErrors.endOfLife
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="End of Support Date"
                value={formData.endOfSupport}
                onChange={(date) => handleDateChange('endOfSupport', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    error: !!formErrors.endOfSupport,
                    helperText: formErrors.endOfSupport
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional information about this asset..."
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {asset ? 'Save Changes' : 'Add Asset'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AssetForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  asset: PropTypes.object,
  assetTypes: PropTypes.array,
  assetStatuses: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string
};

AssetForm.defaultProps = {
  asset: null,
  assetTypes: Object.entries(AssetType).map(([key, value]) => ({
    id: value,
    name: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  })),
  assetStatuses: Object.entries(AssetStatus).map(([key, value]) => ({
    id: value,
    name: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  })),
  loading: false,
  error: ''
};

export default AssetForm;