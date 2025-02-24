//lets ensure this uses the API to gather the JSON data from the rest of the client information.

import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  LinearProgress,
  MenuItem,
} from '@mui/material';
import {
  Flag as FlagIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const SecurityObjectives = ({
  objectives,
  onAddObjective,
  onUpdateObjective,
  statuses,
  priorityLevels,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({});

  const handleOpenDialog = (objective = null) => {
    setFormData(objective || {});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (formData.id) {
        await onUpdateObjective(formData.id, formData);
      } else {
        await onAddObjective(formData);
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Error submitting objective:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'info';
      case 'planning':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          Security Objectives
        </Typography>
        <Button
          startIcon={<AddIcon />}
          size="small"
          variant="contained"
          onClick={() => handleOpenDialog()}
        >
          Add Objective
        </Button>
      </Box>

      <List>
        {objectives.map((objective) => (
          <ListItem
            key={objective.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              mb: 1,
              flexDirection: 'column',
              alignItems: 'stretch',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <ListItemIcon>
                <FlagIcon color={objective.priority === 'High' ? 'error' : 'action'} />
              </ListItemIcon>
              <ListItemText
                primary={objective.name}
                secondary={objective.description}
              />
            </Box>

            <Box sx={{ pl: 7, pr: 2 }}>
              {objective.metrics && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                    Success Criteria:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {objective.metrics.successCriteria.map((criterion, index) => (
                      <Chip
                        key={index}
                        size="small"
                        label={criterion}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={objective.progress}
                  sx={{ flexGrow: 1, mr: 2 }}
                />
                <Typography variant="body2">
                  {objective.progress}%
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    size="small"
                    label={objective.status}
                    color={getStatusColor(objective.status)}
                  />
                  <Chip
                    size="small"
                    label={`Priority: ${objective.priority}`}
                    color={objective.priority === 'High' ? 'error' : 'default'}
                  />
                  <Chip
                    size="small"
                    label={`Due: ${new Date(objective.dueDate).toLocaleDateString()}`}
                    variant="outlined"
                  />
                </Box>
                <Button
                  size="small"
                  onClick={() => handleOpenDialog(objective)}
                >
                  Edit
                </Button>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Add/Edit Objective Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {formData.id ? 'Edit Objective' : 'Add New Objective'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Objective Name"
                name="name"
                value={formData.name || ''}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={handleFormChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Priority"
                name="priority"
                value={formData.priority || ''}
                onChange={handleFormChange}
                required
              >
                {priorityLevels.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status || ''}
                onChange={handleFormChange}
                required
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Progress (%)"
                name="progress"
                value={formData.progress || 0}
                onChange={handleFormChange}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                name="dueDate"
                value={formData.dueDate || ''}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Success Criteria (comma-separated)"
                name="successCriteria"
                value={
                  formData.metrics?.successCriteria
                    ? formData.metrics.successCriteria.join(', ')
                    : ''
                }
                onChange={(e) => {
                  const criteria = e.target.value.split(',').map(c => c.trim()).filter(Boolean);
                  handleFormChange({
                    target: {
                      name: 'metrics',
                      value: {
                        ...formData.metrics,
                        successCriteria: criteria
                      }
                    }
                  });
                }}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {formData.id ? 'Save Changes' : 'Add Objective'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

SecurityObjectives.propTypes = {
  objectives: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      progress: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
      metrics: PropTypes.shape({
        successCriteria: PropTypes.arrayOf(PropTypes.string),
        currentMetrics: PropTypes.arrayOf(PropTypes.string)
      })
    })
  ).isRequired,
  onAddObjective: PropTypes.func.isRequired,
  onUpdateObjective: PropTypes.func.isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  priorityLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SecurityObjectives;