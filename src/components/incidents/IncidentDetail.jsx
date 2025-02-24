import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  useTheme,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Warning as WarningIcon,
  Search as SearchIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Chat as ChatIcon,
  ArrowUpward as ArrowUpwardIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const IncidentDetail = ({
  incident,
  onAddAction,
  actionTypes,
  teams,
}) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [actionData, setActionData] = useState({
    type: '',
    description: '',
    performedBy: '',
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setActionData({
      type: '',
      description: '',
      performedBy: '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onAddAction(incident.id, actionData);
      handleCloseDialog();
    } catch (err) {
      console.error('Error adding action:', err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setActionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return theme.palette.error.main;
      case 'high':
        return theme.palette.warning.main;
      case 'medium':
        return theme.palette.info.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'error';
      case 'investigating':
        return 'warning';
      case 'mitigated':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'detection':
        return <SearchIcon />;
      case 'investigation':
        return <WarningIcon />;
      case 'mitigation':
        return <BuildIcon />;
      case 'resolution':
        return <CheckCircleIcon />;
      case 'communication':
        return <ChatIcon />;
      case 'escalation':
        return <ArrowUpwardIcon />;
      default:
        return null;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          {incident.title}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            icon={<WarningIcon />}
            label={incident.severity}
            sx={{
              backgroundColor: getSeverityColor(incident.severity),
              color: 'white',
            }}
          />
          <Chip
            label={incident.status}
            color={getStatusColor(incident.status)}
          />
          <Chip
            label={`Priority: ${incident.priority}`}
            variant="outlined"
          />
          <Chip
            label={incident.type}
            variant="outlined"
          />
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Details
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Assigned To"
                secondary={incident.assignedTo}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Created"
                secondary={new Date(incident.createdAt).toLocaleString()}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Last Updated"
                secondary={new Date(incident.updatedAt).toLocaleString()}
              />
            </ListItem>
            {incident.resolvedAt && (
              <ListItem>
                <ListItemText
                  primary="Resolved"
                  secondary={new Date(incident.resolvedAt).toLocaleString()}
                />
              </ListItem>
            )}
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Description
          </Typography>
          <Typography variant="body2" paragraph>
            {incident.description}
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Affected Systems
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {incident.affectedSystems.map((system) => (
              <Chip
                key={system}
                label={system}
                size="small"
                variant="outlined"
              />
            ))}
          </Stack>
        </Grid>

        {/* Action Timeline */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Action History
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              size="small"
              onClick={handleOpenDialog}
            >
              Add Action
            </Button>
          </Box>

          <Timeline>
            {incident.actions.map((action) => (
              <TimelineItem key={action.id}>
                <TimelineOppositeContent color="text.secondary">
                  {new Date(action.timestamp).toLocaleString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    {getActionIcon(action.type)}
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="subtitle2">
                    {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
                  </Typography>
                  <Typography variant="body2">
                    {action.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    By: {action.performedBy}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Grid>
      </Grid>

      {/* Add Action Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Action</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Action Type"
                  name="type"
                  value={actionData.type}
                  onChange={handleChange}
                  required
                >
                  {actionTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  name="description"
                  value={actionData.description}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Performed By"
                  name="performedBy"
                  value={actionData.performedBy}
                  onChange={handleChange}
                  required
                >
                  {teams.map((team) => (
                    <MenuItem key={team} value={team}>
                      {team}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add Action
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
};

IncidentDetail.propTypes = {
  incident: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    severity: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    resolvedAt: PropTypes.string,
    assignedTo: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    affectedSystems: PropTypes.arrayOf(PropTypes.string).isRequired,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        performedBy: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onAddAction: PropTypes.func.isRequired,
  actionTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  teams: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default IncidentDetail;