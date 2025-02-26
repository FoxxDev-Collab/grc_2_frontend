/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
    Timeline, 
    TimelineConnector, 
    TimelineItem,
    TimelineSeparator,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent, } from '@mui/lab';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
} from '@mui/material';
import {
  CheckCircle as CompleteIcon,
  RadioButtonUnchecked as IncompleteIcon,
  Edit as EditIcon,
  MonitorHeart as MonitorIcon,
  Assessment as AssessmentIcon,
  ChangeCircle as ChangeIcon,
  Build as MaintenanceIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { systemApi } from '../../services';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`phase-tabpanel-${index}`}
      aria-labelledby={`phase-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

const MetricCard = ({ title, value, status, trend }) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h4" component="div">
      {value}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
      <Chip
        size="small"
        label={status}
        color={status === 'Good' ? 'success' : status === 'Warning' ? 'warning' : 'error'}
        sx={{ mr: 1 }}
      />
      <Typography variant="body2" color="textSecondary">
        {trend}
      </Typography>
    </Box>
  </Paper>
);

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  trend: PropTypes.string.isRequired,
};

const Continuous_MonitoringPage = () => {
  const { clientId, systemId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [system, setSystem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSystemData = async () => {
      try {
        setLoading(true);
        const systemData = await systemApi.getSystem(clientId, systemId);
        setSystem(systemData);
        setError('');
      } catch (err) {
        setError(err.message);
        console.error('Error loading system data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (clientId && systemId) {
      loadSystemData();
    }
  }, [clientId, systemId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  const monitoring = system?.phases?.continuousMonitoring || {};

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Phase Header */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Continuous Monitoring
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Ongoing assessment, change management, and system maintenance.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'right' }}>
              <Chip
                label={system?.phaseProgress?.['continuous-monitoring'] + '% Complete'}
                color={
                  system?.phaseProgress?.['continuous-monitoring'] >= 100
                    ? 'success'
                    : system?.phaseProgress?.['continuous-monitoring'] > 0
                    ? 'warning'
                    : 'default'
                }
                sx={{ mb: 1 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Monitoring Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Control Effectiveness"
            value={monitoring.program?.metrics?.controlEffectiveness || '0%'}
            status={monitoring.program?.metrics?.controlStatus || 'Warning'}
            trend={monitoring.program?.metrics?.controlTrend || 'No trend data'}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Security Incidents"
            value={monitoring.program?.metrics?.incidents?.toString() || '0'}
            status={monitoring.program?.metrics?.incidentStatus || 'Good'}
            trend={monitoring.program?.metrics?.incidentTrend || 'No trend data'}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Pending Changes"
            value={monitoring.changes?.pending?.length?.toString() || '0'}
            status={monitoring.changes?.status || 'Warning'}
            trend={monitoring.changes?.trend || 'No trend data'}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="System Health"
            value={monitoring.maintenance?.healthScore || '100%'}
            status={monitoring.maintenance?.status || 'Good'}
            trend={monitoring.maintenance?.trend || 'No trend data'}
          />
        </Grid>
      </Grid>

      {/* Monitoring Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="monitoring tabs"
        >
          <Tab icon={<MonitorIcon />} label="Monitoring Program" />
          <Tab icon={<AssessmentIcon />} label="Ongoing Assessment" />
          <Tab icon={<ChangeIcon />} label="Change Management" />
          <Tab icon={<MaintenanceIcon />} label="System Maintenance" />
        </Tabs>

        {/* Monitoring Program Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Active Monitoring Controls
                </Typography>
                <List>
                  {monitoring.program?.controls?.map((control, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {control.status === 'active' ? (
                          <CompleteIcon color="success" />
                        ) : (
                          <WarningIcon color="warning" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={control.name}
                        secondary={`Last checked: ${control.lastCheck}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Monitoring Schedule
                </Typography>
                <List>
                  {monitoring.program?.schedule?.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <InfoIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.activity}
                        secondary={`Frequency: ${item.frequency}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Ongoing Assessment Tab */}
        <TabPanel value={activeTab} index={1}>
          <Timeline>
            {monitoring.assessment?.activities?.map((activity, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent color="textSecondary">
                  {activity.date}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={activity.status === 'completed' ? 'success' : 'warning'}>
                    <AssessmentIcon />
                  </TimelineDot>
                  {index < monitoring.assessment?.activities?.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6" component="span">
                    {activity.name}
                  </Typography>
                  <Typography>{activity.description}</Typography>
                  {activity.findings && (
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        size="small"
                        label={`${activity.findings.length} Findings`}
                        color={activity.findings.length > 0 ? 'warning' : 'success'}
                      />
                    </Box>
                  )}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </TabPanel>

        {/* Change Management Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Change Requests
                </Typography>
                <List>
                  {monitoring.changes?.requests?.map((change, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {change.status === 'approved' ? (
                          <CompleteIcon color="success" />
                        ) : change.status === 'pending' ? (
                          <WarningIcon color="warning" />
                        ) : (
                          <IncompleteIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={change.title}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              Impact: {change.impact} | Risk: {change.risk}
                            </Typography>
                            <br />
                            <Typography variant="body2" component="span">
                              Submitted: {change.submittedDate}
                            </Typography>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          size="small"
                          label={change.status.toUpperCase()}
                          color={
                            change.status === 'approved' ? 'success' :
                            change.status === 'pending' ? 'warning' : 'error'
                          }
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* System Maintenance Tab */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Scheduled Maintenance
                </Typography>
                <List>
                  {monitoring.maintenance?.scheduled?.map((task, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <MaintenanceIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        secondary={`Scheduled for: ${task.date}`}
                      />
                      <ListItemSecondaryAction>
                        <Chip size="small" label={task.status} color="primary" />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  System Updates
                </Typography>
                <List>
                  {monitoring.maintenance?.updates?.map((update, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {update.status === 'installed' ? (
                          <CompleteIcon color="success" />
                        ) : (
                          <WarningIcon color="warning" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={update.name}
                        secondary={`Version: ${update.version}`}
                      />
                      <ListItemSecondaryAction>
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={update.status === 'installed'}
                        >
                          {update.status === 'installed' ? 'Installed' : 'Install'}
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Continuous_MonitoringPage;