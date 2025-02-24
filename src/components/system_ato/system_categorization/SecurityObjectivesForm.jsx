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

const securityObjectiveTypes = [
  {
    value: 'confidentiality',
    label: 'Confidentiality',
    description: 'Preserving authorized restrictions on information access and disclosure'
  },
  {
    value: 'integrity',
    label: 'Integrity',
    description: 'Guarding against improper information modification or destruction'
  },
  {
    value: 'availability',
    label: 'Availability',
    description: 'Ensuring timely and reliable access to and use of information'
  }
];

const criticalityLevels = [
  {
    value: 'mission_critical',
    label: 'Mission Critical',
    description: 'Essential for mission success; failure would severely impact operations'
  },
  {
    value: 'business_critical',
    label: 'Business Critical',
    description: 'Important for business operations; failure would cause significant disruption'
  },
  {
    value: 'support',
    label: 'Support',
    description: 'Supports business operations; alternative processes available'
  }
];

const businessImpactTypes = [
  {
    value: 'financial',
    label: 'Financial Impact',
    description: 'Direct monetary losses or costs'
  },
  {
    value: 'operational',
    label: 'Operational Impact',
    description: 'Impact on business operations and processes'
  },
  {
    value: 'reputational',
    label: 'Reputational Impact',
    description: "Impact on organization's reputation and trust"
  },
  {
    value: 'regulatory',
    label: 'Regulatory Impact',
    description: 'Impact on compliance with laws and regulations'
  },
  {
    value: 'privacy',
    label: 'Privacy Impact',
    description: 'Impact on individual privacy and data protection'
  }
];

