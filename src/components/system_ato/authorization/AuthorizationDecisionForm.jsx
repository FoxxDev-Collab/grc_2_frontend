/* eslint-disable no-unused-vars */
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const AuthorizationDecisionForm = ({
  authorizationData,
  onUpdateDecision,
  onAddCondition,
  onRemoveCondition,
  onUpdateBoundary,
}) => {
  const [decisionData, setDecisionData] = useState({
    result: authorizationData?.result || '',
    official: authorizationData?.official || '',
    date: authorizationData?.date || '',
    expirationDate: authorizationData?.expirationDate || '',
    justification: authorizationData?.justification || '',
  });

  const [newCondition, setNewCondition] = useState('');
  const [conditionDialogOpen, setConditionDialogOpen] = useState(false);
  const [boundaryDialogOpen, setBoundaryDialogOpen] = useState(false);
  const [boundary, setBoundary] = useState(authorizationData?.boundary || '');

  const handleDecisionChange = (field) => (event) => {
    const updatedDecision = {
      ...decisionData,
      [field]: event.target.value,
    };
    setDecisionData(updatedDecision);
    onUpdateDecision(updatedDecision);
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      onAddCondition(newCondition.trim());
      setNewCondition('');
      setConditionDialogOpen(false);
    }
  };

  const handleUpdateBoundary = () => {
    onUpdateBoundary(boundary);
    setBoundaryDialogOpen(false);
  };

  const getDecisionColor = (decision) => {
    switch (decision?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'denied':
        return 'error';
      case 'conditional':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Authorization Decision
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Decision</InputLabel>
                  <Select
                    value={decisionData.result}
                    label="Decision"
                    onChange={handleDecisionChange('result')}
                  >
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="conditional">Conditional Approval</MenuItem>
                    <MenuItem value="denied">Denied</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Authorizing Official"
                  value={decisionData.official}
                  onChange={handleDecisionChange('official')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Decision Date"
                  value={decisionData.date}
                  onChange={handleDecisionChange('date')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Expiration Date"
                  value={decisionData.expirationDate}
                  onChange={handleDecisionChange('expirationDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Decision Justification"
                  value={decisionData.justification}
                  onChange={handleDecisionChange('justification')}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">
                Authorization Conditions
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setConditionDialogOpen(true)}
                variant="outlined"
                size="small"
              >
                Add Condition
              </Button>
            </Box>
            <List>
              {authorizationData?.conditions?.map((condition, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={condition} />
                  <IconButton
                    edge="end"
                    onClick={() => onRemoveCondition(index)}
                    title="Remove Condition"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Authorization Status
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Chip
                label={decisionData.result || 'PENDING'}
                color={getDecisionColor(decisionData.result)}
                sx={{ mb: 1 }}
              />
              {decisionData.expirationDate && (
                <Typography variant="body2" color="textSecondary">
                  Expires: {new Date(decisionData.expirationDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setBoundaryDialogOpen(true)}
              >
                Define Authorization Boundary
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Condition Dialog */}
      <Dialog
        open={conditionDialogOpen}
        onClose={() => setConditionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Authorization Condition</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
            placeholder="Enter the authorization condition..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConditionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddCondition} variant="contained">
            Add Condition
          </Button>
        </DialogActions>
      </Dialog>

      {/* Authorization Boundary Dialog */}
      <Dialog
        open={boundaryDialogOpen}
        onClose={() => setBoundaryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Define Authorization Boundary</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={boundary}
            onChange={(e) => setBoundary(e.target.value)}
            placeholder="Define the system's authorization boundary..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBoundaryDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateBoundary} variant="contained">
            Save Boundary
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

AuthorizationDecisionForm.propTypes = {
  authorizationData: PropTypes.shape({
    result: PropTypes.string,
    official: PropTypes.string,
    date: PropTypes.string,
    expirationDate: PropTypes.string,
    justification: PropTypes.string,
    conditions: PropTypes.arrayOf(PropTypes.string),
    boundary: PropTypes.string,
  }),
  onUpdateDecision: PropTypes.func.isRequired,
  onAddCondition: PropTypes.func.isRequired,
  onRemoveCondition: PropTypes.func.isRequired,
  onUpdateBoundary: PropTypes.func.isRequired,
};

export default AuthorizationDecisionForm;