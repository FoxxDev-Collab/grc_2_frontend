import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  Typography,
  Grid,
  CircularProgress
} from '@mui/material';
import { systemComponentsApi } from '../services';

// Specification fields by component type
const SPEC_FIELDS = {
  PHYSICAL: [
    { key: 'manufacturer', label: 'Manufacturer', required: true },
    { key: 'model', label: 'Model', required: true },
    { key: 'cpu', label: 'CPU', required: true },
    { key: 'ram', label: 'RAM', required: true },
    { key: 'storage', label: 'Storage', required: true }
  ],
  VIRTUAL: [
    { key: 'os', label: 'Operating System', required: true },
    { key: 'vcpus', label: 'vCPUs', required: true },
    { key: 'ram', label: 'RAM', required: true },
    { key: 'storage', label: 'Storage', required: true }
  ],
  NETWORK: [
    { key: 'manufacturer', label: 'Manufacturer', required: true },
    { key: 'model', label: 'Model', required: true },
    { key: 'ports', label: 'Ports', required: true },
    { key: 'throughput', label: 'Throughput', required: true }
  ],
  SECURITY_APPLIANCE: [
    { key: 'manufacturer', label: 'Manufacturer', required: true },
    { key: 'model', label: 'Model', required: true },
    { key: 'type', label: 'Appliance Type', required: true },
    { key: 'version', label: 'Software Version', required: true }
  ]
};

export const SystemComponentForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    description: '',
    specifications: {},
    status: 'ACTIVE',
    ...initialData
  });

  const [componentTypes, setComponentTypes] = useState([]);
  const [componentStatuses, setComponentStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load component types and statuses
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [types, statuses] = await Promise.all([
          systemComponentsApi.getComponentTypes(),
          systemComponentsApi.getComponentStatuses()
        ]);
        setComponentTypes(types);
        setComponentStatuses(statuses);
      } catch (error) {
        console.error('Error loading form data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFormData();
  }, []);

  // Reset specifications when component type changes
  useEffect(() => {
    if (!initialData) {
      setFormData(prev => ({
        ...prev,
        specifications: {}
      }));
    }
  }, [formData.type, initialData]);

  const handleSpecificationChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = () => {
    if (!formData.name || !formData.type || !formData.description) {
      return false;
    }

    const requiredSpecs = SPEC_FIELDS[formData.type] || [];
    return requiredSpecs.every(field => 
      formData.specifications[field.key] && 
      formData.specifications[field.key].trim() !== ''
    );
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography variant="h6" component="h2">
            {initialData ? 'Edit Component' : 'Add New Component'}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Component Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Component Type"
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  {componentTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  {componentStatuses.map(status => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>

            {formData.type && SPEC_FIELDS[formData.type]?.map(field => (
              <Grid item xs={12} md={6} key={field.key}>
                <TextField
                  required={field.required}
                  fullWidth
                  label={field.label}
                  value={formData.specifications[field.key] || ''}
                  onChange={(e) => handleSpecificationChange(field.key, e.target.value)}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid()}
            >
              {initialData ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

SystemComponentForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    specifications: PropTypes.object,
    status: PropTypes.string,
    lastUpdated: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

SystemComponentForm.defaultProps = {
  initialData: null
};

export default SystemComponentForm;