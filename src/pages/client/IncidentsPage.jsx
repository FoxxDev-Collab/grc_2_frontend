import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { incidentApi } from '../../services';
import IncidentList from '../../components/incidents/IncidentList';
import IncidentDetail from '../../components/incidents/IncidentDetail';

// Default stats to use when data is not available
const DEFAULT_STATS = {
  total: 0,
  active: 0,
  resolved: 0,
  avgResolutionTime: 0,
  bySeverity: {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  },
  byType: {}
};

const IncidentsPage = () => {
  const { clientId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    incidents: [],
    stats: DEFAULT_STATS,
    types: [],
    severities: [],
    statuses: [],
    priorities: [],
    actionTypes: [],
    teams: [],
    systemTypes: [],
  });
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    const loadIncidentData = async () => {
      try {
        setLoading(true);
        const [
          incidents,
          stats,
          types,
          severities,
          statuses,
          priorities,
          actionTypes,
          teams,
          systemTypes,
        ] = await Promise.all([
          incidentApi.getIncidents(clientId),
          incidentApi.getIncidentStats(clientId),
          incidentApi.getIncidentTypes(),
          incidentApi.getIncidentSeverities(),
          incidentApi.getIncidentStatuses(),
          incidentApi.getIncidentPriorities(),
          incidentApi.getActionTypes(),
          incidentApi.getTeams(),
          incidentApi.getSystemTypes(),
        ]);

        setData({
          incidents: incidents || [],
          stats: stats || DEFAULT_STATS,
          types: types || [],
          severities: severities || [],
          statuses: statuses || [],
          priorities: priorities || [],
          actionTypes: actionTypes || [],
          teams: teams || [],
          systemTypes: systemTypes || [],
        });
        setError('');
      } catch (err) {
        setError('Failed to load incident information');
        console.error('Error loading incidents:', err);
      } finally {
        setLoading(false);
      }
    };

    loadIncidentData();
  }, [clientId]);

  const handleAddIncident = async (incidentData) => {
    try {
      const result = await incidentApi.createIncident(clientId, incidentData);
      setData(prev => ({
        ...prev,
        incidents: [...prev.incidents, result]
      }));
      setError('');
    } catch (err) {
      setError('Failed to create incident');
      console.error('Error creating incident:', err);
    }
  };

  const handleUpdateIncident = async (incidentId, updates) => {
    try {
      const result = await incidentApi.updateIncident(clientId, incidentId, updates);
      setData(prev => ({
        ...prev,
        incidents: prev.incidents.map(inc => 
          inc.id === incidentId ? result : inc
        )
      }));
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(result);
      }
      setError('');
    } catch (err) {
      setError('Failed to update incident');
      console.error('Error updating incident:', err);
    }
  };

  const handleAddAction = async (incidentId, actionData) => {
    try {
      const result = await incidentApi.addAction(clientId, incidentId, actionData);
      setData(prev => ({
        ...prev,
        incidents: prev.incidents.map(inc => {
          if (inc.id === incidentId) {
            return {
              ...inc,
              actions: [...(inc.actions || []), result]
            };
          }
          return inc;
        })
      }));
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(prev => ({
          ...prev,
          actions: [...(prev.actions || []), result]
        }));
      }
      setError('');
    } catch (err) {
      setError('Failed to add action');
      console.error('Error adding action:', err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Ensure stats is never null
  const stats = data.stats || DEFAULT_STATS;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom>
        Incident Management
      </Typography>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="overline">
                  Active Incidents
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon color="error" />
                  <Typography variant="h4">
                    {stats.active}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stats.total} total incidents
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="overline">
                  Resolution Time
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon color="primary" />
                  <Typography variant="h4">
                    {stats.avgResolutionTime}h
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Average resolution time
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="overline">
                  Critical/High
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingDownIcon color="error" />
                  <Typography variant="h4">
                    {(stats.bySeverity?.critical || 0) + (stats.bySeverity?.high || 0)}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip
                    size="small"
                    label={`${stats.bySeverity?.critical || 0} Critical`}
                    color="error"
                  />
                  <Chip
                    size="small"
                    label={`${stats.bySeverity?.high || 0} High`}
                    color="warning"
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="overline">
                  Resolved
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="h4">
                    {stats.resolved}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0}% resolution rate
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Incident List */}
        <Grid item xs={12} md={selectedIncident ? 6 : 12}>
          <IncidentList
            incidents={data.incidents || []}
            onAddIncident={handleAddIncident}
            onUpdateIncident={handleUpdateIncident}
            onViewIncident={setSelectedIncident}
            incidentTypes={data.types || []}
            incidentSeverities={data.severities || []}
            incidentPriorities={data.priorities || []}
            teams={data.teams || []}
            systemTypes={data.systemTypes || []}
          />
        </Grid>

        {/* Incident Detail */}
        {selectedIncident && (
          <Grid item xs={12} md={6}>
            <IncidentDetail
              incident={selectedIncident}
              onAddAction={handleAddAction}
              actionTypes={data.actionTypes || []}
              teams={data.teams || []}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default IncidentsPage;