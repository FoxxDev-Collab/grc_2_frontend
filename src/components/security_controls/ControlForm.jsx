import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';

const ControlForm = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    family: '',
    description: '',
    requirements: '',
  });

  const controlFamilies = [
    { id: 'AC', name: 'Access Control' },
    { id: 'AT', name: 'Awareness and Training' },
    { id: 'AU', name: 'Audit and Accountability' },
    { id: 'CA', name: 'Assessment, Authorization, and Monitoring' },
    { id: 'CM', name: 'Configuration Management' },
    { id: 'CP', name: 'Contingency Planning' },
    { id: 'IA', name: 'Identification and Authentication' },
    { id: 'IR', name: 'Incident Response' },
    { id: 'MA', name: 'Maintenance' },
    { id: 'MP', name: 'Media Protection' },
    { id: 'PE', name: 'Physical and Environmental Protection' },
    { id: 'PL', name: 'Planning' },
    { id: 'PS', name: 'Personnel Security' },
    { id: 'RA', name: 'Risk Assessment' },
    { id: 'SA', name: 'System and Services Acquisition' },
    { id: 'SC', name: 'System and Communications Protection' },
    { id: 'SI', name: 'System and Information Integrity' },
    { id: 'SR', name: 'Supply Chain Risk Management' },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      id: '',
      name: '',
      family: '',
      description: '',
      requirements: '',
    });
    onClose();
  };

  const isValid = () => {
    return (
      formData.id.trim() !== '' &&
      formData.name.trim() !== '' &&
      formData.family !== '' &&
      formData.description.trim() !== ''
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Security Control</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="family-label">Control Family</InputLabel>
              <Select
                labelId="family-label"
                name="family"
                value={formData.family}
                label="Control Family"
                onChange={handleChange}
              >
                {controlFamilies.map((family) => (
                  <MenuItem key={family.id} value={family.id}>
                    {family.id} - {family.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="id"
              label="Control ID"
              value={formData.id}
              onChange={handleChange}
              placeholder="e.g., AC-1"
              sx={{ width: '200px' }}
            />
          </Stack>

          <TextField
            name="name"
            label="Control Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            placeholder="e.g., Policy and Procedures"
          />

          <TextField
            name="description"
            label="Control Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            placeholder="Provide a description of the control..."
          />

          <TextField
            name="requirements"
            label="Implementation Requirements"
            value={formData.requirements}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            placeholder="List the specific requirements for implementing this control..."
          />

          <Typography variant="caption" color="text.secondary">
            * All fields except Implementation Requirements are required
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isValid()}
        >
          Add Control
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ControlForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ControlForm;