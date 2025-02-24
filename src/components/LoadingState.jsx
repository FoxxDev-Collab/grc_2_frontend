/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import {
  Box,
  Container,
  LinearProgress,
  Typography,
  Paper,
  Skeleton,
} from '@mui/material';

const LoadingState = ({ message = 'Loading...', variant = 'default' }) => {
  if (variant === 'skeleton') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="40%" height={24} />
        </Paper>
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" width={200} height={40} />
            <Skeleton variant="rectangular" width={200} height={40} />
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
        {message && (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

LoadingState.propTypes = {
  message: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'skeleton']),
};

export default LoadingState;