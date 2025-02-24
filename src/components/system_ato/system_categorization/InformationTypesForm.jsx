/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Grid,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Chip,
  OutlinedInput,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { systemCategorizationApi } from '../../../services';

const informationTypes = [
  { value: 'pii', label: 'Personally Identifiable Information (PII)',
    description: 'Information that can be used to distinguish or trace an individual\'s identity' },
  { value: 'phi', label: 'Protected Health Information (PHI)',
    description: 'Health information that is created, received, maintained, or transmitted by healthcare providers' },
  { value: 'financial', label: 'Financial Information',
    description: 'Information related to financial transactions, accounts, or financial status' },
  { value: 'proprietary', label: 'Proprietary Information',
    description: 'Business-related information that requires protection from unauthorized disclosure' },
  { value: 'classified', label: 'Classified Information',
    description: 'Information that requires protection against unauthorized disclosure' },
  { value: 'public', label: 'Public Information',
    description: 'Information that can be freely shared with the public' }
];

const sensitivityLevels = [
  { value: 'low', label: 'Low',
    description: 'Limited adverse effect on operations, assets, or individuals' },
  { value: 'moderate', label: 'Moderate',
    description: 'Serious adverse effect on operations, assets, or individuals' },
  { value: 'high', label: 'High',
    description: 'Severe or catastrophic adverse effect on operations, assets, or individuals' }
];

const regulatoryFrameworks = [
  { value: 'hipaa', label: 'HIPAA',
    description: 'Health Insurance Portability and Accountability Act' },
  { value: 'pci', label: 'PCI DSS',
    description: 'Payment Card Industry Data Security Standard' },
  { value: 'fedramp', label: 'FedRAMP',
    description: 'Federal Risk and Authorization Management Program' },
  { value: 'fisma', label: 'FISMA',
    description: 'Federal Information Security Management Act' },
  { value: 'gdpr', label: 'GDPR',
    description: 'General Data Protection Regulation' }
];

