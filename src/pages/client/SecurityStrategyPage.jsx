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
} from '@mui/material';
import { 
  riskAssessmentApi, 
  securityObjectivesApi, 
  securityInitiativesApi, 
  auditApi 
} from '../../services';
import RiskAssessment from '../../components/security_strategy/RiskAssessment';
import SecurityObjectives from '../../components/security_strategy/SecurityObjectives';
import SecurityRoadmap from '../../components/security_strategy/SecurityRoadmap';

const SecurityStrategyPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    risks: [],
    objectives: [],
    initiatives: [],
    riskStats: null,
    frameworkProgress: null
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
          frameworkProgress
        ] = await Promise.all([
          riskAssessmentApi.getRisks(clientId),
          securityObjectivesApi.getObjectives(clientId),
          securityInitiativesApi.getInitiatives(clientId),
          securityObjectivesApi.getObjectiveStatuses(),
          securityInitiativesApi.getInitiativeStatuses(),
          securityObjectivesApi.getPriorityLevels(),
          securityInitiativesApi.getPhases(),
          riskAssessmentApi.getRiskStats(clientId),
          riskAssessmentApi.getFrameworkProgress(clientId)
        ]);

        setData({
          risks,
          objectives,
          initiatives,
          riskStats,
          frameworkProgress
        });
        setStatuses({
          objective: objectiveStatuses,
          initiative: initiativeStatuses
        });
        setPriorityLevels(priorities);
        setPhases(phaseOptions);
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

  // Risk handlers
  const handleAddRisk = async (riskData) => {
    try {
      const result = await riskAssessmentApi.createRisk(clientId, riskData);
      setData(prev => ({
        ...prev,
        risks: [...prev.risks, result]
      }));
      // Refresh risk stats after adding a new risk
      const newStats = await riskAssessmentApi.getRiskStats(clientId);
      setData(prev => ({
        ...prev,
        riskStats: newStats
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateRisk = async (riskId, updates) => {
    try {
      const result = await riskAssessmentApi.updateRisk(clientId, riskId, updates);
      setData(prev => ({
        ...prev,
        risks: prev.risks.map(risk => risk.id === result.id ? result : risk)
      }));
      // Refresh risk stats after updating a risk
      const newStats = await riskAssessmentApi.getRiskStats(clientId);
      setData(prev => ({
        ...prev,
        riskStats: newStats
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRisk = async (riskId) => {
    try {
      await riskAssessmentApi.deleteRisk(clientId, riskId);
      setData(prev => ({
        ...prev,
        risks: prev.risks.filter(risk => risk.id !== riskId)
      }));
      // Refresh risk stats after deleting a risk
      const newStats = await riskAssessmentApi.getRiskStats(clientId);
      setData(prev => ({
        ...prev,
        riskStats: newStats
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

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

  // Objective handlers
  const handleAddObjective = async (objectiveData) => {
    try {
      // If objective is created from a risk, link them automatically
      const result = await securityObjectivesApi.createObjective(clientId, {
        ...objectiveData,
        relatedRisks: objectiveData.relatedRisks || [],
        // If created from risk treatment, add the risk reference
        riskTreatment: objectiveData.riskId ? {
          riskId: objectiveData.riskId,
          approach: objectiveData.treatmentApproach || 'mitigate'
        } : undefined
      });
      setData(prev => ({
        ...prev,
        objectives: [...prev.objectives, result]
      }));

      // If this objective is part of risk treatment, update the risk
      if (objectiveData.riskId) {
        const risk = data.risks.find(r => r.id === objectiveData.riskId);
        if (risk) {
          await handleUpdateRisk(risk.id, {
            ...risk,
            treatment: {
              ...risk.treatment,
              objectives: [...(risk.treatment.objectives || []), result.id]
            }
          });
        }
      }

      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateObjective = async (objectiveId, updates) => {
    try {
      const result = await securityObjectivesApi.updateObjective(clientId, objectiveId, updates);
      setData(prev => ({
        ...prev,
        objectives: prev.objectives.map(obj => obj.id === result.id ? result : obj)
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Initiative handlers
  const handleAddInitiative = async (initiativeData) => {
    try {
      const result = await securityInitiativesApi.createInitiative(clientId, {
        ...initiativeData,
        relatedRisks: initiativeData.relatedRisks || [],
        // Link to objectives if specified
        objectives: initiativeData.objectives || []
      });
      setData(prev => ({
        ...prev,
        initiatives: [...prev.initiatives, result]
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateInitiative = async (initiativeId, updates) => {
    try {
      const result = await securityInitiativesApi.updateInitiative(clientId, initiativeId, updates);
      setData(prev => ({
        ...prev,
        initiatives: prev.initiatives.map(init => init.id === result.id ? result : init)
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteInitiative = async (initiativeId) => {
    try {
      await securityInitiativesApi.deleteInitiative(clientId, initiativeId);
      setData(prev => ({
        ...prev,
        initiatives: prev.initiatives.filter(init => init.id !== initiativeId)
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddMilestone = async (initiativeId, milestoneData) => {
    try {
      const result = await securityInitiativesApi.addMilestone(clientId, initiativeId, milestoneData);
      setData(prev => ({
        ...prev,
        initiatives: prev.initiatives.map(init => {
          if (init.id === initiativeId) {
            return {
              ...init,
              milestones: [...init.milestones, result]
            };
          }
          return init;
        })
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateMilestone = async (initiativeId, milestoneId, updates) => {
    try {
      const result = await securityInitiativesApi.updateMilestone(
        clientId,
        initiativeId,
        milestoneId,
        updates
      );
      setData(prev => ({
        ...prev,
        initiatives: prev.initiatives.map(init => {
          if (init.id === initiativeId) {
            return {
              ...init,
              milestones: init.milestones.map(m => m.id === milestoneId ? result : m)
            };
          }
          return init;
        })
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteMilestone = async (initiativeId, milestoneId) => {
    try {
      await securityInitiativesApi.deleteMilestone(clientId, initiativeId, milestoneId);
      setData(prev => ({
        ...prev,
        initiatives: prev.initiatives.map(init => {
          if (init.id === initiativeId) {
            return {
              ...init,
              milestones: init.milestones.filter(m => m.id !== milestoneId)
            };
          }
          return init;
        })
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
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

      <Typography variant="h4" gutterBottom>
        Security Strategy
      </Typography>

      <Grid container spacing={3}>
        {/* Risk Assessment Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <RiskAssessment
              risks={data.risks}
              riskStats={data.riskStats}
              frameworkProgress={data.frameworkProgress}
              onAddRisk={handleAddRisk}
              onUpdateRisk={handleUpdateRisk}
              onDeleteRisk={handleDeleteRisk}
              onViewFinding={handleViewFinding}
            />
          </Paper>
        </Grid>

        {/* Security Objectives Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <SecurityObjectives
              objectives={data.objectives}
              risks={data.risks}
              onAddObjective={handleAddObjective}
              onUpdateObjective={handleUpdateObjective}
              statuses={statuses.objective}
              priorityLevels={priorityLevels}
            />
          </Paper>
        </Grid>

        {/* Security Roadmap Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <SecurityRoadmap
              initiatives={data.initiatives}
              objectives={data.objectives}
              risks={data.risks}
              onAddInitiative={handleAddInitiative}
              onUpdateInitiative={handleUpdateInitiative}
              onDeleteInitiative={handleDeleteInitiative}
              onAddMilestone={handleAddMilestone}
              onUpdateMilestone={handleUpdateMilestone}
              onDeleteMilestone={handleDeleteMilestone}
              statuses={statuses.initiative}
              phases={phases}
            />
          </Paper>
        </Grid>
      </Grid>

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