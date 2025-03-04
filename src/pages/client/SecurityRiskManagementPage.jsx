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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { riskAssessmentApi } from '../../services';
import RiskAssessment from '../../components/security_strategy/RiskAssessment';
import RiskHeatmap from '../../components/security_strategy/RiskHeatmap';
import RiskStatsOverview from '../../components/security_strategy/RiskStatsOverview';
import TopRisksTable from '../../components/security_strategy/TopRisksTable';

const SecurityRiskManagementPage = () => {
  const { clientId } = useParams();
  const [risks, setRisks] = useState([]);
  const [riskStats, setRiskStats] = useState(null);
  const [frameworkProgress, setFrameworkProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRiskData = async () => {
      try {
        setLoading(true);
        const [risksData, statsData, progressData] = await Promise.all([
          riskAssessmentApi.getRisks(clientId),
          riskAssessmentApi.getRiskStats(clientId),
          riskAssessmentApi.getFrameworkProgress(clientId),
        ]);
        
        setRisks(risksData);
        setRiskStats(statsData);
        setFrameworkProgress(progressData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load risk management data');
        console.error('Error loading risk management data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRiskData();
  }, [clientId]);

  // Risk handlers
  const handleAddRisk = async (riskData) => {
    try {
      const result = await riskAssessmentApi.createRisk(clientId, riskData);
      setRisks(prev => [...prev, result]);
      
      // Refresh risk stats after adding a new risk
      const newStats = await riskAssessmentApi.getRiskStats(clientId);
      setRiskStats(newStats);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to add risk');
    }
  };

  const handleUpdateRisk = async (riskId, updates) => {
    try {
      const result = await riskAssessmentApi.updateRisk(clientId, riskId, updates);
      setRisks(prev => prev.map(risk => risk.id === result.id ? result : risk));
      
      // Refresh risk stats after updating a risk
      const newStats = await riskAssessmentApi.getRiskStats(clientId);
      setRiskStats(newStats);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update risk');
    }
  };

  const handleDeleteRisk = async (riskId) => {
    try {
      await riskAssessmentApi.deleteRisk(clientId, riskId);
      setRisks(prev => prev.filter(risk => risk.id !== riskId));
      
      // Refresh risk stats after deleting a risk
      const newStats = await riskAssessmentApi.getRiskStats(clientId);
      setRiskStats(newStats);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete risk');
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Risk Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => {/* Open add risk dialog */}}
        >
          Add Risk
        </Button>
      </Box>

      {/* Risk Overview Cards */}
      <Box sx={{ mb: 3 }}>
        <RiskStatsOverview stats={riskStats} />
      </Box>

      <Grid container spacing={3}>
        {/* Risk Heatmap */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <RiskHeatmap risks={risks} />
          </Paper>
        </Grid>

        {/* Top Risks Table */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <TopRisksTable risks={risks} />
          </Paper>
        </Grid>
      </Grid>

      {/* Full Risk Assessment Component */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <RiskAssessment
          risks={risks}
          riskStats={riskStats}
          frameworkProgress={frameworkProgress}
          onAddRisk={handleAddRisk}
          onUpdateRisk={handleUpdateRisk}
          onDeleteRisk={handleDeleteRisk}
        />
      </Paper>
    </Container>
  );
};

export default SecurityRiskManagementPage;