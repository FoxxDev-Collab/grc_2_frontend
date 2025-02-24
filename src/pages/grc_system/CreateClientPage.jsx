import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Divider,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Business as BusinessIcon,
  ContactMail as ContactIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { clientApi } from '../../services';

const INDUSTRY_OPTIONS = [
  'Technology',
  'Manufacturing',
  'Healthcare',
  'Finance',
  'Retail',
  'Education',
  'Energy',
  'Transportation',
  'Construction',
  'Other',
];

const REVENUE_RANGES = [
  'Less than $1M',
  '$1M - $10M',
  '$10M - $50M',
  '$50M - $100M',
  '$100M - $500M',
  '$500M - $1B',
  'More than $1B',
];

const STEPS = ['Basic Information', 'Contact Details', 'Additional Information'];

const CreateClientPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    email: '',
    phone: '',
    address: '',
    primaryContact: '',
    employeeCount: '',
    annualRevenue: '',
    description: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      if (!formData.name) errors.name = 'Client name is required';
      if (!formData.industry) errors.industry = 'Industry is required';
      if (formData.name && formData.name.length < 2) {
        errors.name = 'Client name must be at least 2 characters';
      }
    }
    
    if (step === 1) {
      if (!formData.email) errors.email = 'Email is required';
      if (!formData.primaryContact) errors.primaryContact = 'Primary contact is required';
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (formData.phone && !/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
      }
    }
    
    if (step === 2) {
      if (formData.employeeCount && isNaN(formData.employeeCount)) {
        errors.employeeCount = 'Employee count must be a number';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) return;

    setLoading(true);
    setError('');

    try {
      const newClient = await clientApi.createClient(formData);
      setSuccess(true);
      // Redirect to the new client's dashboard after a brief delay
      setTimeout(() => {
        navigate(`/client/${newClient.id}/dashboard`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Client Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                select
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                error={!!validationErrors.industry}
                helperText={validationErrors.industry}
              >
                {INDUSTRY_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the client's business..."
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ContactIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!validationErrors.phone}
                helperText={validationErrors.phone}
                placeholder="(555) 123-4567"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
                placeholder="Full business address..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Primary Contact"
                name="primaryContact"
                value={formData.primaryContact}
                onChange={handleChange}
                error={!!validationErrors.primaryContact}
                helperText={validationErrors.primaryContact}
                placeholder="Name of primary contact person..."
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee Count"
                name="employeeCount"
                type="number"
                value={formData.employeeCount}
                onChange={handleChange}
                error={!!validationErrors.employeeCount}
                helperText={validationErrors.employeeCount}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Annual Revenue"
                name="annualRevenue"
                value={formData.annualRevenue}
                onChange={handleChange}
              >
                {REVENUE_RANGES.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Client
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box component="form" onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/system/dashboard')}
            >
              Cancel
            </Button>
            {activeStep > 0 && (
              <Button
                variant="outlined"
                onClick={handleBack}
              >
                Back
              </Button>
            )}
            {activeStep < STEPS.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Creating...' : 'Create Client'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Client created successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateClientPage;