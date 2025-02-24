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
import PropTypes from 'prop-types';
import { initialAssessmentApi } from '../../../services';

function StakeholderAnalysisForm({ clientId, systemId, onSubmitSuccess, onSubmitError }) {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    email: '',
    phone: ''
  });

  const [formData, setFormData] = useState({
    owners: '',
    operators: '',
    responsibilities: '',
    contacts: [],
    communicationChannels: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assessmentData = await initialAssessmentApi.getInitialAssessment(clientId, systemId);
        const stakeholderData = assessmentData.stakeholders || {};
        
        setFormData({
          owners: stakeholderData.owners || '',
          operators: stakeholderData.operators || '',
          responsibilities: stakeholderData.responsibilities || '',
          contacts: stakeholderData.contacts || [],
          communicationChannels: stakeholderData.communicationChannels || ''
        });

        if (stakeholderData.status === 'completed') {
          setViewMode(true);
        }
      } catch (error) {
        console.error('Error fetching stakeholder data:', error);
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
    if (!formData.owners) {
      newErrors.owners = 'System owners information is required';
    }
    if (!formData.operators) {
      newErrors.operators = 'System operators information is required';
    }
    if (!formData.responsibilities) {
      newErrors.responsibilities = 'Security responsibilities must be defined';
    }
    if (formData.contacts.length === 0) {
      newErrors.contacts = 'At least one point of contact is required';
    }
    if (!formData.communicationChannels) {
      newErrors.communicationChannels = 'Communication channels must be defined';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateContact = () => {
    return (
      newContact.name.trim() &&
      newContact.role.trim() &&
      newContact.email.trim() &&
      newContact.phone.trim()
    );
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

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setNewContact(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddContact = () => {
    if (validateContact()) {
      setFormData(prevData => ({
        ...prevData,
        contacts: [...prevData.contacts, { ...newContact }]
      }));
      setNewContact({
        name: '',
        role: '',
        email: '',
        phone: ''
      });
      setShowContactDialog(false);
      if (errors.contacts) {
        setErrors(prev => ({ ...prev, contacts: undefined }));
      }
    }
  };

  const handleRemoveContact = (index) => {
    setFormData(prevData => ({
      ...prevData,
      contacts: prevData.contacts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      await initialAssessmentApi.updateStakeholders(clientId, systemId, formData);
      setViewMode(true);
      onSubmitSuccess();
    } catch (error) {
      console.error('Error updating stakeholders:', error);
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

  const renderContact = (contact) => (
    <Box sx={{ mb: 1 }}>
      <Typography variant="subtitle2">{contact.name} - {contact.role}</Typography>
      <Typography variant="body2">Email: {contact.email}</Typography>
      <Typography variant="body2">Phone: {contact.phone}</Typography>
    </Box>
  );

  if (viewMode) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Stakeholder Information</Typography>
          <Button variant="outlined" onClick={handleEdit}>
            Edit Information
          </Button>
        </Box>

        {renderField('System Owners', formData.owners)}
        {renderField('System Operators', formData.operators)}
        {renderField('Security Responsibilities', formData.responsibilities)}
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Points of Contact
          </Typography>
          {formData.contacts.map((contact, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              {renderContact(contact)}
            </Box>
          ))}
        </Box>

        {renderField('Communication Channels', formData.communicationChannels)}
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Stakeholder Analysis Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={3}
              name="owners"
              label="System Owners"
              value={formData.owners}
              onChange={handleChange}
              error={!!errors.owners}
              helperText={errors.owners || "Document the system owners and their roles"}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={3}
              name="operators"
              label="System Operators"
              value={formData.operators}
              onChange={handleChange}
              error={!!errors.operators}
              helperText={errors.operators || "List the system operators and their responsibilities"}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              name="responsibilities"
              label="Security Responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              error={!!errors.responsibilities}
              helperText={errors.responsibilities || "Define security responsibilities and roles"}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">Points of Contact</Typography>
                <Button onClick={() => setShowContactDialog(true)}>
                  Add Contact
                </Button>
              </Box>
              {errors.contacts && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                  {errors.contacts}
                </Typography>
              )}
              <List>
                {formData.contacts.map((contact, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={`${contact.name} - ${contact.role}`}
                      secondary={
                        <>
                          <Typography variant="body2">Email: {contact.email}</Typography>
                          <Typography variant="body2">Phone: {contact.phone}</Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleRemoveContact(index)}>
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
              rows={3}
              name="communicationChannels"
              label="Communication Channels"
              value={formData.communicationChannels}
              onChange={handleChange}
              error={!!errors.communicationChannels}
              helperText={errors.communicationChannels || "Define communication channels and procedures"}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setFormData({
                  owners: '',
                  operators: '',
                  responsibilities: '',
                  contacts: [],
                  communicationChannels: ''
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

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onClose={() => setShowContactDialog(false)}>
        <DialogTitle>Add Point of Contact</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                required
                fullWidth
                label="Name"
                name="name"
                value={newContact.name}
                onChange={handleContactChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Role"
                name="role"
                value={newContact.role}
                onChange={handleContactChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newContact.email}
                onChange={handleContactChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Phone"
                name="phone"
                value={newContact.phone}
                onChange={handleContactChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowContactDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddContact} 
            variant="contained"
            disabled={!validateContact()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

StakeholderAnalysisForm.propTypes = {
  clientId: PropTypes.number.isRequired,
  systemId: PropTypes.string.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  onSubmitError: PropTypes.func.isRequired,
};

export default StakeholderAnalysisForm;