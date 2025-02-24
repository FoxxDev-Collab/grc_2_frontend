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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { systemCategorizationApi } from '../../../services';

const impactLevels = [
  { 
    value: 'low',
    label: 'Low',
    description: 'The loss of confidentiality, integrity, or availability could be expected to have a limited adverse effect on organizational operations, organizational assets, or individuals.',
    examples: [
      'Degradation in mission capability to an extent and duration that the organization is able to perform its primary functions with noticeably reduced effectiveness',
      'Minor damage to organizational assets',
      'Minor financial loss',
      'Minor harm to individuals'
    ]
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'The loss of confidentiality, integrity, or availability could be expected to have a serious adverse effect on organizational operations, organizational assets, or individuals.',
    examples: [
      'Significant degradation in mission capability to an extent and duration that the organization is able to perform its primary functions with significantly reduced effectiveness',
      'Significant damage to organizational assets',
      'Significant financial loss',
      'Significant harm to individuals that does not involve loss of life or serious life-threatening injuries'
    ]
  },
  {
    value: 'high',
    label: 'High',
    description: 'The loss of confidentiality, integrity, or availability could be expected to have a severe or catastrophic adverse effect on organizational operations, organizational assets, or individuals.',
    examples: [
      'Severe degradation in or loss of mission capability to an extent and duration that the organization is not able to perform one or more of its primary functions',
      'Major damage to organizational assets',
      'Major financial loss',
      'Severe or catastrophic harm to individuals involving loss of life or serious life-threatening injuries'
    ]
  }
];

