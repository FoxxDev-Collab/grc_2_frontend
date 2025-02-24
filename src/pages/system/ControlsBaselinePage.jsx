/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Alert,
  Stack,
  Divider,
  LinearProgress,
} from '@mui/material';
import { Tune as BaselineIcon } from '@mui/icons-material';
import { systemApi } from '../../services';

const ControlsBaselinePage = () => {
  const { clientId, systemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBaseline, setSelectedBaseline] = useState('low');
  const [justification, setJustification] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const loadBaselineData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call when available
        const systemData = await systemApi.getSystem(clientId, systemId);
        
        // Mock data - replace with actual data from API
        setSelectedBaseline('low');
        setJustification('Initial baseline selection based on system categorization.');
        
        setError('');
      } catch (err) {
        setError(err.message);
        console.error('Error loading baseline data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (clientId && systemId) {
      loadBaselineData();
    }
  }, [clientId, systemId]);

  const handleBaselineChange = (event) => {
    setSelectedBaseline(event.target.value);
  };

  const handleJustificationChange = (event) => {
    setJustification(event.target.value);
  };

  const handleSave = async () => {
    try {
      // TODO: Replace with actual API call when available
      // await systemApi.updateSecurityBaseline(clientId, systemId, {
      //   baseline: selectedBaseline,
      //   justification,
      // });

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setError(err.message);
      setSaveStatus('error');
    }
  };

  const baselineDescriptions = {
    low: 'Recommended for systems where the loss of confidentiality, integrity, and availability would have a limited adverse effect on organizational operations, assets, or individuals.',
    moderate: 'Recommended for systems where the loss of confidentiality, integrity, and availability would have a serious adverse effect on organizational operations, assets, or individuals.',
    high: 'Recommended for systems where the loss of confidentiality, integrity, and availability would have a severe or catastrophic adverse effect on organizational operations, assets, or individuals.',
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Page Header */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <BaselineIcon color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" gutterBottom>
              Security Control Baseline Selection
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Select and justify the security control baseline for your system
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {saveStatus === 'success' && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Baseline selection saved successfully
          </Alert>
        )}

        <Typography variant="h6" gutterBottom>
          Select Baseline
        </Typography>
        <RadioGroup
          value={selectedBaseline}
          onChange={handleBaselineChange}
          sx={{ mb: 3 }}
        >
          {Object.entries(baselineDescriptions).map(([value, description]) => (
            <Paper
              key={value}
              sx={{
                p: 2,
                mb: 2,
                border: (theme) =>
                  selectedBaseline === value
                    ? `2px solid ${theme.palette.primary.main}`
                    : '1px solid #e0e0e0',
              }}
            >
              <FormControlLabel
                value={value}
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="subtitle1" sx={{ textTransform: 'uppercase' }}>
                      {value} Impact
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {description}
                    </Typography>
                  </Box>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Paper>
          ))}
        </RadioGroup>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Baseline Selection Justification
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Provide a detailed justification for your baseline selection. Consider system categorization,
          data types, and operational requirements.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={justification}
          onChange={handleJustificationChange}
          placeholder="Enter your justification here..."
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!justification.trim()}
          >
            Save Baseline Selection
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ControlsBaselinePage;