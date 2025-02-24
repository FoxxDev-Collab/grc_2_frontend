/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Chip } from '@mui/material';
import {
  CheckCircle as CompleteIcon,
  RadioButtonUnchecked as IncompleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { getStatusColor } from './index';

const StatusChip = ({ status, size = 'small', showIcon = true }) => {
  const getStatusIcon = (status) => {
    const normalizedStatus = status.toLowerCase();
    if (['completed', 'complete', 'approved', 'active'].includes(normalizedStatus)) {
      return <CompleteIcon fontSize="small" />;
    }
    if (['in_progress', 'pending', 'warning'].includes(normalizedStatus)) {
      return <WarningIcon fontSize="small" />;
    }
    return <IncompleteIcon fontSize="small" />;
  };

  const formatLabel = (status) => {
    return status
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Chip
      size={size}
      label={formatLabel(status)}
      color={getStatusColor(status)}
      icon={showIcon ? getStatusIcon(status) : undefined}
      sx={{
        '& .MuiChip-icon': {
          color: 'inherit',
        },
      }}
    />
  );
};

StatusChip.propTypes = {
  status: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium']),
  showIcon: PropTypes.bool,
};

export default StatusChip;