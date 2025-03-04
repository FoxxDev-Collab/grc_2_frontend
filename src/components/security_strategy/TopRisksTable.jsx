/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
} from '@mui/material';

/**
 * A component that renders a table of top risks
 */
const TopRisksTable = ({ risks, maxItems = 5 }) => {
  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'warning';
      case 'in progress':
      case 'in-progress':
        return 'info';
      case 'completed':
      case 'closed':
        return 'success';
      case 'not started':
      case 'not-started':
        return 'default';
      default:
        return 'default';
    }
  };

  // Get level color
  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  // Sort risks by level (critical first, then high, etc.)
  const sortedRisks = [...risks].sort((a, b) => {
    const levelOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (levelOrder[a.level?.toLowerCase()] || 4) - (levelOrder[b.level?.toLowerCase()] || 4);
  });

  // Take only the top N risks
  const topRisks = sortedRisks.slice(0, maxItems);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Top Risks</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell>ID</TableCell>
              <TableCell>Risk</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topRisks.length > 0 ? (
              topRisks.map((risk, index) => (
                <TableRow key={risk.id || index} hover>
                  <TableCell>R{index + 1}</TableCell>
                  <TableCell>{risk.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={risk.level || 'Unknown'} 
                      size="small"
                      color={getLevelColor(risk.level)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={risk.status || 'Open'} 
                      size="small"
                      color={getStatusColor(risk.status)}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No risks found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

TopRisksTable.propTypes = {
  risks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      level: PropTypes.string,
      status: PropTypes.string,
    })
  ).isRequired,
  maxItems: PropTypes.number,
};

export default TopRisksTable;