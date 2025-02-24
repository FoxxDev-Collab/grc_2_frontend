/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import {
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { reportingApi } from '../../services';

const ExecutiveDashboard = () => {
  const { clientId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const dashboardData = await reportingApi.getExecutiveDashboard(Number(clientId));
        setData(dashboardData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
    // Poll for updates every minute
    const interval = setInterval(loadDashboard, 60000);
    return () => clearInterval(interval);
  }, [clientId]);

  const handleExport = async () => {
    try {
      setExportLoading(true);
      const report = await reportingApi.getExecutiveDashboard(Number(clientId));
      const doc = await reportingApi.generateExecutiveReport(report);
      const fileName = `${report.client?.name.replace(/\s+/g, '_')}_Security_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report');
    } finally {
      setExportLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'finding':
        return <ErrorIcon fontSize="small" color="error" />;
      case 'risk':
        return <WarningIcon fontSize="small" color="warning" />;
      case 'assessment':
        return <AssessmentIcon fontSize="small" color="info" />;
      default:
        return <CheckCircleIcon fontSize="small" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'closed':
      case 'mitigated':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'open':
      case 'active':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!data) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">
            {data.client?.name} Executive Security Dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={exportLoading}
          >
            {exportLoading ? 'Generating...' : 'Export Report'}
          </Button>
        </Box>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Overview" />
          <Tab label="Systems" />
          <Tab label="Assessments" />
          <Tab label="Risks" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {activeTab === 0 && (
        <>
          {/* Overall Security Score */}
          <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Overall Security Score
            </Typography>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={data.overallScore}
                size={120}
                thickness={4}
                sx={{
                  color: data.overallScore >= 80 ? 'success.main' :
                    data.overallScore >= 60 ? 'warning.main' : 'error.main'
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" component="div">
                  {data.overallScore}%
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Assessments
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {data.summary.assessments.averageScore}%
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Average Score
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2">
                    {data.summary.assessments.total} Total Assessments
                  </Typography>
                  <Typography variant="body2">
                    Last Assessment: {formatDate(data.summary.assessments.lastAssessment?.date)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Findings
                  </Typography>
                  <Typography variant="h3" color={data.summary.findings.open > 0 ? 'error' : 'success'}>
                    {data.summary.findings.open}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Open Findings
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2">
                    {data.summary.findings.critical} Critical/High Findings
                  </Typography>
                  <Typography variant="body2">
                    {data.summary.findings.total} Total Findings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Risks
                  </Typography>
                  <Typography variant="h3" color={data.summary.risks.active > 0 ? 'warning' : 'success'}>
                    {data.summary.risks.active}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Active Risks
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2">
                    {data.summary.risks.critical} High Impact Risks
                  </Typography>
                  <Typography variant="body2">
                    {data.summary.risks.total} Total Risks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Activity */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.recentActivity.map((activity, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getActivityIcon(activity.type)}
                          <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                            {activity.type}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {activity.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(activity.date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={activity.status}
                          color={getStatusColor(activity.status)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {/* Systems Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {data.systems?.map(system => (
            <Grid item xs={12} md={6} key={system.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {system.name}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Type:</strong> {system.type}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Category:</strong> {system.category}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Security Level:</strong> {system.securityLevel}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" gutterBottom>
                  Compliance Scores
                </Typography>
                {Object.entries(system.compliance || {}).map(([framework, score]) => (
                  <Box key={framework} sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      {framework.toUpperCase()}: {score}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={score}
                      sx={{ height: 8, borderRadius: 2 }}
                    />
                  </Box>
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Assessments Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Assessment History
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Findings</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.summary.assessments.trend?.map((assessment, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(assessment.date)}</TableCell>
                        <TableCell>{assessment.type || 'Standard'}</TableCell>
                        <TableCell>
                          <Typography
                            color={
                              assessment.score >= 80 ? 'success.main' :
                              assessment.score >= 60 ? 'warning.main' : 'error.main'
                            }
                          >
                            {assessment.score}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={assessment.status || 'Completed'}
                            color={getStatusColor(assessment.status || 'completed')}
                          />
                        </TableCell>
                        <TableCell>{assessment.findings || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Risks Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Active Risks
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Risk</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Impact</TableCell>
                      <TableCell>Likelihood</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.topRisks?.map((risk, index) => (
                      <TableRow key={index}>
                        <TableCell>{risk.name}</TableCell>
                        <TableCell>{risk.category}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={risk.impact}
                            color={
                              risk.impact === 'high' ? 'error' :
                              risk.impact === 'medium' ? 'warning' : 'info'
                            }
                          />
                        </TableCell>
                        <TableCell>{risk.likelihood}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={risk.status}
                            color={getStatusColor(risk.status)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ExecutiveDashboard;