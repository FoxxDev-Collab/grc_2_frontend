/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Chip,
  Paper,
} from '@mui/material';

/**
 * A component that renders security objective categories as chips
 */
const ObjectiveCategories = ({ objectives }) => {
  // Define category colors
  const categoryColors = {
    'Access': '#3498db',
    'Data': '#2ecc71',
    'Infrastructure': '#9b59b6',
    'Compliance': '#e67e22',
    'Application': '#f1c40f',
  };

  // Extract unique categories from objectives
  const getUniqueCategories = () => {
    const categories = objectives
      .map(obj => obj.category)
      .filter(Boolean) // Remove null/undefined
      .reduce((unique, category) => {
        if (!unique.includes(category)) {
          unique.push(category);
        }
        return unique;
      }, []);
    
    return categories;
  };

  const uniqueCategories = getUniqueCategories();

  return (
    <Paper sx={{ p: 3 }} variant="outlined">
      <Typography variant="h6" gutterBottom>Objective Categories</Typography>
      
      {uniqueCategories.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {uniqueCategories.map((category, index) => {
            // Get color for this category, with fallback
            const color = categoryColors[category] || '#95a5a6';
            
            return (
              <Chip 
                key={category}
                label={category}
                sx={{ 
                  bgcolor: color, 
                  color: 'white',
                  px: 1,
                  borderRadius: '15px',
                  fontWeight: 'medium',
                }}
              />
            );
          })}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No categories defined yet
        </Typography>
      )}
      
      {/* Category descriptions */}
      {uniqueCategories.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {uniqueCategories.map(category => {
            const color = categoryColors[category] || '#95a5a6';
            let description = '';
            
            // Provide descriptions for common categories
            switch(category) {
              case 'Access':
                description = 'Objectives related to access control, authentication, and authorization';
                break;
              case 'Data':
                description = 'Objectives focused on data protection, encryption, and privacy';
                break;
              case 'Infrastructure':
                description = 'Objectives for securing infrastructure, networks, and systems';
                break;
              case 'Compliance':
                description = 'Objectives addressing regulatory compliance and standards';
                break;
              case 'Application':
                description = 'Objectives for application security and secure development';
                break;
              default:
                description = `Objectives categorized as ${category}`;
            }
            
            return (
              <Box key={category} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color, mr: 1 }} />
                <Typography variant="body2" fontWeight="medium" sx={{ mr: 1 }}>
                  {category}:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

ObjectiveCategories.propTypes = {
  objectives: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      category: PropTypes.string,
    })
  ).isRequired,
};

export default ObjectiveCategories;