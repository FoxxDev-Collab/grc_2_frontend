/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
} from '@mui/material';

const PhaseHeader = ({ title, description, progress, phase }) => {
  const getProgressColor = (value) => {
    if (value >= 100) return 'success';
    if (value > 0) return 'warning';
    return 'default';
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {description}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={`${progress}% Complete`}
              color={getProgressColor(progress)}
              sx={{ mb: 1 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

PhaseHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  phase: PropTypes.string.isRequired,
};

export default PhaseHeader;