/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Button,
} from '@mui/material';

/**
 * A component that renders a list of security objectives with their details
 */
const ObjectivesList = ({ objectives, onViewMore }) => {
  // Define category colors
  const categoryColors = {
    'Access': {
      main: '#3498db',
      light: 'rgba(52, 152, 219, 0.1)',
    },
    'Data': {
      main: '#2ecc71',
      light: 'rgba(46, 204, 113, 0.1)',
    },
    'Infrastructure': {
      main: '#9b59b6',
      light: 'rgba(155, 89, 182, 0.1)',
    },
    'Compliance': {
      main: '#e67e22',
      light: 'rgba(230, 126, 34, 0.1)',
    },
    'Application': {
      main: '#f1c40f',
      light: 'rgba(241, 196, 15, 0.1)',
    },
  };

  // Get color for a category, with fallback
  const getCategoryColor = (category) => {
    return categoryColors[category] || { 
      main: '#95a5a6', 
      light: 'rgba(149, 165, 166, 0.1)' 
    };
  };

  return (
    <Box>
      {objectives.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No security objectives defined yet. Add your first objective to get started.
        </Typography>
      ) : (
        <>
          {objectives.map((objective) => {
            const categoryColor = getCategoryColor(objective.category);
            
            return (
              <Paper 
                key={objective.id}
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  bgcolor: '#f8f9fa',
                  borderLeft: '5px solid',
                  borderLeftColor: categoryColor.main,
                }}
                elevation={1}
              >
                <Typography variant="subtitle1" fontWeight="bold">{objective.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {objective.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {objective.category && (
                      <Chip 
                        label={objective.category}
                        size="small"
                        sx={{ 
                          bgcolor: categoryColor.light,
                          color: categoryColor.main,
                        }}
                      />
                    )}
                    {objective.priority && (
                      <Chip 
                        label={objective.priority}
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(74, 117, 245, 0.1)',
                          color: '#4a75f5',
                        }}
                      />
                    )}
                    {objective.status && (
                      <Chip 
                        label={objective.status}
                        size="small"
                        sx={{ 
                          bgcolor: objective.status === 'completed' ? 'rgba(46, 204, 113, 0.1)' :
                                  objective.status === 'in-progress' ? 'rgba(52, 152, 219, 0.1)' :
                                  'rgba(149, 165, 166, 0.1)',
                          color: objective.status === 'completed' ? '#2ecc71' :
                                objective.status === 'in-progress' ? '#3498db' :
                                '#95a5a6',
                        }}
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {objective.progress || 0}%
                    </Typography>
                    <Box sx={{ width: 100 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={objective.progress || 0} 
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          bgcolor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: categoryColor.main,
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            );
          })}
          
          {objectives.length > 3 && onViewMore && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button variant="outlined" onClick={onViewMore}>
                View All Objectives
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

ObjectivesList.propTypes = {
  objectives: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      category: PropTypes.string,
      priority: PropTypes.string,
      status: PropTypes.string,
      progress: PropTypes.number,
    })
  ).isRequired,
  onViewMore: PropTypes.func,
};

export default ObjectivesList;