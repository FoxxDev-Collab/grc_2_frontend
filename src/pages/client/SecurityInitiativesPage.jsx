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
  ToggleButtonGroup,
  ToggleButton,
  TextField,
} from '@mui/material';
import { 
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  ViewWeek as GanttIcon,
  ViewDay as MonthIcon,
} from '@mui/icons-material';
import { securityInitiativesApi, securityObjectivesApi } from '../../services';
import SecurityRoadmap from '../../components/security_strategy/SecurityRoadmap';
import InitiativesGanttChart from '../../components/security_strategy/InitiativesGanttChart';

const SecurityInitiativesPage = () => {
  const { clientId } = useParams();
  const [initiatives, setInitiatives] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [phases, setPhases] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [viewMode, setViewMode] = useState('gantt');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1), // Jan 1 of current year
    end: new Date(new Date().getFullYear(), 11, 31), // Dec 31 of current year
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitiativesData = async () => {
      try {
        setLoading(true);
        const [
          initiativesData, 
          objectivesData, 
          phasesData, 
          statusesData
        ] = await Promise.all([
          securityInitiativesApi.getInitiatives(clientId),
          securityObjectivesApi.getObjectives(clientId),
          securityInitiativesApi.getPhases(),
          securityInitiativesApi.getInitiativeStatuses(),
        ]);
        
        setInitiatives(initiativesData);
        setObjectives(objectivesData);
        setPhases(phasesData);
        setStatuses(statusesData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load security initiatives data');
        console.error('Error loading security initiatives data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitiativesData();
  }, [clientId]);

  // Initiative handlers
  const handleAddInitiative = async (initiativeData) => {
    try {
      const result = await securityInitiativesApi.createInitiative(clientId, {
        ...initiativeData,
        relatedRisks: initiativeData.relatedRisks || [],
        objectives: initiativeData.objectives || []
      });
      
      setInitiatives(prev => [...prev, result]);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to add initiative');
    }
  };

  const handleUpdateInitiative = async (initiativeId, updates) => {
    try {
      const result = await securityInitiativesApi.updateInitiative(clientId, initiativeId, updates);
      setInitiatives(prev => prev.map(init => init.id === result.id ? result : init));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update initiative');
    }
  };

  const handleDeleteInitiative = async (initiativeId) => {
    try {
      await securityInitiativesApi.deleteInitiative(clientId, initiativeId);
      setInitiatives(prev => prev.filter(init => init.id !== initiativeId));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete initiative');
    }
  };

  const handleAddMilestone = async (initiativeId, milestoneData) => {
    try {
      const result = await securityInitiativesApi.addMilestone(clientId, initiativeId, milestoneData);
      setInitiatives(prev => prev.map(init => {
        if (init.id === initiativeId) {
          return {
            ...init,
            milestones: [...(init.milestones || []), result]
          };
        }
        return init;
      }));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to add milestone');
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
      setInitiatives(prev => prev.map(init => {
        if (init.id === initiativeId) {
          return {
            ...init,
            milestones: (init.milestones || []).map(m => m.id === milestoneId ? result : m)
          };
        }
        return init;
      }));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update milestone');
    }
  };

  const handleDeleteMilestone = async (initiativeId, milestoneId) => {
    try {
      await securityInitiativesApi.deleteMilestone(clientId, initiativeId, milestoneId);
      setInitiatives(prev => prev.map(init => {
        if (init.id === initiativeId) {
          return {
            ...init,
            milestones: (init.milestones || []).filter(m => m.id !== milestoneId)
          };
        }
        return init;
      }));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete milestone');
    }
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleDateRangeChange = (type, date) => {
    setDateRange(prev => ({
      ...prev,
      [type]: date
    }));
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
        <Typography variant="h4">Security Roadmap</Typography>
        <Box>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="month" aria-label="month view">
              <MonthIcon fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>Month</Typography>
            </ToggleButton>
            <ToggleButton value="gantt" aria-label="gantt view">
              <GanttIcon fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>Gantt</Typography>
            </ToggleButton>
            <ToggleButton value="calendar" aria-label="calendar view">
              <CalendarIcon fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>Calendar</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Date Range Selector */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ mr: 2 }}>Date Range:</Typography>
        <TextField
          size="small"
          type="date"
          value={dateRange.start.toISOString().split('T')[0]}
          onChange={(e) => handleDateRangeChange('start', new Date(e.target.value))}
          sx={{ mr: 1 }}
        />
        <Typography variant="body2" sx={{ mx: 1 }}>to</Typography>
        <TextField
          size="small"
          type="date"
          value={dateRange.end.toISOString().split('T')[0]}
          onChange={(e) => handleDateRangeChange('end', new Date(e.target.value))}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" size="small">Apply</Button>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => {/* Open add initiative dialog */}}
          >
            Add Initiative
          </Button>
        </Box>
      </Paper>

      {/* Gantt Chart */}
      <Paper sx={{ mb: 3, overflow: 'hidden' }}>
        {viewMode === 'gantt' && (
          <InitiativesGanttChart initiatives={initiatives} dateRange={dateRange} />
        )}
        {viewMode === 'month' && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">Month View</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This view is coming soon.
            </Typography>
          </Box>
        )}
        {viewMode === 'calendar' && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">Calendar View</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This view is coming soon.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Full Security Roadmap Component */}
      <Paper sx={{ p: 3 }}>
        <SecurityRoadmap
          initiatives={initiatives}
          objectives={objectives}
          risks={[]} // We don't need risks for this page
          onAddInitiative={handleAddInitiative}
          onUpdateInitiative={handleUpdateInitiative}
          onDeleteInitiative={handleDeleteInitiative}
          onAddMilestone={handleAddMilestone}
          onUpdateMilestone={handleUpdateMilestone}
          onDeleteMilestone={handleDeleteMilestone}
          statuses={statuses}
          phases={phases}
        />
      </Paper>
    </Container>
  );
};

export default SecurityInitiativesPage;