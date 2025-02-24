/* eslint-disable react/prop-types */
import { Box, Grid, Paper, Typography, LinearProgress, Chip } from '@mui/material';

const StatusChip = ({ status }) => {
  const getColor = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'default';
      case 'retired':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      color={getColor()}
      size="small"
      sx={{ ml: 1 }}
    />
  );
};

const SystemsOverview = ({ systems }) => {
  const getAuthorizationProgress = (system) => {
    // Check if authorization package exists and has completion percentage
    if (system.phases?.authorization?.package?.completionPercentage) {
      return system.phases.authorization.package.completionPercentage;
    }
    return 0;
  };

  const getOverallProgress = (systems) => {
    if (!systems.length) return 0;
    const totalProgress = systems.reduce((acc, system) => {
      return acc + getAuthorizationProgress(system);
    }, 0);
    return totalProgress / systems.length;
  };

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Systems Overview
        </Typography>
        <Grid container spacing={3}>
          {/* Systems Status */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle1" component="h3" gutterBottom>
                Systems Status
              </Typography>
              {systems.map((system) => (
                <Box key={system.id} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" component="div">
                    {system.name}
                  </Typography>
                  <StatusChip status={system.status} />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Authorization Progress */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle1" component="h3" gutterBottom>
                Overall Authorization Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={getOverallProgress(systems)}
                    sx={{ height: 8, borderRadius: 2 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" component="div" color="text.secondary">
                    {Math.round(getOverallProgress(systems))}%
                  </Typography>
                </Box>
              </Box>
              {systems.map((system) => (
                <Box key={system.id} sx={{ mt: 2 }}>
                  <Typography variant="body2" component="div" gutterBottom>
                    {system.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={getAuthorizationProgress(system)}
                        sx={{ height: 4, borderRadius: 1 }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" component="div" color="text.secondary">
                        {Math.round(getAuthorizationProgress(system))}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default SystemsOverview;