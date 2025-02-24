import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Grid,
  Button,
  Typography,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  CircularProgress,
} from '@mui/material';
import PropTypes from 'prop-types';
import { initialAssessmentApi } from '../../../services';

const hostingTypes = [
  { value: 'cloud', label: 'Cloud' },
  { value: 'on-prem', label: 'On-Premises' },
  { value: 'hybrid', label: 'Hybrid' },
];

const infrastructureComponents = [
  { value: 'web-servers', label: 'Web Servers' },
  { value: 'app-servers', label: 'Application Servers' },
  { value: 'databases', label: 'Databases' },
  { value: 'load-balancers', label: 'Load Balancers' },
  { value: 'storage', label: 'Storage Systems' },
  { value: 'network-devices', label: 'Network Devices' },
  { value: 'security-appliances', label: 'Security Appliances' },
  { value: 'containers', label: 'Containers/Orchestration' },
  { value: 'monitoring', label: 'Monitoring Systems' },
];

function EnvironmentAnalysisForm({ clientId, systemId, onSubmitSuccess, onSubmitError }) {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    hosting: '',
    components: [],
    networkArchitecture: '',
    dependencies: '',
    interfaces: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assessmentData = await initialAssessmentApi.getInitialAssessment(clientId, systemId);
        const environmentData = assessmentData.environment || {};
        
        setFormData({
          hosting: environmentData.hosting || '',
          components: environmentData.components || [],
          networkArchitecture: environmentData.networkArchitecture || '',
          dependencies: environmentData.dependencies || '',
          interfaces: environmentData.interfaces || '',
          notes: environmentData.notes || ''
        });

        if (environmentData.status === 'completed') {
          setViewMode(true);
        }
      } catch (error) {
        console.error('Error fetching environment data:', error);
        onSubmitError(error);
      } finally {
        setLoading(false);
      }
    };

    if (clientId && systemId) {
      fetchData();
    }
  }, [clientId, systemId, onSubmitError]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.hosting) {
      newErrors.hosting = 'Hosting environment is required';
    }
    if (formData.components.length === 0) {
      newErrors.components = 'At least one infrastructure component is required';
    }
    if (!formData.networkArchitecture) {
      newErrors.networkArchitecture = 'Network architecture description is required';
    }
    if (!formData.dependencies) {
      newErrors.dependencies = 'System dependencies must be documented';
    }
    if (!formData.interfaces) {
      newErrors.interfaces = 'System interfaces must be documented';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleMultiSelectChange = (event) => {
    const { value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      components: typeof value === 'string' ? value.split(',') : value,
    }));
    if (errors.components) {
      setErrors(prev => ({ ...prev, components: undefined }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      await initialAssessmentApi.updateEnvironmentAnalysis(clientId, systemId, formData);
      setViewMode(true);
      onSubmitSuccess();
    } catch (error) {
      console.error('Error updating environment analysis:', error);
      onSubmitError(error);
    }
  };

  const handleEdit = () => {
    setViewMode(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderField = (label, value, helperText = '') => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1" paragraph>
        {value || 'Not provided'}
      </Typography>
      {helperText && (
        <Typography variant="caption" color="textSecondary">
          {helperText}
        </Typography>
      )}
    </Box>
  );

  if (viewMode) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Environment Analysis Information</Typography>
          <Button variant="outlined" onClick={handleEdit}>
            Edit Information
          </Button>
        </Box>

        {renderField('Hosting Environment', 
          hostingTypes.find(type => type.value === formData.hosting)?.label
        )}
        {renderField('Infrastructure Components', 
          formData.components.map(comp => 
            infrastructureComponents.find(c => c.value === comp)?.label
          ).join(', ')
        )}
        {renderField('Network Architecture', formData.networkArchitecture)}
        {renderField('System Dependencies', formData.dependencies)}
        {renderField('System Interfaces', formData.interfaces)}
        {renderField('Additional Notes', formData.notes)}
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Environment Analysis Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={!!errors.hosting}>
              <InputLabel>Hosting Environment</InputLabel>
              <Select
                name="hosting"
                value={formData.hosting}
                onChange={handleChange}
                label="Hosting Environment"
              >
                {hostingTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.hosting && (
                <Typography variant="caption" color="error">
                  {errors.hosting}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={!!errors.components}>
              <InputLabel>Infrastructure Components</InputLabel>
              <Select
                multiple
                name="components"
                value={formData.components}
                onChange={handleMultiSelectChange}
                input={<OutlinedInput label="Infrastructure Components" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={infrastructureComponents.find(comp => comp.value === value)?.label} 
                      />
                    ))}
                  </Box>
                )}
              >
                {infrastructureComponents.map((comp) => (
                  <MenuItem key={comp.value} value={comp.value}>
                    {comp.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.components && (
                <Typography variant="caption" color="error">
                  {errors.components}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              name="networkArchitecture"
              label="Network Architecture"
              value={formData.networkArchitecture}
              onChange={handleChange}
              error={!!errors.networkArchitecture}
              helperText={errors.networkArchitecture || "Describe the network architecture including topology, segmentation, and security measures"}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              name="dependencies"
              label="System Dependencies"
              value={formData.dependencies}
              onChange={handleChange}
              error={!!errors.dependencies}
              helperText={errors.dependencies || "List and describe all system dependencies including external services and internal dependencies"}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              name="interfaces"
              label="System Interfaces"
              value={formData.interfaces}
              onChange={handleChange}
              error={!!errors.interfaces}
              helperText={errors.interfaces || "Identify and describe all critical system interfaces and integration points"}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="notes"
              label="Additional Notes"
              value={formData.notes}
              onChange={handleChange}
              helperText="Any additional information about the system environment"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setFormData({
                  hosting: '',
                  components: [],
                  networkArchitecture: '',
                  dependencies: '',
                  interfaces: '',
                  notes: ''
                })}
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Save & Continue
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

EnvironmentAnalysisForm.propTypes = {
  clientId: PropTypes.number.isRequired,
  systemId: PropTypes.string.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  onSubmitError: PropTypes.func.isRequired,
};

export default EnvironmentAnalysisForm;