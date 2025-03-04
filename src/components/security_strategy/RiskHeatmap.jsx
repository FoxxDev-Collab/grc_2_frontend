/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

/**
 * A component that renders a risk heatmap visualization
 */
const RiskHeatmap = ({ risks }) => {
  // Define colors for different risk levels
  const riskColors = {
    critical: '#e74c3c',
    high: '#f39c12',
    medium: '#f1c40f',
    low: '#3498db',
  };

  // Define grid dimensions
  const gridDimensions = {
    width: '100%',
    height: 300,
    cellSize: 20,
  };

  // Create a 5x5 grid for the heatmap (likelihood x impact)
  const grid = Array(5).fill().map(() => Array(5).fill([]));

  // Populate the grid with risks
  risks.forEach(risk => {
    const likelihoodIndex = Math.min(Math.max(Math.floor(risk.likelihood) - 1, 0), 4);
    const impactIndex = Math.min(Math.max(Math.floor(risk.impact) - 1, 0), 4);
    
    if (!grid[impactIndex][likelihoodIndex]) {
      grid[impactIndex][likelihoodIndex] = [];
    }
    
    grid[impactIndex][likelihoodIndex].push(risk);
  });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Risk Heatmap</Typography>
      
      <Box sx={{ 
        position: 'relative', 
        height: gridDimensions.height, 
        width: gridDimensions.width,
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        mt: 2,
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Y-axis label (Impact) */}
        <Box sx={{ 
          position: 'absolute', 
          left: -40, 
          top: '50%', 
          transform: 'translateY(-50%) rotate(-90deg)', 
          transformOrigin: 'center',
          fontWeight: 'bold',
          fontSize: 14,
        }}>
          Impact
        </Box>
        
        {/* X-axis label (Likelihood) */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: -30, 
          left: '50%', 
          transform: 'translateX(-50%)',
          fontWeight: 'bold',
          fontSize: 14,
        }}>
          Likelihood
        </Box>
        
        {/* Heatmap grid */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          p: 2,
        }}>
          {/* Render grid rows (impact levels, inverted so 5 is at the top) */}
          {[...grid].reverse().map((row, rowIndex) => (
            <Box 
              key={`row-${rowIndex}`}
              sx={{ 
                display: 'flex',
                flex: 1,
                width: '100%',
                borderBottom: rowIndex < 4 ? '1px solid #e0e0e0' : 'none',
              }}
            >
              {/* Render grid cells (likelihood levels) */}
              {row.map((cell, cellIndex) => {
                // Calculate background color based on position in grid
                // Higher impact and likelihood = more red
                const impactLevel = 4 - rowIndex; // 4 is highest impact (top row)
                const likelihoodLevel = cellIndex; // 0 is lowest likelihood (left column)
                
                // Calculate heat level (0-4 for both axes)
                const heatLevel = Math.max(impactLevel, likelihoodLevel);
                
                // Determine background color based on heat level
                let bgColor = '#f8f9fa'; // Default light gray
                if (heatLevel >= 3) bgColor = 'rgba(231, 76, 60, 0.1)'; // Critical zone (light red)
                else if (heatLevel >= 2) bgColor = 'rgba(243, 156, 18, 0.1)'; // High zone (light orange)
                else if (heatLevel >= 1) bgColor = 'rgba(241, 196, 15, 0.1)'; // Medium zone (light yellow)
                
                return (
                  <Box 
                    key={`cell-${rowIndex}-${cellIndex}`}
                    sx={{ 
                      flex: 1,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: cellIndex < 4 ? '1px solid #e0e0e0' : 'none',
                      bgcolor: bgColor,
                      position: 'relative',
                      p: 0.5,
                    }}
                  >
                    {/* Render risks in this cell */}
                    {cell.map((risk, riskIndex) => (
                      <Box
                        key={`risk-${risk.id || riskIndex}`}
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          bgcolor: riskColors[risk.level] || riskColors.low,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 'bold',
                          m: 0.5,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        R{riskIndex + 1}
                      </Box>
                    ))}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
        
        {/* Impact axis labels */}
        <Box sx={{ position: 'absolute', left: -25, top: 10, fontSize: 12 }}>5</Box>
        <Box sx={{ position: 'absolute', left: -25, top: '25%', fontSize: 12 }}>4</Box>
        <Box sx={{ position: 'absolute', left: -25, top: '50%', fontSize: 12 }}>3</Box>
        <Box sx={{ position: 'absolute', left: -25, top: '75%', fontSize: 12 }}>2</Box>
        <Box sx={{ position: 'absolute', left: -25, bottom: 10, fontSize: 12 }}>1</Box>
        
        {/* Likelihood axis labels */}
        <Box sx={{ position: 'absolute', left: '10%', bottom: -20, fontSize: 12 }}>1</Box>
        <Box sx={{ position: 'absolute', left: '30%', bottom: -20, fontSize: 12 }}>2</Box>
        <Box sx={{ position: 'absolute', left: '50%', bottom: -20, fontSize: 12 }}>3</Box>
        <Box sx={{ position: 'absolute', left: '70%', bottom: -20, fontSize: 12 }}>4</Box>
        <Box sx={{ position: 'absolute', left: '90%', bottom: -20, fontSize: 12 }}>5</Box>
      </Box>
      
      {/* Legend */}
      <Box sx={{ display: 'flex', mt: 4, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: riskColors.critical, mr: 1 }} />
          <Typography variant="caption">Critical</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: riskColors.high, mr: 1 }} />
          <Typography variant="caption">High</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: riskColors.medium, mr: 1 }} />
          <Typography variant="caption">Medium</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: riskColors.low, mr: 1 }} />
          <Typography variant="caption">Low</Typography>
        </Box>
      </Box>
    </Box>
  );
};

RiskHeatmap.propTypes = {
  risks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      description: PropTypes.string,
      likelihood: PropTypes.number,
      impact: PropTypes.number,
      level: PropTypes.string,
    })
  ).isRequired,
};

export default RiskHeatmap;