function ImpactAnalysisForm({ clientId, systemId, onSubmitSuccess, onSubmitError }) {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    confidentialityImpact: '',
    confidentialityJustification: '',
    integrityImpact: '',
    integrityJustification: '',
    availabilityImpact: '',
    availabilityJustification: '',
    aggregateImpact: '',
    impactJustification: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await systemCategorizationApi.getImpactAnalysis(clientId, systemId);
        setFormData({
          confidentialityImpact: data.confidentiality?.impact || '',
          confidentialityJustification: data.confidentiality?.justification || '',
          integrityImpact: data.integrity?.impact || '',
          integrityJustification: data.integrity?.justification || '',
          availabilityImpact: data.availability?.impact || '',
          availabilityJustification: data.availability?.justification || '',
          aggregateImpact: data.aggregate || '',
          impactJustification: data.justification || ''
        });
      } catch (error) {
        console.error('Error fetching impact analysis:', error);
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
    
    if (!formData.confidentialityImpact) {
      newErrors.confidentialityImpact = 'Confidentiality impact level is required';
    }
    if (!formData.confidentialityJustification) {
      newErrors.confidentialityJustification = 'Justification for confidentiality impact is required';
    }

    if (!formData.integrityImpact) {
      newErrors.integrityImpact = 'Integrity impact level is required';
    }
    if (!formData.integrityJustification) {
      newErrors.integrityJustification = 'Justification for integrity impact is required';
    }

    if (!formData.availabilityImpact) {
      newErrors.availabilityImpact = 'Availability impact level is required';
    }
    if (!formData.availabilityJustification) {
      newErrors.availabilityJustification = 'Justification for availability impact is required';
    }

    if (!formData.aggregateImpact) {
      newErrors.aggregateImpact = 'Aggregate impact level is required';
    }
    if (!formData.impactJustification) {
      newErrors.impactJustification = 'Overall impact justification is required';
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await systemCategorizationApi.updateImpactAnalysis(clientId, systemId, {
        confidentiality: {
          impact: formData.confidentialityImpact,
          justification: formData.confidentialityJustification
        },
        integrity: {
          impact: formData.integrityImpact,
          justification: formData.integrityJustification
        },
        availability: {
          impact: formData.availabilityImpact,
          justification: formData.availabilityJustification
        },
        aggregate: formData.aggregateImpact,
        justification: formData.impactJustification
      });

      setViewMode(true);
      onSubmitSuccess();
    } catch (error) {
      console.error('Error updating impact analysis:', error);
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

  const renderField = (label, value, justification = '', helperText = '') => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1">
        {impactLevels.find(level => level.value === value)?.label || 'Not provided'}
      </Typography>
      {justification && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Justification: {justification}
        </Typography>
      )}
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
        <Typography color="primary">NIST Guidance for Impact Analysis</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" paragraph>
          According to NIST FIPS 199 and SP 800-60, security categorization involves:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Determining potential impact levels for each security objective (confidentiality, integrity, availability)</li>
            <li>Selecting the appropriate impact level based on worst-case potential impact</li>
            <li>Documenting the security categorization results</li>
            <li>Obtaining authorizing official approval for the security categorization</li>
          </ul>
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          The highest impact level for any of the three security objectives (confidentiality, integrity, availability) 
          determines the overall security categorization of the system.
        </Alert>
      </AccordionDetails>
    </Accordion>
  );

  const renderImpactSelect = (name, label, value, error, justificationName, justificationValue, justificationError) => (
    <>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required error={!!error}>
          <InputLabel>{label}</InputLabel>
          <Select
            name={name}
            value={value || ''}
            onChange={handleChange}
            label={label}
          >
            {impactLevels.map((level) => (
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
        <TextField
          required
          fullWidth
          multiline
          rows={3}
          name={justificationName}
          label="Impact Justification"
          value={justificationValue || ''}
          onChange={handleChange}
          error={!!justificationError}
          helperText={justificationError || "Provide detailed justification for the selected impact level"}
        />
        {value && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">Example impacts at this level:</Typography>
            <ul>
              {impactLevels.find(level => level.value === value)?.examples.map((example, index) => (
                <Typography key={index} component="li" variant="body2" color="textSecondary">
                  {example}
                </Typography>
              ))}
            </ul>
          </Box>
        )}
      </Grid>
    </>
  );

  if (viewMode) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Impact Analysis Details</Typography>
          <Button variant="outlined" onClick={handleEdit}>
            Edit Information
          </Button>
        </Box>

        {renderField('Confidentiality Impact', formData.confidentialityImpact, formData.confidentialityJustification)}
        {renderField('Integrity Impact', formData.integrityImpact, formData.integrityJustification)}
        {renderField('Availability Impact', formData.availabilityImpact, formData.availabilityJustification)}
        {renderField('Aggregate Impact Level', formData.aggregateImpact)}
        {renderField('Overall Impact Justification', '', formData.impactJustification)}
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {renderNistGuidance()}
      
      <Typography variant="h6" gutterBottom>
        Impact Analysis Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {renderImpactSelect(
            'confidentialityImpact',
            'Confidentiality Impact',
            formData.confidentialityImpact,
            errors.confidentialityImpact,
            'confidentialityJustification',
            formData.confidentialityJustification,
            errors.confidentialityJustification
          )}

          {renderImpactSelect(
            'integrityImpact',
            'Integrity Impact',
            formData.integrityImpact,
            errors.integrityImpact,
            'integrityJustification',
            formData.integrityJustification,
            errors.integrityJustification
          )}

          {renderImpactSelect(
            'availabilityImpact',
            'Availability Impact',
            formData.availabilityImpact,
            errors.availabilityImpact,
            'availabilityJustification',
            formData.availabilityJustification,
            errors.availabilityJustification
          )}

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={!!errors.aggregateImpact}>
              <InputLabel>Aggregate Impact Level</InputLabel>
              <Select
                name="aggregateImpact"
                value={formData.aggregateImpact || ''}
                onChange={handleChange}
                label="Aggregate Impact Level"
              >
                {impactLevels.map((level) => (
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
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              name="impactJustification"
              label="Overall Impact Justification"
              value={formData.impactJustification || ''}
              onChange={handleChange}
              error={!!errors.impactJustification}
              helperText={errors.impactJustification || "Provide a comprehensive justification for the overall system categorization"}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setFormData({
                  confidentialityImpact: '',
                  confidentialityJustification: '',
                  integrityImpact: '',
                  integrityJustification: '',
                  availabilityImpact: '',
                  availabilityJustification: '',
                  aggregateImpact: '',
                  impactJustification: ''
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

ImpactAnalysisForm.propTypes = {
  clientId: PropTypes.number.isRequired,
  systemId: PropTypes.string.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  onSubmitError: PropTypes.func.isRequired,
};

export default ImpactAnalysisForm;