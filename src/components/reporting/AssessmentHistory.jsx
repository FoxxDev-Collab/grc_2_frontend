/* eslint-disable react/prop-types */
import { Box, Grid, Paper, Typography, LinearProgress, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { securityAssessmentsApi } from '../../services';

const StatusChip = ({ status }) => {
  const getColor = () => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'pending_review':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={status.replace('_', ' ').toUpperCase()}
      color={getColor()}
      size="small"
      sx={{ ml: 1 }}
    />
  );
};

const AssessmentHistory = ({ clientId }) => {
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        setLoading(true);
        const data = await securityAssessmentsApi.getAssessments(clientId, { sortBy: 'date' });
        setAssessments(data);
      } catch (error) {
        console.error('Error loading assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
    // Poll for updates every 30 seconds
    const interval = setInterval(loadAssessments, 30000);
    return () => clearInterval(interval);
  }, [clientId]);

  if (loading || !assessments.length) {
    return (
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        </Paper>
      </Grid>
    );
  }

  // Calculate average score from completed assessments
  const completedAssessments = assessments.filter(a => a.status === 'completed');
  const averageScore = completedAssessments.length
    ? Math.round(completedAssessments.reduce((acc, curr) => acc + curr.score, 0) / completedAssessments.length)
    : 0;

  // Calculate score trend
  const scoreTrend = completedAssessments.length >= 2
    ? completedAssessments[0].score - completedAssessments[1].score
    : 0;

  // Count assessments by type
  const assessmentTypes = assessments.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  // Get findings statistics
  const findingsStats = assessments.reduce((acc, curr) => {
    if (curr.generatedFindings) {
      curr.generatedFindings.forEach(finding => {
        // Count by severity
        acc.bySeverity[finding.severity] = (acc.bySeverity[finding.severity] || 0) + 1;
        // Count by status
        acc.byStatus[finding.status.toLowerCase()] = (acc.byStatus[finding.status.toLowerCase()] || 0) + 1;
      });
    }
    return acc;
  }, {
    bySeverity: {},
    byStatus: { open: 0, in_progress: 0, completed: 0 }
  });

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Assessment History & Findings
        </Typography>
        <Grid container spacing={3}>
          {/* Score Overview */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle1" component="h3" gutterBottom>
                Assessment Overview
              </Typography>
              <Typography variant="h3" component="div" color="primary" gutterBottom>
                {averageScore}%
              </Typography>
              <Typography 
                variant="body2"
                component="div"
                color={scoreTrend >= 0 ? 'success.main' : 'error.main'}
              >
                {scoreTrend >= 0 ? '↑' : '↓'} {Math.abs(scoreTrend)}% from last assessment
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" component="div">
                  <strong>Total Assessments:</strong> {assessments.length}
                </Typography>
                {Object.entries(assessmentTypes).map(([type, count]) => (
                  <Typography key={type} variant="body2" component="div">
                    <strong>{type.charAt(0).toUpperCase() + type.slice(1)}:</strong> {count}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Recent Assessments */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle1" component="h3" gutterBottom>
                Recent Assessments
              </Typography>
              {assessments.slice(0, 5).map((assessment) => (
                <Box key={assessment.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" component="div">
                      {assessment.name}
                    </Typography>
                    <StatusChip status={assessment.status} />
                  </Box>
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={assessment.score || 0}
                        sx={{ height: 8, borderRadius: 2 }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" component="div" color="text.secondary">
                        {assessment.score || 0}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Findings Overview */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle1" component="h3" gutterBottom>
                Findings Overview
              </Typography>
              <Box sx={{ mt: 1 }}>
                {Object.entries(findingsStats.bySeverity).map(([severity, count]) => (
                  <Box key={severity} sx={{ mb: 1 }}>
                    <Typography variant="body2" component="div">
                      <strong>{severity.toUpperCase()}:</strong> {count} findings
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" component="div">
                  <strong>Open:</strong> {findingsStats.byStatus.open || 0}
                </Typography>
                <Typography variant="body2" component="div">
                  <strong>In Progress:</strong> {findingsStats.byStatus.in_progress || 0}
                </Typography>
                <Typography variant="body2" component="div">
                  <strong>Completed:</strong> {findingsStats.byStatus.completed || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default AssessmentHistory;