/* eslint-disable react/prop-types */
import 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
} from '@mui/material';

const DepartmentDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  formData, 
  onChange, 
  isEdit 
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? 'Edit Department' : 'Add New Department'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Department Name"
              name="name"
              value={formData.name}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Department Head"
              name="head"
              value={formData.head}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Head Title"
              name="headTitle"
              value={formData.headTitle}
              onChange={onChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>
          {isEdit ? 'Save Changes' : 'Add Department'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DepartmentDialog;