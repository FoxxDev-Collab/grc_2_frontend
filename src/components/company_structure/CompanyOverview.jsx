/* eslint-disable react/prop-types */
import 'react';
import {
  Grid,
  Paper,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const CompanyOverview = ({ client, onEditOrganization, onEditContact }) => {
  if (!client) return null;

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Organization Details
            </Typography>
            <IconButton
              size="small"
              onClick={onEditOrganization}
            >
              <EditIcon />
            </IconButton>
          </Box>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Industry"
                secondary={client.industry || 'Not specified'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Employees"
                secondary={client.employeeCount || 'Not specified'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Revenue"
                secondary={client.annualRevenue || 'Not specified'}
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Contact Information
            </Typography>
            <IconButton
              size="small"
              onClick={onEditContact}
            >
              <EditIcon />
            </IconButton>
          </Box>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Primary Contact"
                secondary={client.primaryContact || 'Not specified'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Email"
                secondary={client.email || 'Not specified'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Phone"
                secondary={client.phone || 'Not specified'}
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CompanyOverview;