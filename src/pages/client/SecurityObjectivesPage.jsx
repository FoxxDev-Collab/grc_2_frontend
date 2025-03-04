/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { securityObjectivesApi, riskAssessmentApi } from '../../services';
import SecurityObjectives from '../../components/security_strategy/SecurityObjectives';
import ObjectivesList from '../../components/security_strategy/ObjectivesList';
import ObjectiveCategories from '../../components/security_strategy/ObjectiveCategories';

const SecurityObjectivesPage = () => {
  const { clientId } = useParams();
  const [objectives, setObjectives] = useState([]);
  const [risks, setRisks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [priorityLevels, setPriorityLevels] = useState([]);
  const [objectiveStats, setObjectiveStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    overallProgress: 0,
    completionForecast: 'Q4 2025',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllObjectives, setShowAllObjectives] = useState(false);

  useEffect(() => {
    const loadObjectivesData = async () => {
      try {
        setLoading(true);
        const [
          objectivesData, 
          risksData, 
          statusesData, 
          prioritiesData
        ] = await Promise.all([
          securityObjectivesApi.getObjectives(clientId),
          riskAssessmentApi.getRisks(clientId),
          securityObjectivesApi.getObjectiveStatuses(),
          securityObjectivesApi.getPriorityLevels(),
        ]);
        
        setObjectives(objectivesData);
        setRisks(risksData);
        setStatuses(statusesData);
        setPriorityLevels(prioritiesData);
        
        // Calculate objective statistics
        const total = objectivesData.length;
        const completed = objectivesData.filter(obj => obj.status === 'completed').length;
        const inProgress = objectivesData.filter(obj => obj.status === 'in-progress').length;
        const notStarted = objectivesData.filter(obj => obj.status === 'not-started').length;
        
        // Calculate overall progress
        const overallProgress = total > 0 
          ? Math.round((completed + (inProgress * 0.5)) / total * 100) 
          : 0;
        
        setObjectiveStats({
          total,
          completed,
          inProgress,
          notStarted,
          overallProgress,
          completionForecast: 'Q4 2025', // This would typically come from the API
        });
        
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load security objectives data');
        console.error('Error loading security objectives data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadObjectivesData();
  }, [clientId]);

  // Objective handlers
  const handleAddObjective = async (objectiveData) => {
    try {
      const result = await securityObjectivesApi.createObjective(clientId, {
        ...objectiveData,
        relatedRisks: objectiveData.relatedRisks || [],
        riskTreatment: objectiveData.riskId ? {
          riskId: objectiveData.riskId,
          approach: objectiveData.treatmentApproach || 'mitigate'
        } : undefined
      });
      
      setObjectives(prev => [...prev, result]);
      
      // If this objective is part of risk treatment, update the risk and create the mapping
      if (objectiveData.riskId) {
        const risk = risks.find(r => r.id === objectiveData.riskId);
        if (risk) {
          const updatedRisk = await riskAssessmentApi.updateRisk(clientId, risk.id, {
            ...risk,
            treatment: {
              ...risk.treatment,
              objectives: [...(risk.treatment.objectives || []), result.id]
            }
          });
          
          setRisks(prev => prev.map(r => r.id === updatedRisk.id ? updatedRisk : r));
          
          // Create the risk-objective mapping
          await riskAssessmentApi.createRiskObjectiveMapping(clientId, risk.id, result.id);
        }
      }
      
      // Update objective stats
      setObjectiveStats(prev => ({
        ...prev,
        total: prev.total + 1,
        notStarted: prev.notStarted + 1,
        overallProgress: Math.round((prev.completed + (prev.inProgress * 0.5)) / (prev.total + 1) * 100)
      }));
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to add objective');
    }
  };

  const handleUpdateObjective = async (objectiveId, updates) => {
    try {
      const result = await securityObjectivesApi.updateObjective(clientId, objectiveId, updates);
      
      // Find the old objective to compare status changes
      const oldObjective = objectives.find(obj => obj.id === objectiveId);
      
      setObjectives(prev => prev.map(obj => obj.id === result.id ? result : obj));
      
      // Update objective stats if status changed
      if (oldObjective && oldObjective.status !== result.status) {
        const statsUpdate = { ...objectiveStats };
        
        // Remove from old status count
        if (oldObjective.status === 'completed') statsUpdate.completed -= 1;
        else if (oldObjective.status === 'in-progress') statsUpdate.inProgress -= 1;
        else if (oldObjective.status === 'not-started') statsUpdate.notStarted -= 1;
        
        // Add to new status count
        if (result.status === 'completed') statsUpdate.completed += 1;
        else if (result.status === 'in-progress') statsUpdate.inProgress += 1;
        else if (result.status === 'not-started') statsUpdate.notStarted += 1;
        
        // Recalculate progress
        statsUpdate.overallProgress = Math.round(
          (statsUpdate.completed + (statsUpdate.inProgress * 0.5)) / statsUpdate.total * 100
        );
        
        setObjectiveStats(statsUpdate);
      }
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update objective');
    }
  };

  const handleViewAllObjectives = () => {
    setShowAllObjectives(true);
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Security Objectives</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => {/* Open add objective dialog */}}
        >
          Add Objective
        </Button>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">Total Objectives</Typography>
              <Typography variant="h3" sx={{ mt: 2, fontWeight: 'bold' }}>
                {objectiveStats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">Overall Progress</Typography>
              <Box sx={{ mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={objectiveStats.overallProgress} 
                  sx={{ height: 12, borderRadius: 6 }}
                />
              </Box>
              <Typography variant="h5" sx={{ mt: 1, textAlign: 'center' }}>
                {objectiveStats.overallProgress}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">Completion Forecast</Typography>
              <Typography variant="h5" sx={{ mt: 2, textAlign: 'center' }}>
                {objectiveStats.completionForecast}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Objective Categories */}
      <Box sx={{ mb: 3 }}>
        <ObjectiveCategories objectives={objectives} />
      </Box>

      {/* Objective List */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Key Objectives</Typography>
        <ObjectivesList 
          objectives={showAllObjectives ? objectives : objectives.slice(0, 3)} 
          onViewMore={objectives.length > 3 && !showAllObjectives ? handleViewAllObjectives : undefined}
        />
      </Paper>

      {/* Full Security Objectives Component */}
      <Paper sx={{ p: 3 }}>
        <SecurityObjectives
          objectives={objectives}
          risks={risks}
          onAddObjective={handleAddObjective}
          onUpdateObjective={handleUpdateObjective}
          statuses={statuses}
          priorityLevels={priorityLevels}
        />
      </Paper>
    </Container>
  );
};

export default SecurityObjectivesPage;