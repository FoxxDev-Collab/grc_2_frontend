import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Skeleton,
  Alert,
} from '@mui/material';
import { clientApi, securityAssessmentsApi, systemApi } from '../../services';
import SystemsOverview from '../../components/reporting/SystemsOverview';
import AssessmentHistory from '../../components/reporting/AssessmentHistory';

const POLLING_INTERVAL = 30000; // 30 seconds

const DashboardPage = () => {
  const { clientId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    client: null,
    latestAssessment: null,
    systems: []
  });

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [clientData, assessments, systemsData] = await Promise.all([
        clientApi.getClient(Number(clientId)),
        securityAssessmentsApi.getAssessments(clientId, { sortBy: 'date' }),
        systemApi.getSystems(clientId)
      ]);

      // Get the latest assessment (first one since we sorted by date)
      const latestAssessment = assessments.length > 0 ? assessments[0] : null;

      setDashboardData({
        client: clientData,
        latestAssessment,
        systems: systemsData
      });
      setError('');
    } catch (err) {
      setError('Failed to load dashboard information');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  // Initial load
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Set up polling for live updates
  useEffect(() => {
    const pollInterval = setInterval(loadDashboardData, POLLING_INTERVAL);
    return () => clearInterval(pollInterval);
  }, [loadDashboardData]);

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} md={6} key={item}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const { client, latestAssessment, systems } = dashboardData;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {client.name} Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Company Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Company Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Industry:</strong> {client.industry}
              </Typography>
              <Typography variant="body1">
                <strong>Primary Contact:</strong> {client.primaryContact}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {client.email}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> {client.phone}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Latest Assessment */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Latest Security Assessment
            </Typography>
            {latestAssessment ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h3" component="p" gutterBottom color="primary">
                  {latestAssessment.score}%
                </Typography>
                <Typography variant="body1">
                  <strong>Type:</strong> {latestAssessment.type}
                </Typography>
                <Typography variant="body1">
                  <strong>Date:</strong> {new Date(latestAssessment.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong> {latestAssessment.status}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No assessments available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Systems Overview */}
        <SystemsOverview systems={systems} />

        {/* Assessment History */}
        <AssessmentHistory clientId={clientId} />
      </Grid>
    </Box>
  );
};

export default DashboardPage;