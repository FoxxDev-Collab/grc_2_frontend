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
import { systemApi, initialAssessmentApi } from '../../../services';
import { InformationLevel } from '../../../services';

const informationTypes = [
  { value: 'pii', label: 'Personally Identifiable Information (PII)' },
  { value: 'phi', label: 'Protected Health Information (PHI)' },
  { value: 'financial', label: 'Financial' },
  { value: 'proprietary', label: 'Proprietary' },
  { value: 'classified', label: 'Classified' },
  { value: 'public', label: 'Public' },
];

function SystemDiscoveryForm({ clientId, systemId, onSubmitSuccess, onSubmitError }) {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    systemName: '',
    description: '',
    purpose: '',
    informationLevel: '',
    informationTypes: [],
    systemComponents: '',
    systemBoundaries: '',
    dataFlows: '',
    interconnections: '',
    existingControls: '',
    securityDocumentation: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get basic system info
        const systemData = await systemApi.getSystem(clientId, systemId);
        // Get discovery data
        const assessmentData = await initialAssessmentApi.getInitialAssessment(clientId, systemId);
        
        const discoveryData = assessmentData.discovery || {};
        setFormData({
          systemName: systemData.name,
          description: discoveryData.description || '',
          purpose: discoveryData.purpose || '',
          informationLevel: systemData.informationLevel,
          informationTypes: discoveryData.informationTypes || [],
          systemComponents: discoveryData.components || '',
          systemBoundaries: discoveryData.boundaries || '',
          dataFlows: discoveryData.dataFlows || '',
          interconnections: discoveryData.interconnections || '',
          existingControls: discoveryData.existingControls || '',
          securityDocumentation: discoveryData.securityDocumentation || ''
        });

        if (discoveryData.status === 'completed') {
          setViewMode(true);
        }
      } catch (error) {
        console.error('Error fetching system data:', error);
        onSubmitError(error);
      } finally {
        setLoading(false);
      }
    };

    if (clientId && systemId) {
      fetchData();
    }
  }, [clientId, systemId, onSubmitError]);

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
      informationTypes: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await initialAssessmentApi.updateSystemDiscovery(clientId, systemId, {
        description: formData.description,
        purpose: formData.purpose,
        informationLevel: formData.informationLevel,
        informationTypes: formData.informationTypes,
        components: formData.systemComponents,
        boundaries: formData.systemBoundaries,
        dataFlows: formData.dataFlows,
        interconnections: formData.interconnections,
        existingControls: formData.existingControls,
        securityDocumentation: formData.securityDocumentation
      });

      setViewMode(true);
      onSubmitSuccess();
    } catch (error) {
      console.error('Error updating system:', error);
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
          <Typography variant="h6">System Discovery Information</Typography>
          <Button variant="outlined" onClick={handleEdit}>
            Edit Information
          </Button>
        </Box>

        {renderField('System Name', formData.systemName)}
        {renderField('System Description', formData.description)}
        {renderField('System Purpose and Functions', formData.purpose)}
        {renderField('Information Level', formData.informationLevel)}
        {renderField('Information Types', 
          formData.informationTypes.map(type => 
            informationTypes.find(t => t.value === type)?.label
          ).join(', ')
        )}
        {renderField('System Components', formData.systemComponents)}
        {renderField('System Boundaries', formData.systemBoundaries)}
        {renderField('Data Flows', formData.dataFlows)}
        {renderField('System Interconnections', formData.interconnections)}
        {renderField('Existing Security Controls', formData.existingControls)}
        {renderField('Security Documentation', formData.securityDocumentation)}
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        System Discovery Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="systemName"
              label="System Name"
              value={formData.systemName}
              disabled
              helperText="System name cannot be modified in this form"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={3}
              name="description"
              label="System Description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description || "Provide a detailed description of the system"}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={3}
              name="purpose"
              label="System Purpose and Functions"
              value={formData.purpose}
              onChange={handleChange}
              error={!!errors.purpose}
              helperText={errors.purpose || "Describe the main purpose and key functions of the system"}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Information Level</InputLabel>
              <Select
                name="informationLevel"
                value={formData.informationLevel}
                onChange={handleChange}
                label="Information Level"
              >
                {Object.entries(InformationLevel).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Information Types</InputLabel>
              <Select
                multiple
                name="informationTypes"
                value={formData.informationTypes}
                onChange={handleMultiSelectChange}
                input={<OutlinedInput label="Information Types" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={informationTypes.find(type => type.value === value)?.label} 
                      />
                    ))}
                  </Box>
                )}
              >
                {informationTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={3}
              name="systemComponents"
              label="System Components"
              value={formData.systemComponents}
              onChange={handleChange}
              error={!!errors.systemComponents}
              helperText={errors.systemComponents || "List and describe all major system components"}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={3}
              name="systemBoundaries"
              label="System Boundaries"
              value={formData.systemBoundaries}
              onChange={handleChange}
              error={!!errors.systemBoundaries}
              helperText={errors.systemBoundaries || "Define the system's boundaries and scope"}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={3}
              name="dataFlows"
              label="Data Flows"
              value={formData.dataFlows}
              onChange={handleChange}
              error={!!errors.dataFlows}
              helperText={errors.dataFlows || "Describe the data flows within and outside the system"}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={3}
              name="interconnections"
              label="System Interconnections"
              value={formData.interconnections}
              onChange={handleChange}
              error={!!errors.interconnections}
              helperText={errors.interconnections || "Document all system interconnections and dependencies"}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="existingControls"
              label="Existing Security Controls"
              value={formData.existingControls}
              onChange={handleChange}
              helperText="List any existing security controls or measures"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="securityDocumentation"
              label="Existing Security Documentation"
              value={formData.securityDocumentation}
              onChange={handleChange}
              helperText="List and describe any existing security documentation"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setFormData(prevData => ({
                  ...prevData,
                  description: '',
                  purpose: '',
                  informationTypes: [],
                  systemComponents: '',
                  systemBoundaries: '',
                  dataFlows: '',
                  interconnections: '',
                  existingControls: '',
                  securityDocumentation: ''
                }))}
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

SystemDiscoveryForm.propTypes = {
  clientId: PropTypes.number.isRequired,
  systemId: PropTypes.string.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  onSubmitError: PropTypes.func.isRequired,
};

export default SystemDiscoveryForm;