function SecurityObjectivesForm({ clientId, systemId, onSubmitSuccess, onSubmitError }) {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    objectives: [],
    protectionRequirements: '',
    criticalFunctions: [],
    businessImpacts: [],
    impactDetails: '',
    securityPriorities: '',
    mitigationStrategy: '',
    continuityRequirements: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await systemCategorizationApi.getSecurityObjectives(clientId, systemId);
        setFormData({
          objectives: data.objectives || [],
          protectionRequirements: data.requirements || '',
          criticalFunctions: data.criticalFunctions || [],
          businessImpacts: data.businessImpact?.types || [],
          impactDetails: data.businessImpact?.details || '',
          securityPriorities: data.priorities || '',
          mitigationStrategy: data.mitigationStrategy || '',
          continuityRequirements: data.continuityRequirements || ''
        });
      } catch (error) {
        console.error('Error fetching security objectives:', error);
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
    
    if (!formData.objectives || formData.objectives.length === 0) {
      newErrors.objectives = 'At least one security objective must be selected';
    }

    if (!formData.protectionRequirements) {
      newErrors.protectionRequirements = 'Protection requirements are required';
    }

    if (!formData.criticalFunctions || formData.criticalFunctions.length === 0) {
      newErrors.criticalFunctions = 'At least one critical function must be selected';
    }

    if (!formData.businessImpacts || formData.businessImpacts.length === 0) {
      newErrors.businessImpacts = 'At least one business impact type must be selected';
    }

    if (!formData.impactDetails) {
      newErrors.impactDetails = 'Business impact details are required';
    }

    if (!formData.securityPriorities) {
      newErrors.securityPriorities = 'Security priorities are required';
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
      await systemCategorizationApi.updateSecurityObjectives(clientId, systemId, {
        objectives: formData.objectives,
        requirements: formData.protectionRequirements,
        criticalFunctions: formData.criticalFunctions,
        businessImpact: {
          types: formData.businessImpacts,
          details: formData.impactDetails
        },
        priorities: formData.securityPriorities,
        mitigationStrategy: formData.mitigationStrategy,
        continuityRequirements: formData.continuityRequirements
      });

      setViewMode(true);
      onSubmitSuccess();
    } catch (error) {
      console.error('Error updating security objectives:', error);
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
        <Typography color="primary">NIST Guidance for Security Objectives</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" paragraph>
          According to NIST SP 800-53 and the RMF, security objectives should:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Align with the organization&apos;s mission and business objectives</li>
            <li>Address the security requirements of stakeholders</li>
            <li>Consider the results of the system categorization</li>
            <li>Be specific, measurable, achievable, relevant, and time-bound (SMART)</li>
          </ul>
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          Security objectives should be based on the system&apos;s categorization level and should address 
          all three security objectives: confidentiality, integrity, and availability.
        </Alert>
      </AccordionDetails>
    </Accordion>
  );

  if (viewMode) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Security Objectives Details</Typography>
          <Button variant="outlined" onClick={handleEdit}>
            Edit Information
          </Button>
        </Box>

        {renderField('Security Objectives', 
          (formData.objectives || []).map(obj => 
            securityObjectiveTypes.find(type => type.value === obj)?.label
          ).join(', ')
        )}
        {renderField('Protection Requirements', formData.protectionRequirements)}
        {renderField('Critical Functions', 
          (formData.criticalFunctions || []).map(func => 
            criticalityLevels.find(level => level.value === func)?.label
          ).join(', ')
        )}
        {renderField('Business Impact Types',
          (formData.businessImpacts || []).map(impact =>
            businessImpactTypes.find(type => type.value === impact)?.label
          ).join(', ')
        )}
        {renderField('Impact Details', formData.impactDetails)}
        {renderField('Security Priorities', formData.securityPriorities)}
        {renderField('Mitigation Strategy', formData.mitigationStrategy)}
        {renderField('Continuity Requirements', formData.continuityRequirements)}
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {renderNistGuidance()}
      
      <Typography variant="h6" gutterBottom>
        Security Objectives Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.objectives}>
              <InputLabel>Security Objectives</InputLabel>
              <Select
                multiple
                name="objectives"
                value={formData.objectives || []}
                onChange={handleMultiSelectChange}
                input={<OutlinedInput label="Security Objectives" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected || []).map((value) => (
                      <Chip 
                        key={value} 
                        label={securityObjectiveTypes.find(type => type.value === value)?.label} 
                      />
                    ))}
                  </Box>
                )}
              >
                {securityObjectiveTypes.map((type) => (
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
              required
              fullWidth
              multiline
              rows={4}
              name="protectionRequirements"
              label="Protection Requirements"
              value={formData.protectionRequirements}
              onChange={handleChange}
              error={!!errors.protectionRequirements}
              helperText={errors.protectionRequirements || "Define specific protection requirements based on security objectives"}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.criticalFunctions}>
              <InputLabel>Critical Functions</InputLabel>
              <Select
                multiple
                name="criticalFunctions"
                value={formData.criticalFunctions || []}
                onChange={handleMultiSelectChange}
                input={<OutlinedInput label="Critical Functions" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected || []).map((value) => (
                      <Chip 
                        key={value} 
                        label={criticalityLevels.find(level => level.value === value)?.label} 
                      />
                    ))}
                  </Box>
                )}
              >
                {criticalityLevels.map((level) => (
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
            <FormControl fullWidth required error={!!errors.businessImpacts}>
              <InputLabel>Business Impact Types</InputLabel>
              <Select
                multiple
                name="businessImpacts"
                value={formData.businessImpacts || []}
                onChange={handleMultiSelectChange}
                input={<OutlinedInput label="Business Impact Types" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected || []).map((value) => (
                      <Chip 
                        key={value} 
                        label={businessImpactTypes.find(type => type.value === value)?.label} 
                      />
                    ))}
                  </Box>
                )}
              >
                {businessImpactTypes.map((type) => (
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
              required
              fullWidth
              multiline
              rows={4}
              name="impactDetails"
              label="Business Impact Details"
              value={formData.impactDetails}
              onChange={handleChange}
              error={!!errors.impactDetails}
              helperText={errors.impactDetails || "Provide detailed description of potential business impacts"}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              name="securityPriorities"
              label="Security Priorities"
              value={formData.securityPriorities}
              onChange={handleChange}
              error={!!errors.securityPriorities}
              helperText={errors.securityPriorities || "Define and prioritize security requirements"}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="mitigationStrategy"
              label="Mitigation Strategy"
              value={formData.mitigationStrategy}
              onChange={handleChange}
              helperText="Outline strategies to mitigate identified security risks"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="continuityRequirements"
              label="Continuity Requirements"
              value={formData.continuityRequirements}
              onChange={handleChange}
              helperText="Specify requirements for business continuity and disaster recovery"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setFormData({
                  objectives: [],
                  protectionRequirements: '',
                  criticalFunctions: [],
                  businessImpacts: [],
                  impactDetails: '',
                  securityPriorities: '',
                  mitigationStrategy: '',
                  continuityRequirements: ''
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

SecurityObjectivesForm.propTypes = {
  clientId: PropTypes.number.isRequired,
  systemId: PropTypes.string.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  onSubmitError: PropTypes.func.isRequired,
};

export default SecurityObjectivesForm;