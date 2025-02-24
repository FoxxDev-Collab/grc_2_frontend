/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Chip,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Tune as BaselineIcon,
  ListAlt as DetailsIcon,
  Build as ImplementationIcon,
} from '@mui/icons-material';
import { systemApi } from '../../services';

const ControlsOverviewPage = () => {
  const { clientId, systemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [system, setSystem] = useState(null);
  const [controlsProgress, setControlsProgress] = useState({
    baseline: 0,
    details: 0,
    implementation: 0,
  });

  useEffect(() => {
    const loadSystemData = async () => {
      try {
        setLoading(true);
        const systemData = await systemApi.getSystem(clientId, systemId);
        setSystem(systemData);
        
        // TODO: Replace with actual API calls when available
        setControlsProgress({
          baseline: 30,
          details: 60,
          implementation: 45,
        });
        
        setError('');
      } catch (err) {
        setError(err.message);
        console.error('Error loading system data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (clientId && systemId) {
      loadSystemData();
    }
  }, [clientId, systemId]);

  const sections = [
    {
      title: 'Baseline Selection',
      description: 'Select and justify security control baseline',
      icon: <BaselineIcon fontSize="large" />,
      progress: controlsProgress.baseline,
      path: 'baseline',
    },
    {
      title: 'Control Details',
      description: 'View and manage NIST control catalog components',
      icon: <DetailsIcon fontSize="large" />,
      progress: controlsProgress.details,
      path: 'details',
    },
    {
      title: 'Implementation',
      description: 'Track control implementation status and evidence',
      icon: <ImplementationIcon fontSize="large" />,
      progress: controlsProgress.implementation,
      path: 'implementation',
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  const overallProgress = Math.round(
    Object.values(controlsProgress).reduce((a, b) => a + b, 0) / 3
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Page Header */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <SecurityIcon color="primary" sx={{ fontSize: 40 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              Security Controls Overview
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage and track the implementation of security controls for your system
            </Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="textSecondary">
                Overall Progress:
              </Typography>
              <Chip
                label={`${overallProgress}%`}
                color={
                  overallProgress >= 100
                    ? 'success'
                    : overallProgress > 0
                    ? 'warning'
                    : 'default'
                }
              />
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Section Cards */}
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} md={4} key={section.path}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: (theme) => theme.shadows[4],
                  cursor: 'pointer',
                },
              }}
              onClick={() => {
                window.location.href = `security-controls/${section.path}`;
              }}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>{section.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {section.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {section.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="textSecondary">
                      Progress: {section.progress}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={section.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ControlsOverviewPage;