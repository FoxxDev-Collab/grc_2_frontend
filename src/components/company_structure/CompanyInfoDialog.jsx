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

const CompanyInfoDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  formData, 
  onChange, 
  section 
}) => {
  const isOrganization = section === 'organization';
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isOrganization ? 'Edit Organization Details' : 'Edit Contact Information'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {isOrganization ? (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Number of Employees"
                  name="employeeCount"
                  type="number"
                  value={formData.employeeCount}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Annual Revenue"
                  name="annualRevenue"
                  value={formData.annualRevenue}
                  onChange={onChange}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Primary Contact"
                  name="primaryContact"
                  value={formData.primaryContact}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={onChange}
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyInfoDialog;