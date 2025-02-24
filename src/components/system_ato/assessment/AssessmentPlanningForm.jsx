import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import dayjs from 'dayjs';

const AssessmentPlanningForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    assessmentTitle: '',
    assessmentType: '',
    startDate: null,
    endDate: null,
    assessmentTeam: '',
    objectives: '',
    methodology: '',
    scope: '',
    requirements: '',
  });

  const [isEditing, setIsEditing] = useState(!initialData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (field) => (date) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: date ? date.toISOString() : null
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    if (initialData) {
      setIsEditing(false);
    }
  };

  const assessmentTypes = [
    'Initial Assessment',
    'Annual Assessment',
    'Follow-up Assessment',
    'Special Assessment'
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {initialData ? 'Assessment Details' : 'Create New Assessment'}
            </Typography>
            {initialData && (
              <IconButton 
                onClick={() => setIsEditing(!isEditing)}
                color={isEditing ? 'primary' : 'default'}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Assessment Title"
                  name="assessmentTitle"
                  value={formData.assessmentTitle}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Assessment Type</InputLabel>
                  <Select
                    name="assessmentType"
                    value={formData.assessmentType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    label="Assessment Type"
                  >
                    {assessmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate ? dayjs(formData.startDate) : null}
                  onChange={handleDateChange('startDate')}
                  disabled={!isEditing}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate ? dayjs(formData.endDate) : null}
                  onChange={handleDateChange('endDate')}
                  disabled={!isEditing}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Assessment Team"
                  name="assessmentTeam"
                  value={formData.assessmentTeam}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Objectives"
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Methodology"
                  name="methodology"
                  value={formData.methodology}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Scope"
                  name="scope"
                  value={formData.scope}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  disabled={!isEditing}
                  multiline
                  rows={3}
                />
              </Grid>
              {isEditing && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    {initialData && (
                      <Button
                        variant="outlined"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                    >
                      {initialData ? 'Update Assessment' : 'Create Assessment'}
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

AssessmentPlanningForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    assessmentTitle: PropTypes.string,
    assessmentType: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    assessmentTeam: PropTypes.string,
    objectives: PropTypes.string,
    methodology: PropTypes.string,
    scope: PropTypes.string,
    requirements: PropTypes.string,
  }),
};

export default AssessmentPlanningForm;