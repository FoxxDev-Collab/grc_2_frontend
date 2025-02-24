import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Grid,
  Button,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import PropTypes from 'prop-types';
import { initialAssessmentApi } from '../../../services';

function NetworkBoundaryForm({ clientId, systemId, onSubmitSuccess, onSubmitError }) {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPortDialog, setShowPortDialog] = useState(false);
  const [showProtocolDialog, setShowProtocolDialog] = useState(false);
  const [newPort, setNewPort] = useState('');
  const [newProtocol, setNewProtocol] = useState('');
  const [networkDiagramName, setNetworkDiagramName] = useState('');

  const [formData, setFormData] = useState({
    networkDiagram: null,
    description: '',
    ports: [],
    protocols: [],
    procedures: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assessmentData = await initialAssessmentApi.getInitialAssessment(clientId, systemId);
        const boundaryData = assessmentData.boundary || {};
        
        setFormData({
          networkDiagram: null,
          description: boundaryData.description || '',
          ports: boundaryData.ports || [],
          protocols: boundaryData.protocols || [],
          procedures: boundaryData.procedures || ''
        });
        setNetworkDiagramName(boundaryData.networkDiagramName || '');

        if (boundaryData.status === 'completed') {
          setViewMode(true);
        }
      } catch (error) {
        console.error('Error fetching boundary data:', error);
        onSubmitError(error);
      } finally {
        setLoading(false);
      }
    };

    if (clientId && systemId) {
      fetchData();
    }
  }, [clientId, systemId, onSubmitError]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description) {
      newErrors.description = 'System boundary description is required';
    }
    if (formData.ports.length === 0) {
      newErrors.ports = 'At least one port must be specified';
    }
    if (formData.protocols.length === 0) {
      newErrors.protocols = 'At least one protocol must be specified';
    }
    if (!formData.procedures) {
      newErrors.procedures = 'Procedures documentation is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prevData => ({
        ...prevData,
        networkDiagram: file
      }));
      setNetworkDiagramName(file.name);
    }
  };

  const handleAddPort = () => {
    if (newPort.trim()) {
      setFormData(prevData => ({
        ...prevData,
        ports: [...prevData.ports, newPort.trim()]
      }));
      setNewPort('');
      setShowPortDialog(false);
      if (errors.ports) {
        setErrors(prev => ({ ...prev, ports: undefined }));
      }
    }
  };

  const handleAddProtocol = () => {
    if (newProtocol.trim()) {
      setFormData(prevData => ({
        ...prevData,
        protocols: [...prevData.protocols, newProtocol.trim()]
      }));
      setNewProtocol('');
      setShowProtocolDialog(false);
      if (errors.protocols) {
        setErrors(prev => ({ ...prev, protocols: undefined }));
      }
    }
  };

  const handleRemovePort = (index) => {
    setFormData(prevData => ({
      ...prevData,
      ports: prevData.ports.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveProtocol = (index) => {
    setFormData(prevData => ({
      ...prevData,
      protocols: prevData.protocols.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      // Note: File upload will be implemented later
      await initialAssessmentApi.updateNetworkBoundary(clientId, systemId, {
        description: formData.description,
        ports: formData.ports,
        protocols: formData.protocols,
        procedures: formData.procedures,
        networkDiagramName: networkDiagramName
      });
      setViewMode(true);
      onSubmitSuccess();
    } catch (error) {
      console.error('Error updating network boundary:', error);
      onSubmitError(error);
    }
  };

  const handleEdit = () => {
    setViewMode(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderField = (label, value, helperText = '') => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1" paragraph>
        {value || 'Not provided'}
      </Typography>
      {helperText && (
        <Typography variant="caption" color="textSecondary">
          {helperText}
        </Typography>
      )}
    </Box>
  );

  if (viewMode) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Network & Boundary Information</Typography>
          <Button variant="outlined" onClick={handleEdit}>
            Edit Information
          </Button>
        </Box>

        {renderField('Network Diagram', networkDiagramName)}
        {renderField('System Boundary Description', formData.description)}
        {renderField('Ports', formData.ports.join(', '))}
        {renderField('Protocols', formData.protocols.join(', '))}
        {renderField('Procedures', formData.procedures)}
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Network & Boundary Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                style={{ display: 'none' }}
                id="network-diagram-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="network-diagram-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                >
                  Upload Network Diagram
                </Button>
              </label>
              {networkDiagramName && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {networkDiagramName}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              name="description"
              label="System Boundary Description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description || "Describe the system's boundaries and scope"}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">Ports</Typography>
                <Button onClick={() => setShowPortDialog(true)}>
                  Add Port
                </Button>
              </Box>
              {errors.ports && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                  {errors.ports}
                </Typography>
              )}
              <List>
                {formData.ports.map((port, index) => (
                  <ListItem key={index} divider>
                    <ListItemText primary={port} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleRemovePort(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">Protocols</Typography>
                <Button onClick={() => setShowProtocolDialog(true)}>
                  Add Protocol
                </Button>
              </Box>
              {errors.protocols && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                  {errors.protocols}
                </Typography>
              )}
              <List>
                {formData.protocols.map((protocol, index) => (
                  <ListItem key={index} divider>
                    <ListItemText primary={protocol} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleRemoveProtocol(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              name="procedures"
              label="Procedures"
              value={formData.procedures}
              onChange={handleChange}
              error={!!errors.procedures}
              helperText={errors.procedures || "Document the procedures for managing and maintaining the network boundaries"}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setFormData({
                  networkDiagram: null,
                  description: '',
                  ports: [],
                  protocols: [],
                  procedures: ''
                })}
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Save & Continue
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Port Dialog */}
      <Dialog open={showPortDialog} onClose={() => setShowPortDialog(false)}>
        <DialogTitle>Add Port</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Port Number and Service"
            fullWidth
            value={newPort}
            onChange={(e) => setNewPort(e.target.value)}
            placeholder="e.g., 443 (HTTPS)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPortDialog(false)}>Cancel</Button>
          <Button onClick={handleAddPort} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Protocol Dialog */}
      <Dialog open={showProtocolDialog} onClose={() => setShowProtocolDialog(false)}>
        <DialogTitle>Add Protocol</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Protocol"
            fullWidth
            value={newProtocol}
            onChange={(e) => setNewProtocol(e.target.value)}
            placeholder="e.g., TCP/IP"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProtocolDialog(false)}>Cancel</Button>
          <Button onClick={handleAddProtocol} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

NetworkBoundaryForm.propTypes = {
  clientId: PropTypes.number.isRequired,
  systemId: PropTypes.string.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  onSubmitError: PropTypes.func.isRequired,
};

export default NetworkBoundaryForm;