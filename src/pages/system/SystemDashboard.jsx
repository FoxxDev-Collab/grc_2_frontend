import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  LinearProgress,
  Alert,
} from '@mui/material';
import systemApi, { SecurityLevel } from '../../services';

const SystemDashboard = () => {
  const { clientId, systemId } = useParams();
  const [system, setSystem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSystem = async () => {
      try {
        setLoading(true);
        // Add debugging
        console.log('Loading system with:', {
          clientId,
          systemId,
          clientIdType: typeof clientId,
          systemIdType: typeof systemId
        });
        
        // Convert clientId to number since it's stored as number in mock data
        const systemData = await systemApi.getSystem(Number(clientId), systemId);
        console.log('System data:', systemData); // Debug
        setSystem(systemData);
        setError('');
      } catch (err) {
        setError(err.message);
        console.error('Error loading system:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSystem();
  }, [clientId, systemId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!system) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">System not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {system.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            label={system.type}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={system.category}
            color="secondary"
            variant="outlined"
          />
          <Chip
            label={system.securityLevel.toUpperCase()}
            color={
              system.securityLevel === SecurityLevel.HIGH ? 'error' :
              system.securityLevel === SecurityLevel.MODERATE ? 'warning' : 'success'
            }
          />
        </Box>
      </Box>

      {/* System Overview Cards */}
      <Grid container spacing={3}>
        {/* ATO Status */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography color="textSecondary" gutterBottom>
              ATO Status
            </Typography>
            <Typography variant="h6" component="div">
              <Chip
                label={system.atoStatus.replace(/_/g, ' ')}
                color={
                  system.atoStatus === 'APPROVED' ? 'success' :
                  system.atoStatus === 'IN_PROGRESS' ? 'warning' :
                  system.atoStatus === 'EXPIRED' ? 'error' : 'default'
                }
                size="small"
              />
            </Typography>
          </Paper>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography color="textSecondary" gutterBottom>
              System Status
            </Typography>
            <Typography variant="h6" component="div">
              <Chip
                label={system.status.replace(/_/g, ' ')}
                color={
                  system.status === 'COMPLETED' ? 'success' :
                  system.status === 'IN_PROGRESS' ? 'warning' : 'default'
                }
                size="small"
              />
            </Typography>
          </Paper>
        </Grid>

        {/* Information Level */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography color="textSecondary" gutterBottom>
              Information Level
            </Typography>
            <Typography variant="h6" component="div">
              {system.informationLevel.toUpperCase()}
            </Typography>
          </Paper>
        </Grid>

        {/* Last Updated */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography color="textSecondary" gutterBottom>
              Last Updated
            </Typography>
            <Typography variant="h6" component="div">
              {new Date(system.updatedAt).toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>

        {/* Phase Progress */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              ATO Phase Progress
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(system.phaseProgress).map(([phase, progress]) => (
                <Grid item xs={12} sm={6} md={4} key={phase}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      {phase.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress variant="determinate" value={progress} />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="textSecondary">
                          {progress}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SystemDashboard;