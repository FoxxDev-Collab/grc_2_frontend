/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';

/**
 * A component that renders an overview of risk statistics
 */
const RiskStatsOverview = ({ stats }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="subtitle1" color="text.secondary">Total Risks</Typography>
            <Typography variant="h3" sx={{ mt: 2, fontWeight: 'bold' }}>
              {stats?.total || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="subtitle1" color="text.secondary">Critical Risks</Typography>
            <Typography variant="h3" sx={{ mt: 2, fontWeight: 'bold', color: '#e74c3c' }}>
              {stats?.critical || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="subtitle1" color="text.secondary">High Risks</Typography>
            <Typography variant="h3" sx={{ mt: 2, fontWeight: 'bold', color: '#f39c12' }}>
              {stats?.high || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="subtitle1" color="text.secondary">Risk Treatment</Typography>
            <Box sx={{ mt: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={stats?.treatmentProgress || 0} 
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold', textAlign: 'center' }}>
              {stats?.treatmentProgress || 0}% Complete
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

RiskStatsOverview.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number,
    critical: PropTypes.number,
    high: PropTypes.number,
    medium: PropTypes.number,
    low: PropTypes.number,
    treatmentProgress: PropTypes.number,
  }),
};

RiskStatsOverview.defaultProps = {
  stats: {
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    treatmentProgress: 0,
  },
};

export default RiskStatsOverview;