//lets ensure this uses the API to gather the JSON data from the rest of the client information.
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Menu,
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
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

const SecurityRoadmap = ({
  initiatives,
  objectives,
  onAddInitiative,
  onUpdateInitiative,
  onDeleteInitiative,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
  statuses,
  phases,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [milestoneData, setMilestoneData] = useState({});
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [milestoneMenuAnchor, setMilestoneMenuAnchor] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const handleOpenMenu = (event, initiative) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedItem(initiative);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedItem(null);
  };

  const handleOpenMilestoneMenu = (event, initiative, milestone) => {
    event.stopPropagation();
    setMilestoneMenuAnchor(event.currentTarget);
    setSelectedInitiative(initiative);
    setSelectedMilestone(milestone);
  };

  const handleCloseMilestoneMenu = () => {
    setMilestoneMenuAnchor(null);
    setSelectedInitiative(null);
    setSelectedMilestone(null);
  };

  const handleOpenDialog = (initiative = null) => {
    setFormData(initiative || {});
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  const handleOpenMilestoneDialog = (initiative, milestone = null) => {
    setSelectedInitiative(initiative);
    setMilestoneData(milestone || {});
    setMilestoneDialogOpen(true);
    handleCloseMilestoneMenu();
  };

  const handleCloseMilestoneDialog = () => {
    setMilestoneDialogOpen(false);
    setMilestoneData({});
    setSelectedInitiative(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMilestoneFormChange = (e) => {
    const { name, value } = e.target;
    setMilestoneData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (formData.id) {
        await onUpdateInitiative(formData.id, formData);
      } else {
        await onAddInitiative(formData);
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Error submitting initiative:', err);
    }
  };

  const handleMilestoneSubmit = async () => {
    try {
      if (milestoneData.id) {
        await onUpdateMilestone(selectedInitiative.id, milestoneData.id, milestoneData);
      } else {
        await onAddMilestone(selectedInitiative.id, milestoneData);
      }
      handleCloseMilestoneDialog();
    } catch (err) {
      console.error('Error submitting milestone:', err);
    }
  };

  const handleOpenDeleteConfirm = (type, item, initiative = null) => {
    setDeleteType(type);
    setItemToDelete({ item, initiative });
    setDeleteConfirmOpen(true);
    handleCloseMenu();
    handleCloseMilestoneMenu();
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setDeleteType(null);
    setItemToDelete(null);
  };

  const handleDelete = async () => {
    try {
      if (deleteType === 'initiative') {
        await onDeleteInitiative(itemToDelete.item.id);
      } else if (deleteType === 'milestone') {
        await onDeleteMilestone(itemToDelete.initiative.id, itemToDelete.item.id);
      }
      handleCloseDeleteConfirm();
    } catch (err) {
      console.error('Error deleting item:', err);
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
          Security Roadmap
        </Typography>
        <Button
          startIcon={<AddIcon />}
          size="small"
          variant="contained"
          onClick={() => handleOpenDialog()}
        >
          Add Initiative
        </Button>
      </Box>

      <Timeline position="alternate">
        {initiatives.map((initiative) => (
          <TimelineItem key={initiative.id}>
            <TimelineOppositeContent color="text.secondary">
              {initiative.timeline}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={getStatusColor(initiative.status)}>
                <SecurityIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" component="div">
                        {initiative.name}
                      </Typography>
                      <Typography color="text.secondary" gutterBottom>
                        {initiative.phase}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenMenu(e, initiative)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {initiative.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">Milestones</Typography>
                      <Button
                        size="small"
                        onClick={() => handleOpenMilestoneDialog(initiative)}
                      >
                        Add Milestone
                      </Button>
                    </Box>
                    <List dense>
                      {initiative.milestones.map((milestone) => (
                        <ListItem
                          key={milestone.id}
                          secondaryAction={
                            <IconButton
                              size="small"
                              onClick={(e) => handleOpenMilestoneMenu(e, initiative, milestone)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          }
                        >
                          <ListItemIcon>
                            {milestone.completed ? (
                              <CheckCircleIcon color="success" />
                            ) : (
                              <ScheduleIcon color="action" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={milestone.name}
                            secondary={milestone.dueDate && `Due: ${new Date(milestone.dueDate).toLocaleDateString()}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      size="small"
                      label={initiative.status}
                      color={getStatusColor(initiative.status)}
                    />
                    {initiative.resources && (
                      <Chip
                        size="small"
                        label={`Budget: ${initiative.resources.budget}`}
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      {/* Initiative Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => handleOpenDialog(selectedItem)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleOpenDeleteConfirm('initiative', selectedItem)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Milestone Menu */}
      <Menu
        anchorEl={milestoneMenuAnchor}
        open={Boolean(milestoneMenuAnchor)}
        onClose={handleCloseMilestoneMenu}
      >
        <MenuItem onClick={() => handleOpenMilestoneDialog(selectedInitiative, selectedMilestone)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleOpenDeleteConfirm('milestone', selectedMilestone, selectedInitiative)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Add/Edit Initiative Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {formData.id ? 'Edit Initiative' : 'Add New Initiative'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Initiative Name"
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
                label="Phase"
                name="phase"
                value={formData.phase || ''}
                onChange={handleFormChange}
                required
              >
                {phases.map((phase) => (
                  <MenuItem key={phase} value={phase}>
                    {phase}
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
                label="Timeline"
                name="timeline"
                value={formData.timeline || ''}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Related Objective"
                name="objectiveId"
                value={formData.objectiveId || ''}
                onChange={handleFormChange}
                required
              >
                {objectives.map((objective) => (
                  <MenuItem key={objective.id} value={objective.id}>
                    {objective.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Budget"
                name="budget"
                value={formData.resources?.budget || ''}
                onChange={(e) => {
                  handleFormChange({
                    target: {
                      name: 'resources',
                      value: {
                        ...formData.resources,
                        budget: e.target.value
                      }
                    }
                  });
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {formData.id ? 'Save Changes' : 'Add Initiative'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Milestone Dialog */}
      <Dialog open={milestoneDialogOpen} onClose={handleCloseMilestoneDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {milestoneData.id ? 'Edit Milestone' : 'Add New Milestone'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Milestone Name"
                name="name"
                value={milestoneData.name || ''}
                onChange={handleMilestoneFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                name="dueDate"
                value={milestoneData.dueDate || ''}
                onChange={handleMilestoneFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Status"
                name="completed"
                value={milestoneData.completed || false}
                onChange={(e) => handleMilestoneFormChange({
                  target: {
                    name: 'completed',
                    value: e.target.value === 'true'
                  }
                })}
              >
                <MenuItem value="false">Pending</MenuItem>
                <MenuItem value="true">Completed</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMilestoneDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleMilestoneSubmit}>
            {milestoneData.id ? 'Save Changes' : 'Add Milestone'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteType}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

SecurityRoadmap.propTypes = {
  initiatives: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      phase: PropTypes.string.isRequired,
      timeline: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      objectiveId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      milestones: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
          name: PropTypes.string.isRequired,
          completed: PropTypes.bool.isRequired,
          dueDate: PropTypes.string
        })
      ).isRequired,
      resources: PropTypes.shape({
        team: PropTypes.arrayOf(PropTypes.string),
        budget: PropTypes.string,
        tools: PropTypes.arrayOf(PropTypes.string)
      })
    })
  ).isRequired,
  objectives: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  onAddInitiative: PropTypes.func.isRequired,
  onUpdateInitiative: PropTypes.func.isRequired,
  onDeleteInitiative: PropTypes.func.isRequired,
  onAddMilestone: PropTypes.func.isRequired,
  onUpdateMilestone: PropTypes.func.isRequired,
  onDeleteMilestone: PropTypes.func.isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  phases: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SecurityRoadmap;