import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Button,
  Dialog,
  useTheme,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Code as CodeIcon,
  Computer as ComputerIcon,
  BugReport as BugIcon,
  Person as PersonIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import IncidentForm from './IncidentForm';

const IncidentList = ({
  incidents,
  onAddIncident,
  onUpdateIncident,
  onViewIncident,
  incidentTypes,
  incidentSeverities,
  incidentPriorities,
  teams,
  systemTypes,
}) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const handleOpenDialog = (incident = null) => {
    setSelectedIncident(incident);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIncident(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedIncident) {
        await onUpdateIncident(selectedIncident.id, formData);
      } else {
        await onAddIncident(formData);
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Error submitting incident:', err);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'security':
        return <SecurityIcon />;
      case 'system':
        return <StorageIcon />;
      case 'network':
        return <ComputerIcon />;
      case 'application':
        return <CodeIcon />;
      case 'user':
        return <PersonIcon />;
      case 'software':
      case 'hardware':
        return <BugIcon />;
      default:
        return <HelpIcon />;
    }
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

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Incidents
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => handleOpenDialog()}
        >
          New Incident
        </Button>
      </Box>

      <List>
        {incidents.map((incident) => (
          <ListItem
            key={incident.id}
            sx={{
              mb: 1,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
            }}
            secondaryAction={
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={() => onViewIncident(incident)}
                >
                  <ViewIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(incident)}
                >
                  <EditIcon />
                </IconButton>
              </Stack>
            }
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getTypeIcon(incident.type)}
                  <Typography variant="subtitle1">
                    {incident.title}
                  </Typography>
                </Box>
              }
              secondary={
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip
                    size="small"
                    icon={<WarningIcon />}
                    label={incident.severity}
                    sx={{
                      backgroundColor: getSeverityColor(incident.severity),
                      color: 'white',
                    }}
                  />
                  <Chip
                    size="small"
                    label={incident.status}
                    color={getStatusColor(incident.status)}
                  />
                  <Chip
                    size="small"
                    label={incident.assignedTo}
                    variant="outlined"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(incident.createdAt).toLocaleDateString()}
                  </Typography>
                </Stack>
              }
            />
          </ListItem>
        ))}
        {incidents.length === 0 && (
          <ListItem>
            <ListItemText
              primary="No incidents found"
              secondary="Create a new incident using the button above"
            />
          </ListItem>
        )}
      </List>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <IncidentForm
          incident={selectedIncident}
          onSubmit={handleSubmit}
          onCancel={handleCloseDialog}
          incidentTypes={incidentTypes}
          incidentSeverities={incidentSeverities}
          incidentPriorities={incidentPriorities}
          teams={teams}
          systemTypes={systemTypes}
        />
      </Dialog>
    </Paper>
  );
};

IncidentList.propTypes = {
  incidents: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ).isRequired,
  onAddIncident: PropTypes.func.isRequired,
  onUpdateIncident: PropTypes.func.isRequired,
  onViewIncident: PropTypes.func.isRequired,
  incidentTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  incidentSeverities: PropTypes.arrayOf(PropTypes.string).isRequired,
  incidentPriorities: PropTypes.arrayOf(PropTypes.string).isRequired,
  teams: PropTypes.arrayOf(PropTypes.string).isRequired,
  systemTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default IncidentList;