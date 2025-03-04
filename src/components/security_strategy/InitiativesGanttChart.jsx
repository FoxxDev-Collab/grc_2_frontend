/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';

/**
 * A component that renders a Gantt chart for security initiatives
 */
const InitiativesGanttChart = ({ initiatives, dateRange }) => {
  // Define colors for different initiative categories
  const categoryColors = {
    'Access Control': '#3498db',
    'Infrastructure': '#9b59b6',
    'Data Protection': '#2ecc71',
    'Application Security': '#f39c12',
    'Network Security': '#e74c3c',
  };

  // Get current date for "today" marker
  const today = new Date();
  
  // Generate months for the header based on date range
  const months = [];
  const startDate = dateRange?.start || new Date(new Date().getFullYear(), 0, 1); // Jan 1 of current year
  const endDate = dateRange?.end || new Date(new Date().getFullYear(), 11, 31); // Dec 31 of current year
  
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();
  
  for (let year = startYear; year <= endYear; year++) {
    const monthStart = year === startYear ? startMonth : 0;
    const monthEnd = year === endYear ? endMonth : 11;
    
    for (let month = monthStart; month <= monthEnd; month++) {
      months.push(new Date(year, month, 1));
    }
  }

  // Helper functions for Gantt chart
  const calculatePosition = (date) => {
    if (!date) return 0;
    
    const firstMonth = months[0];
    const monthWidth = 80; // width of each month column
    
    // Calculate months difference
    const monthsDiff = (date.getFullYear() - firstMonth.getFullYear()) * 12 + 
                      date.getMonth() - firstMonth.getMonth();
    
    // Calculate days into the month
    const daysIntoMonth = date.getDate() / new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
    return monthsDiff * monthWidth + daysIntoMonth * monthWidth;
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 80; // default to one month width
    
    // Calculate months difference
    const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      endDate.getMonth() - startDate.getMonth();
    
    // Calculate days difference within the month
    const startDaysIntoMonth = startDate.getDate() / new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
    const endDaysIntoMonth = endDate.getDate() / new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
    
    const monthWidth = 80; // width of each month column
    return (monthsDiff + endDaysIntoMonth - startDaysIntoMonth) * monthWidth;
  };

  const calculateTodayPosition = () => {
    return calculatePosition(today);
  };

  // Get color for a category, with fallback
  const getCategoryColor = (category) => {
    return categoryColors[category] || '#95a5a6'; // Default gray
  };

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box sx={{ minWidth: 800, p: 2 }}>
        {/* Gantt Chart Header */}
        <Box sx={{ display: 'flex', mb: 2 }}>
          <Box sx={{ 
            width: 200, 
            p: 1, 
            fontWeight: 'bold', 
            bgcolor: '#f8f9fa',
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
          }}>
            Initiative
          </Box>
          <Box sx={{ display: 'flex', flex: 1 }}>
            {months.map((month, index) => (
              <Box 
                key={index} 
                sx={{ 
                  width: 80, 
                  p: 1, 
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  bgcolor: '#f8f9fa',
                  borderLeft: '1px solid #e0e0e0',
                  ...(index === months.length - 1 ? {
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                  } : {})
                }}
              >
                {month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Today Marker - calculate position */}
        <Box sx={{ position: 'relative' }}>
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `calc(200px + ${calculateTodayPosition()}px)`,
              width: '2px',
              bgcolor: '#e74c3c',
              zIndex: 1,
              borderStyle: 'dashed'
            }}
          />
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: `calc(200px + ${calculateTodayPosition() - 10}px)`,
              width: 20,
              height: 20,
              borderRadius: '50%',
              bgcolor: '#e74c3c',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}
          >
            T
          </Box>
        </Box>
        
        {/* Initiatives */}
        {initiatives.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No security initiatives defined yet. Add your first initiative to get started.
            </Typography>
          </Box>
        ) : (
          initiatives.map((initiative, index) => {
            // Parse dates
            const startDate = initiative.startDate ? new Date(initiative.startDate) : today;
            const endDate = initiative.endDate ? 
              new Date(initiative.endDate) : 
              new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
            
            // Calculate positions
            const startPosition = calculatePosition(startDate);
            const duration = calculateDuration(startDate, endDate);
            const progress = initiative.progress || 0;
            
            // Get color based on category
            const color = getCategoryColor(initiative.category);
            
            return (
              <Box key={initiative.id} sx={{ display: 'flex', mb: 2, height: 40 }}>
                <Box 
                  sx={{ 
                    width: 200, 
                    p: 1, 
                    display: 'flex', 
                    alignItems: 'center',
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  <Typography variant="body2" fontWeight="bold" noWrap>
                    {initiative.name}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    flex: 1, 
                    position: 'relative',
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      left: startPosition,
                      width: duration,
                      height: 30,
                      bgcolor: `${color}40`, // 40% opacity
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      px: 1
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: `${progress}%`,
                        height: 30,
                        bgcolor: color,
                        borderRadius: 1.5,
                        position: 'absolute',
                        left: 0,
                        top: 0
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'white', 
                        zIndex: 1, 
                        ml: 1,
                        fontWeight: 'bold',
                        mixBlendMode: 'difference'
                      }}
                    >
                      {progress}% Complete
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'white', 
                        zIndex: 1, 
                        ml: 'auto',
                        mr: 1,
                        fontWeight: 'bold',
                        mixBlendMode: 'difference'
                      }}
                    >
                      {endDate.toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
      
      {/* Legend */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, p: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0' }}>
        {Object.entries(categoryColors).map(([category, color]) => (
          <Box key={category} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, mr: 1 }} />
            <Typography variant="caption">{category}</Typography>
          </Box>
        ))}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 10, height: 2, bgcolor: '#e74c3c', mr: 1, borderStyle: 'dashed' }} />
          <Typography variant="caption">Today</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <Box sx={{ width: 30, height: 10, bgcolor: '#3498db', mr: 1, borderRadius: 1 }} />
          <Typography variant="caption">Progress Complete</Typography>
        </Box>
      </Box>
    </Box>
  );
};

InitiativesGanttChart.propTypes = {
  initiatives: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      category: PropTypes.string,
      startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      progress: PropTypes.number,
      status: PropTypes.string,
    })
  ).isRequired,
  dateRange: PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  }),
};

export default InitiativesGanttChart;