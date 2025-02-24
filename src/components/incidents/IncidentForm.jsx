import PropTypes from 'prop-types';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Autocomplete,
  Box,
  Typography,
  Chip,
} from '@mui/material';

const IncidentForm = ({
  incident,
  onSubmit,
  onCancel,
  incidentTypes,
  incidentSeverities,
  incidentPriorities,
  teams,
  systemTypes,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get('title'),
      type: formData.get('type'),
      severity: formData.get('severity'),
      priority: formData.get('priority'),
      assignedTo: formData.get('assignedTo'),
      description: formData.get('description'),
      affectedSystems: formData.getAll('affectedSystems'),
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {incident ? 'Edit Incident' : 'New Incident'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              defaultValue={incident?.title || ''}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Type"
              name="type"
              defaultValue={incident?.type || ''}
              required
            >
              {incidentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Severity"
              name="severity"
              defaultValue={incident?.severity || ''}
              required
            >
              {incidentSeverities.map((severity) => (
                <MenuItem key={severity} value={severity}>
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Priority"
              name="priority"
              defaultValue={incident?.priority || ''}
              required
            >
              {incidentPriorities.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Assigned To"
              name="assignedTo"
              defaultValue={incident?.assignedTo || ''}
              required
            >
              {teams.map((team) => (
                <MenuItem key={team} value={team}>
                  {team}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={systemTypes}
              defaultValue={incident?.affectedSystems || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Affected Systems"
                  name="affectedSystems"
                  required
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option}
                    label={option}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              defaultValue={incident?.description || ''}
              required
            />
          </Grid>

          {incident && (
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Incident Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(incident.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated: {new Date(incident.updatedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  {incident.resolvedAt && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Resolved: {new Date(incident.resolvedAt).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">
          {incident ? 'Save Changes' : 'Create Incident'}
        </Button>
      </DialogActions>
    </form>
  );
};

IncidentForm.propTypes = {
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
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  incidentTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  incidentSeverities: PropTypes.arrayOf(PropTypes.string).isRequired,
  incidentPriorities: PropTypes.arrayOf(PropTypes.string).isRequired,
  teams: PropTypes.arrayOf(PropTypes.string).isRequired,
  systemTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default IncidentForm;