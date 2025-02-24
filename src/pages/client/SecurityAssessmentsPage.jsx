import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { securityAssessmentsApi, auditApi } from '../../services';
import BasicRiskAssessment from '../../components/assessments/BasicRiskAssessment';
import AdvancedRiskAssessment from '../../components/assessments/AdvancedRiskAssessment';
import AssessmentHistory from '../../components/assessments/AssessmentHistory';

const SecurityAssessmentsPage = () => {
  const { clientId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
  const [promotionStatus, setPromotionStatus] = useState({ loading: false, error: null });

  const loadData = async () => {
    try {
      setLoading(true);
      const assessmentsData = await securityAssessmentsApi.getAssessments(clientId);
      setAssessments(assessmentsData);
      
      // Calculate stats from assessments
      if (assessmentsData.length > 0) {
        const totalScore = assessmentsData.reduce((sum, a) => sum + (a.score || 0), 0);
        setStats({
          averageScore: Math.round(totalScore / assessmentsData.length),
          totalAssessments: assessmentsData.length
        });
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [clientId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubmitAssessment = async (assessmentData) => {
    try {
      setLoading(true);
      await securityAssessmentsApi.submitAssessment(clientId, assessmentData);
      await loadData(); // Reload all data to get updated stats
      setActiveTab(2); // Switch to history tab
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAssessment = async (assessmentId) => {
    try {
      const assessment = await securityAssessmentsApi.getAssessment(assessmentId);
      // You could implement a detailed view dialog here
      console.log('Viewing assessment:', assessment);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompareAssessments = async (assessmentIds) => {
    try {
      setLoading(true);
      const assessmentsToCompare = await Promise.all(
        assessmentIds.map(id => securityAssessmentsApi.getAssessment(id))
      );

      // Sort by date
      assessmentsToCompare.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Calculate score changes
      const scoreChanges = assessmentsToCompare.map((assessment, index) => {
        if (index === 0) return { absolute: assessment.score, relative: 0 };
        const previousScore = assessmentsToCompare[index - 1].score;
        return {
          absolute: assessment.score,
          relative: assessment.score - previousScore,
        };
      });

      // Analyze findings
      const recommendationAnalysis = {
        new: [],
        completed: [],
        inProgress: [],
        recurring: []
      };

      setComparisonData({ scoreChanges, recommendationAnalysis });
      setComparisonDialogOpen(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToAudit = async (assessmentId, findingId = null) => {
    try {
      setPromotionStatus({ loading: true, error: null });
      
      // Get the assessment details
      const assessment = await securityAssessmentsApi.getAssessment(assessmentId);
      if (!assessment) throw new Error('Assessment not found');

      // Get the findings
      const findings = await securityAssessmentsApi.getFindings(assessmentId);
      
      // Determine which findings to promote
      const findingsToPromote = findingId 
        ? [findings.find(f => f.id === findingId)].filter(Boolean)
        : findings;

      if (!findingsToPromote.length) {
        throw new Error('No findings to promote');
      }

      // Promote each finding to a risk
      for (const finding of findingsToPromote) {
        await auditApi.promoteToRisk(finding.id, {
          clientId: Number(clientId),
          name: finding.title,
          description: finding.description || '',
          impact: finding.severity,
          likelihood: 'medium', // Default to medium likelihood
          category: finding.category || 'Security Finding'
        });
      }

      await loadData(); // Reload to get updated data
      setPromotionStatus({ loading: false, error: null });
    } catch (err) {
      setPromotionStatus({ loading: false, error: err.message });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {promotionStatus.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error promoting findings: {promotionStatus.error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Security Assessments
          {stats && (
            <Typography variant="subtitle1" color="text.secondary">
              Average Score: {stats.averageScore}% | Total Assessments: {stats.totalAssessments}
            </Typography>
          )}
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Basic Assessment" />
            <Tab label="Advanced Assessment" />
            <Tab label="Assessment History" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <BasicRiskAssessment
            onSubmitAssessment={(data) => handleSubmitAssessment({ ...data, type: 'basic' })}
          />
        )}
        {activeTab === 1 && (
          <AdvancedRiskAssessment
            onSubmitAssessment={(data) => handleSubmitAssessment({ ...data, type: 'advanced' })}
          />
        )}
        {activeTab === 2 && (
          <AssessmentHistory
            assessments={assessments}
            onViewAssessment={handleViewAssessment}
            onCompareAssessments={handleCompareAssessments}
            onPromoteToAudit={handlePromoteToAudit}
          />
        )}
      </Paper>

      {/* Comparison Dialog */}
      <Dialog
        open={comparisonDialogOpen}
        onClose={() => setComparisonDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Assessment Comparison</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Score Trends */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Score Trends
                  </Typography>
                  {comparisonData?.scoreChanges?.map((change, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body1">
                        Assessment {index + 1}: {change.absolute}%
                      </Typography>
                      {index > 0 && (
                        <Chip
                          icon={change.relative >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                          label={`${change.relative >= 0 ? '+' : ''}${change.relative}%`}
                          color={change.relative >= 0 ? 'success' : 'error'}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Finding Analysis */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    New Findings
                  </Typography>
                  <List>
                    {comparisonData?.recommendationAnalysis?.new?.map((finding) => (
                      <ListItem key={finding.id}>
                        <ListItemText
                          primary={finding.title}
                          secondary={`${finding.category} - ${finding.severity}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resolved Findings
                  </Typography>
                  <List>
                    {comparisonData?.recommendationAnalysis?.completed?.map((finding) => (
                      <ListItem key={finding.id}>
                        <ListItemText
                          primary={finding.title}
                          secondary={`${finding.category} - ${finding.severity}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComparisonDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SecurityAssessmentsPage;