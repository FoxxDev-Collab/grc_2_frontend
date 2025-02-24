/* eslint-disable no-unused-vars */
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  CheckCircle as CompliantIcon,
  Cancel as NonCompliantIcon,
  RemoveCircle as NotApplicableIcon,
} from '@mui/icons-material';

const ControlAssessment = ({ controls, onUpdateControl }) => {
  const [selectedControl, setSelectedControl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    evidence: '',
    notes: '',
  });

  // Calculate compliance statistics
  const stats = controls.reduce(
    (acc, control) => {
      switch (control.status) {
        case 'Compliant':
          acc.compliant++;
          break;
        case 'Non-Compliant':
          acc.nonCompliant++;
          break;
        case 'Not-Applicable':
          acc.notApplicable++;
          break;
        default:
          break;
      }
      return acc;
    },
    { compliant: 0, nonCompliant: 0, notApplicable: 0 }
  );

  const totalControls = controls.length;
  const compliancePercentage = Math.round(
    (stats.compliant / (totalControls - stats.notApplicable)) * 100
  );

  const handleEditControl = (control) => {
    setSelectedControl(control);
    setEditForm({
      status: control.status,
      evidence: control.evidence || '',
      notes: control.notes || '',
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    onUpdateControl({
      ...selectedControl,
      ...editForm,
    });
    setDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Compliant':
        return 'success';
      case 'Non-Compliant':
        return 'error';
      case 'Not-Applicable':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Compliant':
        return <CompliantIcon color="success" />;
      case 'Non-Compliant':
        return <NonCompliantIcon color="error" />;
      case 'Not-Applicable':
        return <NotApplicableIcon color="disabled" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* Compliance Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Control Assessment Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={compliancePercentage}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {compliancePercentage}% Controls Compliant
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {stats.compliant}
                    </Typography>
                    <Typography variant="body2">Compliant</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main">
                      {stats.nonCompliant}
                    </Typography>
                    <Typography variant="body2">Non-Compliant</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="text.secondary">
                      {stats.notApplicable}
                    </Typography>
                    <Typography variant="body2">Not Applicable</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Controls Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Control ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Evidence</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {controls.map((control) => (
                  <TableRow key={control.id}>
                    <TableCell>{control.id}</TableCell>
                    <TableCell>{control.title}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(control.status)}
                        <Chip
                          size="small"
                          label={control.status}
                          color={getStatusColor(control.status)}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{control.evidence || 'No evidence provided'}</TableCell>
                    <TableCell>
                      {control.lastUpdated
                        ? new Date(control.lastUpdated).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEditControl(control)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Edit Control Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Update Control Status - {selectedControl?.id}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="Compliant">Compliant</MenuItem>
                <MenuItem value="Non-Compliant">Non-Compliant</MenuItem>
                <MenuItem value="Not-Applicable">Not Applicable</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Evidence"
              multiline
              rows={3}
              value={editForm.evidence}
              onChange={(e) => setEditForm({ ...editForm, evidence: e.target.value })}
            />
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={2}
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ControlAssessment.propTypes = {
  controls: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['Compliant', 'Non-Compliant', 'Not-Applicable']).isRequired,
      evidence: PropTypes.string,
      notes: PropTypes.string,
      lastUpdated: PropTypes.string,
    })
  ).isRequired,
  onUpdateControl: PropTypes.func.isRequired,
};

export default ControlAssessment;