/* eslint-disable no-unused-vars */
import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Stack,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Collapse,
  Tooltip,
} from '@mui/material';
import {
  Build as ImplementationIcon,
  Link as LinkIcon,
  Save as SaveIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  HelpOutline as HelpIcon,
} from '@mui/icons-material';
import { systemApi } from '../../services';
import ControlForm from '../../components/security_controls/ControlForm';

const STATUS_OPTIONS = [
  { value: 'compliant', label: 'Compliant', color: 'success' },
  { value: 'non-compliant', label: 'Non-Compliant', color: 'error' },
  { value: 'not-applicable', label: 'Not Applicable', color: 'default' },
  { value: 'pending-review', label: 'Pending Review', color: 'warning' },
];

const ControlsImplementationPage = () => {
  const { clientId, systemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [controls, setControls] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [selectedControl, setSelectedControl] = useState(null);
  const [artifactDialogOpen, setArtifactDialogOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const [controlFormOpen, setControlFormOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [selectedControlHelp, setSelectedControlHelp] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API calls when available
        // Mock data for now
        setControls([
          {
            id: 'AC-1',
            name: 'Policy and Procedures',
            description: 'Develop, document, and disseminate policies and procedures for access control.',
            requirements: 'The organization must establish and maintain access control policies that address purpose, scope, roles, responsibilities, and compliance.',
            status: 'pending-review',
            testing: '',
            artifacts: [],
          },
          {
            id: 'AC-2',
            name: 'Account Management',
            description: 'Establish and maintain account management processes for information system accounts.',
            requirements: 'Implement account management procedures including account types, group memberships, and access authorizations.',
            status: 'compliant',
            testing: 'Verified account management procedures are in place.',
            artifacts: ['policy-doc-1', 'procedure-doc-1'],
          },
        ]);

        setArtifacts([
          { id: 'policy-doc-1', name: 'Security Policy Document' },
          { id: 'procedure-doc-1', name: 'Account Management Procedures' },
        ]);

        setError('');
      } catch (err) {
        setError(err.message);
        console.error('Error loading implementation data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (clientId && systemId) {
      loadData();
    }
  }, [clientId, systemId]);

  const handleStatusChange = (controlId, newStatus) => {
    setControls(controls.map(control =>
      control.id === controlId
        ? { ...control, status: newStatus }
        : control
    ));
  };

  const handleTestingChange = (controlId, newTesting) => {
    if (newTesting.length <= 200) {
      setControls(controls.map(control =>
        control.id === controlId
          ? { ...control, testing: newTesting }
          : control
      ));
    }
  };

  const handleArtifactDialogOpen = (control) => {
    setSelectedControl(control);
    setArtifactDialogOpen(true);
  };

  const handleArtifactDialogClose = () => {
    setSelectedControl(null);
    setArtifactDialogOpen(false);
  };

  const handleArtifactToggle = (artifactId) => {
    if (!selectedControl) return;

    setControls(controls.map(control =>
      control.id === selectedControl.id
        ? {
            ...control,
            artifacts: control.artifacts.includes(artifactId)
              ? control.artifacts.filter(id => id !== artifactId)
              : [...control.artifacts, artifactId]
          }
        : control
    ));
  };

  const handleSave = async () => {
    try {
      // TODO: Replace with actual API call when available
      // await systemApi.updateControlsImplementation(clientId, systemId, controls);

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setError(err.message);
      setSaveStatus('error');
    }
  };

  const toggleRowExpansion = (controlId) => {
    setExpandedRows(prev => ({
      ...prev,
      [controlId]: !prev[controlId]
    }));
  };

  const handleAddControl = (controlData) => {
    setControls(prev => [...prev, {
      ...controlData,
      status: 'pending-review',
      testing: '',
      artifacts: [],
    }]);
  };

  const handleHelpClick = (control) => {
    setSelectedControlHelp(control);
    setHelpDialogOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Page Header */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <ImplementationIcon color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" gutterBottom>
                Security Controls Implementation
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Track implementation status and map artifacts to controls
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setControlFormOpen(true)}
            >
              Add Control
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Controls Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '40px' }}/>
              <TableCell style={{ width: '120px' }}>Control ID</TableCell>
              <TableCell style={{ width: '200px' }}>Name</TableCell>
              <TableCell style={{ width: '150px' }}>Status</TableCell>
              <TableCell>Testing Documentation</TableCell>
              <TableCell style={{ width: '40px' }}/>
            </TableRow>
          </TableHead>
          <TableBody>
            {controls.map((control) => (
              <Fragment key={control.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleRowExpansion(control.id)}
                    >
                      {expandedRows[control.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{control.id}</TableCell>
                  <TableCell>{control.name}</TableCell>
                  <TableCell>
                    <Select
                      value={control.status}
                      onChange={(e) => handleStatusChange(control.id, e.target.value)}
                      size="small"
                      fullWidth
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Chip
                            label={option.label}
                            color={option.color}
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={control.testing}
                      onChange={(e) => handleTestingChange(control.id, e.target.value)}
                      placeholder="Enter testing documentation..."
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      inputProps={{ maxLength: 200 }}
                      helperText={`${control.testing.length}/200`}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Control Details">
                      <IconButton
                        size="small"
                        onClick={() => handleHelpClick(control)}
                      >
                        <HelpIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={expandedRows[control.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Mapped Artifacts
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {control.artifacts.map((artifactId) => (
                              <Chip
                                key={artifactId}
                                label={artifacts.find(a => a.id === artifactId)?.name}
                                onDelete={() => handleArtifactToggle(artifactId)}
                                size="small"
                              />
                            ))}
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleArtifactDialogOpen(control)}
                          >
                            <LinkIcon />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Artifact Mapping Dialog */}
      <Dialog
        open={artifactDialogOpen}
        onClose={handleArtifactDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Map Artifacts to Control {selectedControl?.id}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" paragraph>
            Select artifacts that provide evidence for this control&apos;s implementation:
          </Typography>
          <Stack spacing={1}>
            {artifacts.map((artifact) => (
              <Paper
                key={artifact.id}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: (theme) =>
                    selectedControl?.artifacts.includes(artifact.id)
                      ? `2px solid ${theme.palette.primary.main}`
                      : '1px solid #e0e0e0',
                }}
                onClick={() => handleArtifactToggle(artifact.id)}
              >
                <Typography variant="subtitle2">{artifact.name}</Typography>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleArtifactDialogClose}>Done</Button>
        </DialogActions>
      </Dialog>

      {/* Control Help Dialog */}
      <Dialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedControlHelp?.id}: {selectedControlHelp?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            <Typography variant="subtitle1" gutterBottom>
              Description
            </Typography>
            {selectedControlHelp?.description}
          </DialogContentText>
          <DialogContentText>
            <Typography variant="subtitle1" gutterBottom>
              Implementation Requirements
            </Typography>
            {selectedControlHelp?.requirements}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Control Form Dialog */}
      <ControlForm
        open={controlFormOpen}
        onClose={() => setControlFormOpen(false)}
        onSubmit={handleAddControl}
      />
    </Container>
  );
};

export default ControlsImplementationPage;