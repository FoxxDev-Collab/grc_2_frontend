/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Security as SecurityIcon,
  Flag as FlagIcon,
  Timeline as TimelineIcon,
  BugReport as BugReportIcon,
} from '@mui/icons-material';

/**
 * A component that renders an overview dashboard for security strategy
 */
const SecurityStrategyOverview = ({ 
  riskStats, 
  objectiveStats, 
  initiativeStats,
  topRisks,
  topObjectives,
  onNavigateToRisks,
  onNavigateToObjectives,
  onNavigateToInitiatives
}) => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Security Posture Score */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h6" gutterBottom>Security Posture</Typography>
              <Chip 
                icon={<TrendingUpIcon fontSize="small" />} 
                label="Improving" 
                color="success" 
                size="small"
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Box 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: '50%', 
                  border: '10px solid', 
                  borderColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 3
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  {Math.round((
                    (riskStats?.treatmentProgress || 0) + 
                    (objectiveStats?.overallProgress || 0) + 
                    (initiativeStats?.overallProgress || 0)
                  ) / 3)}%
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" paragraph>
                  Your overall security posture score is based on risk treatment progress, 
                  security objectives completion, and security initiatives implementation.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {new Date().toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Strategy Progress */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Strategy Progress</Typography>
            
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Risk Treatment</Typography>
                <Typography variant="body2" fontWeight="bold">{riskStats?.treatmentProgress || 0}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={riskStats?.treatmentProgress || 0} 
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Security Objectives</Typography>
                <Typography variant="body2" fontWeight="bold">{objectiveStats?.overallProgress || 0}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={objectiveStats?.overallProgress || 0} 
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Security Initiatives</Typography>
                <Typography variant="body2" fontWeight="bold">{initiativeStats?.overallProgress || 0}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={initiativeStats?.overallProgress || 0} 
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Estimated completion: {objectiveStats?.completionForecast || 'Q4 2025'}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Risk Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BugReportIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Risk Summary</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Total Risks</Typography>
                <Typography variant="body2" fontWeight="bold">{riskStats?.total || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Critical Risks</Typography>
                <Typography variant="body2" fontWeight="bold" color="error.main">{riskStats?.critical || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">High Risks</Typography>
                <Typography variant="body2" fontWeight="bold" color="warning.main">{riskStats?.high || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Open Risks</Typography>
                <Typography variant="body2" fontWeight="bold">{riskStats?.open || 0}</Typography>
              </Box>
              
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={onNavigateToRisks}
              >
                Manage Risks
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Objectives Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FlagIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Objectives Summary</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Total Objectives</Typography>
                <Typography variant="body2" fontWeight="bold">{objectiveStats?.total || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Completed</Typography>
                <Typography variant="body2" fontWeight="bold" color="success.main">{objectiveStats?.completed || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">In Progress</Typography>
                <Typography variant="body2" fontWeight="bold" color="info.main">{objectiveStats?.inProgress || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Not Started</Typography>
                <Typography variant="body2" fontWeight="bold">{objectiveStats?.notStarted || 0}</Typography>
              </Box>
              
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={onNavigateToObjectives}
              >
                View Objectives
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Initiatives Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Initiatives Summary</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Total Initiatives</Typography>
                <Typography variant="body2" fontWeight="bold">{initiativeStats?.total || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Completed</Typography>
                <Typography variant="body2" fontWeight="bold" color="success.main">{initiativeStats?.completed || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">In Progress</Typography>
                <Typography variant="body2" fontWeight="bold" color="info.main">{initiativeStats?.inProgress || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Upcoming</Typography>
                <Typography variant="body2" fontWeight="bold">{initiativeStats?.upcoming || 0}</Typography>
              </Box>
              
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={onNavigateToInitiatives}
              >
                View Roadmap
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Top Risks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Top Risks</Typography>
            
            {topRisks && topRisks.length > 0 ? (
              <Box>
                {topRisks.slice(0, 3).map((risk, index) => (
                  <Box 
                    key={risk.id || index} 
                    sx={{ 
                      p: 1.5, 
                      mb: 1, 
                      bgcolor: '#f8f9fa', 
                      borderRadius: 1,
                      borderLeft: '4px solid',
                      borderLeftColor: 
                        risk.level === 'critical' ? 'error.main' :
                        risk.level === 'high' ? 'warning.main' :
                        'info.main'
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">{risk.name}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Chip 
                        label={risk.level} 
                        size="small"
                        color={
                          risk.level === 'critical' ? 'error' :
                          risk.level === 'high' ? 'warning' :
                          'info'
                        }
                      />
                      <Typography variant="caption">{risk.status || 'Open'}</Typography>
                    </Box>
                  </Box>
                ))}
                
                <Button 
                  variant="text" 
                  sx={{ mt: 1 }}
                  onClick={onNavigateToRisks}
                >
                  View All Risks
                </Button>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No risks defined yet.
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Top Objectives */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Key Objectives</Typography>
            
            {topObjectives && topObjectives.length > 0 ? (
              <Box>
                {topObjectives.slice(0, 3).map((objective, index) => (
                  <Box 
                    key={objective.id || index} 
                    sx={{ 
                      p: 1.5, 
                      mb: 1, 
                      bgcolor: '#f8f9fa', 
                      borderRadius: 1,
                      borderLeft: '4px solid',
                      borderLeftColor: 
                        objective.category === 'Access' ? '#3498db' :
                        objective.category === 'Data' ? '#2ecc71' :
                        objective.category === 'Infrastructure' ? '#9b59b6' :
                        objective.category === 'Compliance' ? '#e67e22' :
                        '#f1c40f'
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">{objective.name}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Chip 
                        label={objective.category || 'General'} 
                        size="small"
                        sx={{ 
                          bgcolor: 
                            objective.category === 'Access' ? 'rgba(52, 152, 219, 0.1)' :
                            objective.category === 'Data' ? 'rgba(46, 204, 113, 0.1)' :
                            objective.category === 'Infrastructure' ? 'rgba(155, 89, 182, 0.1)' :
                            objective.category === 'Compliance' ? 'rgba(230, 126, 34, 0.1)' :
                            'rgba(241, 196, 15, 0.1)',
                          color: 
                            objective.category === 'Access' ? '#3498db' :
                            objective.category === 'Data' ? '#2ecc71' :
                            objective.category === 'Infrastructure' ? '#9b59b6' :
                            objective.category === 'Compliance' ? '#e67e22' :
                            '#f1c40f',
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ mr: 1 }}>
                          {objective.progress || 0}%
                        </Typography>
                        <Box sx={{ width: 60 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={objective.progress || 0} 
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
                
                <Button 
                  variant="text" 
                  sx={{ mt: 1 }}
                  onClick={onNavigateToObjectives}
                >
                  View All Objectives
                </Button>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No objectives defined yet.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

SecurityStrategyOverview.propTypes = {
  riskStats: PropTypes.shape({
    total: PropTypes.number,
    critical: PropTypes.number,
    high: PropTypes.number,
    medium: PropTypes.number,
    low: PropTypes.number,
    open: PropTypes.number,
    treatmentProgress: PropTypes.number,
  }),
  objectiveStats: PropTypes.shape({
    total: PropTypes.number,
    completed: PropTypes.number,
    inProgress: PropTypes.number,
    notStarted: PropTypes.number,
    overallProgress: PropTypes.number,
    completionForecast: PropTypes.string,
  }),
  initiativeStats: PropTypes.shape({
    total: PropTypes.number,
    completed: PropTypes.number,
    inProgress: PropTypes.number,
    upcoming: PropTypes.number,
    overallProgress: PropTypes.number,
  }),
  topRisks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      level: PropTypes.string,
      status: PropTypes.string,
    })
  ),
  topObjectives: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      category: PropTypes.string,
      progress: PropTypes.number,
    })
  ),
  onNavigateToRisks: PropTypes.func,
  onNavigateToObjectives: PropTypes.func,
  onNavigateToInitiatives: PropTypes.func,
};

SecurityStrategyOverview.defaultProps = {
  riskStats: {
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    open: 0,
    treatmentProgress: 0,
  },
  objectiveStats: {
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    overallProgress: 0,
    completionForecast: 'Q4 2025',
  },
  initiativeStats: {
    total: 0,
    completed: 0,
    inProgress: 0,
    upcoming: 0,
    overallProgress: 0,
  },
  topRisks: [],
  topObjectives: [],
  onNavigateToRisks: () => {},
  onNavigateToObjectives: () => {},
  onNavigateToInitiatives: () => {},
};

export default SecurityStrategyOverview;