function InformationTypesForm({ clientId, systemId, onSubmitSuccess, onSubmitError }) {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    selectedTypes: [],
    customTypes: '',
    sensitivityLevels: '',
    regulatoryRequirements: [],
    dataOwnership: '',
    dataFlows: '',
    dataLifecycle: '',
    privacyRequirements: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await systemCategorizationApi.getInformationTypes(clientId, systemId);
        setFormData({
          selectedTypes: Array.isArray(data.types) ? data.types : [],
          customTypes: data.customTypes || '',
          sensitivityLevels: data.sensitivity || '',
          regulatoryRequirements: Array.isArray(data.regulations) ? data.regulations : [],
          dataOwnership: data.ownership || '',
          dataFlows: data.dataFlows || '',
          dataLifecycle: data.dataLifecycle || '',
          privacyRequirements: data.privacyRequirements || ''
        });
      } catch (error) {
        console.error('Error fetching information types:', error);
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
    
    if (formData.selectedTypes.length === 0 && !formData.customTypes) {
      newErrors.informationTypes = 'At least one information type must be selected or specified';
    }

    if (!formData.sensitivityLevels) {
      newErrors.sensitivityLevels = 'Sensitivity level is required';
    }

    if (!formData.dataOwnership) {
      newErrors.dataOwnership = 'Data ownership information is required';
    }

    if (!formData.dataFlows) {
      newErrors.dataFlows = 'Data flow documentation is required';
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
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: Array.isArray(value) ? value : []
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await systemCategorizationApi.updateInformationTypes(clientId, systemId, {
        types: formData.selectedTypes,
        customTypes: formData.customTypes,
        sensitivity: formData.sensitivityLevels,
        regulations: formData.regulatoryRequirements,
        ownership: formData.dataOwnership,
        dataFlows: formData.dataFlows,
        dataLifecycle: formData.dataLifecycle,
        privacyRequirements: formData.privacyRequirements
      });

      setViewMode(true);
      onSubmitSuccess();
    } catch (error) {
      console.error('Error updating information types:', error);
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

  const renderNistGuidance = () => (
    <Accordion sx={{ mb: 3 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color="primary">NIST Guidance for Information Type Categorization</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" paragraph>
          According to NIST SP 800-60, information type categorization involves:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Identifying the information types that are processed, stored, or transmitted by the system</li>
            <li>Selecting provisional impact values for each security objective (confidentiality, integrity, availability)</li>
            <li>Reviewing and adjusting the provisional impact values</li>
            <li>Determining the system security category</li>
          </ul>
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          Consider both mission-based and management/support information types when categorizing your system.
        </Alert>
      </AccordionDetails>
    </Accordion>
  );

  if (viewMode) {
    const selectedTypeLabels = formData.selectedTypes
      .map(type => {
        const foundType = informationTypes.find(t => t.value === type);
        return foundType ? foundType.label : null;
      })
      .filter(Boolean);

    const displayTypes = [...selectedTypeLabels];
    if (formData.customTypes) {
      displayTypes.push(formData.customTypes);
    }

    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Information Types Details</Typography>
          <Button variant="outlined" onClick={handleEdit}>
            Edit Information
          </Button>
        </Box>

        {renderField('Information Types', displayTypes.join(', '))}
        {renderField('Data Sensitivity Levels', 
          sensitivityLevels.find(level => level.value === formData.sensitivityLevels)?.label || 'Not specified'
        )}
        {renderField('Regulatory Requirements', 
          formData.regulatoryRequirements
            .map(req => regulatoryFrameworks.find(f => f.value === req)?.label)
            .filter(Boolean)
            .join(', ') || 'None specified'
        )}
        {renderField('Data Ownership', formData.dataOwnership)}
        {renderField('Data Flows', formData.dataFlows)}
        {renderField('Data Lifecycle', formData.dataLifecycle)}
        {renderField('Privacy Requirements', formData.privacyRequirements)}
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {renderNistGuidance()}
      
      <Typography variant="h6" gutterBottom>
        Information Types Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.informationTypes}>
              <InputLabel>Information Types</InputLabel>
              <Select
                multiple
                name="selectedTypes"
                value={formData.selectedTypes}
                onChange={handleMultiSelectChange}
                input={<OutlinedInput label="Information Types" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const type = informationTypes.find(t => t.value === value);
                      return type ? (
                        <Chip key={value} label={type.label} />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {informationTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box>
                      <Typography variant="subtitle2">{type.label}</Typography>
                      <Typography variant="caption" display="block" color="textSecondary">
                        {type.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="customTypes"
              label="Custom Information Types"
              value={formData.customTypes}
              onChange={handleChange}
              error={!!errors.informationTypes}
              helperText={errors.informationTypes || "Specify any additional information types not covered by the predefined categories"}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.sensitivityLevels}>
              <InputLabel>Sensitivity Level</InputLabel>
              <Select
                name="sensitivityLevels"
                value={formData.sensitivityLevels}
                onChange={handleChange}
                label="Sensitivity Level"
              >
                {sensitivityLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    <Box>
                      <Typography variant="subtitle2">{level.label}</Typography>
                      <Typography variant="caption" display="block" color="textSecondary">
                        {level.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Regulatory Requirements</InputLabel>
              <Select
                multiple
                name="regulatoryRequirements"
                value={formData.regulatoryRequirements}
                onChange={handleMultiSelectChange}
                input={<OutlinedInput label="Regulatory Requirements" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const framework = regulatoryFrameworks.find(f => f.value === value);
                      return framework ? (
                        <Chip key={value} label={framework.label} />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {regulatoryFrameworks.map((framework) => (
                  <MenuItem key={framework.value} value={framework.value}>
                    <Box>
                      <Typography variant="subtitle2">{framework.label}</Typography>
                      <Typography variant="caption" display="block" color="textSecondary">
                        {framework.description}
                      </Typography>
                    </Box>
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
              name="dataOwnership"
              label="Data Ownership"
              value={formData.dataOwnership}
              onChange={handleChange}
              error={!!errors.dataOwnership}
              helperText={errors.dataOwnership || "Define data ownership, roles, and responsibilities"}
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
              helperText={errors.dataFlows || "Document how data flows through the system, including inputs, processing, and outputs"}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="dataLifecycle"
              label="Data Lifecycle"
              value={formData.dataLifecycle}
              onChange={handleChange}
              helperText="Describe the data lifecycle from creation/collection through disposal"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="privacyRequirements"
              label="Privacy Requirements"
              value={formData.privacyRequirements}
              onChange={handleChange}
              helperText="Specify any privacy requirements or considerations"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setFormData({
                  selectedTypes: [],
                  customTypes: '',
                  sensitivityLevels: '',
                  regulatoryRequirements: [],
                  dataOwnership: '',
                  dataFlows: '',
                  dataLifecycle: '',
                  privacyRequirements: ''
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

InformationTypesForm.propTypes = {
  clientId: PropTypes.number.isRequired,
  systemId: PropTypes.string.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  onSubmitError: PropTypes.func.isRequired,
};

export default InformationTypesForm;