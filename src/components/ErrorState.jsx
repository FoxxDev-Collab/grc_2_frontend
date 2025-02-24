
import PropTypes from 'prop-types';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  AlertTitle,
} from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const ErrorState = ({
  title = 'Error',
  message = 'An error occurred while loading the data.',
  onRetry,
  error,
  showDetails = false,
}) => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Alert 
          severity="error"
          icon={<ErrorIcon />}
          action={
            onRetry && (
              <Button
                color="error"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={onRetry}
              >
                Retry
              </Button>
            )
          }
        >
          <AlertTitle>{title}</AlertTitle>
          {message}
          {showDetails && error && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {typeof error === 'string' ? error : error.message}
              </Typography>
            </Box>
          )}
        </Alert>
      </Paper>
    </Container>
  );
};

ErrorState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onRetry: PropTypes.func,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      message: PropTypes.string,
      stack: PropTypes.string,
    }),
  ]),
  showDetails: PropTypes.bool,
};

export default ErrorState;