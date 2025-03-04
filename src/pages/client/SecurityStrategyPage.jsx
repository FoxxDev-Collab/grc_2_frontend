/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { 
  riskAssessmentApi, 
  securityObjectivesApi, 
  securityInitiativesApi, 
  auditApi 
} from '../../services';
import SecurityStrategyOverview from '../../components/security_strategy/SecurityStrategyOverview';

const SecurityStrategyPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    risks: [],
    objectives: [],
    initiatives: [],
    riskStats: null,
    frameworkProgress: null,
    riskObjectiveMappings: [],
    objectiveInitiativeMappings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statuses, setStatuses] = useState({
    objective: [],
    initiative: []
  });
  const [priorityLevels, setPriorityLevels] = useState([]);
  const [phases, setPhases] = useState([]);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [findingDialogOpen, setFindingDialogOpen] = useState(false);
  const [objectiveStats, setObjectiveStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    overallProgress: 0,
    completionForecast: 'Q4 2025',
  });
  const [initiativeStats, setInitiativeStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    upcoming: 0,
    overallProgress: 0,
  });

  useEffect(() => {
    const loadSecurityStrategy = async () => {
      try {
        setLoading(true);
        const [
          risks,
          objectives,
          initiatives,
          objectiveStatuses,
          initiativeStatuses,
          priorities,
          phaseOptions,
          riskStats,
          frameworkProgress,
          riskObjectiveMappings,
          objectiveInitiativeMappings
        ] = await Promise.all([
          riskAssessmentApi.getRisks(clientId),
          securityObjectivesApi.getObjectives(clientId),
          securityInitiativesApi.getInitiatives(clientId),
          securityObjectivesApi.getObjectiveStatuses(),
          securityInitiativesApi.getInitiativeStatuses(),
          securityObjectivesApi.getPriorityLevels(),
          securityInitiativesApi.getPhases(),
          riskAssessmentApi.getRiskStats(clientId),
          riskAssessmentApi.getFrameworkProgress(clientId),
          riskAssessmentApi.getRiskObjectiveMappings(clientId),
          riskAssessmentApi.getObjectiveInitiativeMappings(clientId)
        ]);

        setData({
          risks,
          objectives,
          initiatives,
          riskStats,
          frameworkProgress,
          riskObjectiveMappings,
          objectiveInitiativeMappings
        });
        setStatuses({
          objective: objectiveStatuses,
          initiative: initiativeStatuses
        });
        setPriorityLevels(priorities);
        setPhases(phaseOptions);
        
        // Calculate objective statistics
        const totalObjectives = objectives.length;
        const completedObjectives = objectives.filter(obj => obj.status === 'completed').length;
        const inProgressObjectives = objectives.filter(obj => obj.status === 'in-progress').length;
        const notStartedObjectives = objectives.filter(obj => obj.status === 'not-started').length;
        
        // Calculate overall progress
        const overallObjectiveProgress = totalObjectives > 0 
          ? Math.round((completedObjectives + (inProgressObjectives * 0.5)) / totalObjectives * 100) 
          : 0;
        
        setObjectiveStats({
          total: totalObjectives,
          completed: completedObjectives,
          inProgress: inProgressObjectives,
          notStarted: notStartedObjectives,
          overallProgress: overallObjectiveProgress,
          completionForecast: 'Q4 2025', // This would typically come from the API
        });
        
        // Calculate initiative statistics
        const totalInitiatives = initiatives.length;
        const completedInitiatives = initiatives.filter(init => init.status === 'completed').length;
        const inProgressInitiatives = initiatives.filter(init => init.status === 'in-progress').length;
        const upcomingInitiatives = initiatives.filter(init => init.status === 'not-started').length;
        
        // Calculate overall progress
        const overallInitiativeProgress = totalInitiatives > 0 
          ? Math.round((completedInitiatives + (inProgressInitiatives * 0.5)) / totalInitiatives * 100) 
          : 0;
        
        setInitiativeStats({
          total: totalInitiatives,
          completed: completedInitiatives,
          inProgress: inProgressInitiatives,
          upcoming: upcomingInitiatives,
          overallProgress: overallInitiativeProgress,
        });
        
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading security strategy:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSecurityStrategy();
  }, [clientId]);

  const handleViewFinding = async (findingId) => {
    try {
      const finding = await auditApi.getFinding(findingId);
      setSelectedFinding(finding);
      setFindingDialogOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNavigateToFinding = () => {
    if (selectedFinding) {
      setFindingDialogOpen(false);
      navigate(`/client/${clientId}/audits?findingId=${selectedFinding.id}`);
    }
  };

  const handleNavigateToRisks = () => {
    navigate(`/client/${clientId}/security-strategy/risks`);
  };

  const handleNavigateToObjectives = () => {
    navigate(`/client/${clientId}/security-strategy/objectives`);
  };

  const handleNavigateToInitiatives = () => {
    navigate(`/client/${clientId}/security-strategy/initiatives`);
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

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>Security Strategy</Typography>
        <Typography variant="body1" paragraph>
          A comprehensive view of your organization&apos;s security strategy, including risk management, 
          security objectives, and implementation initiatives. This dashboard provides an overview 
          of your current security posture and progress toward your security goals.
        </Typography>
      </Box>

      {/* Security Strategy Overview Dashboard */}
      <SecurityStrategyOverview
        riskStats={data.riskStats}
        objectiveStats={objectiveStats}
        initiativeStats={initiativeStats}
        topRisks={data.risks.slice(0, 3)}
        topObjectives={data.objectives.slice(0, 3)}
        onNavigateToRisks={handleNavigateToRisks}
        onNavigateToObjectives={handleNavigateToObjectives}
        onNavigateToInitiatives={handleNavigateToInitiatives}
      />

      {/* Finding Detail Dialog */}
      <Dialog
        open={findingDialogOpen}
        onClose={() => setFindingDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Finding Details</DialogTitle>
        <DialogContent>
          {selectedFinding && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {selectedFinding.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Source: {selectedFinding.sourceType} | Created: {new Date(selectedFinding.createdDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedFinding.description}
                </Typography>
                {selectedFinding.remediation && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Remediation
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedFinding.remediation.recommendation}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFindingDialogOpen(false)}>Close</Button>
          <Button variant="contained" onClick={handleNavigateToFinding}>
            View in Audit System
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SecurityStrategyPage;