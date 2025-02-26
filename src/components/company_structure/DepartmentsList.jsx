/* eslint-disable react/prop-types */
import 'react';
import {
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const DepartmentsList = ({ 
  departments, 
  expandedDept, 
  onExpandDepartment, 
  onEditDepartment, 
  onAddPosition 
}) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Departments & Positions
      </Typography>
      {departments.map((dept) => (
        <Accordion
          key={dept.id}
          expanded={expandedDept === dept.id}
          onChange={() => onExpandDepartment(dept.id)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <BusinessIcon sx={{ mr: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">{dept.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Head: {dept.head} ({dept.headTitle})
                </Typography>
              </Box>
              <Chip
                size="small"
                label={`${dept.employeeCount} Employees`}
                color="primary"
                sx={{ mr: 2 }}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditDepartment(dept);
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {(dept.positions || []).map((position, index) => (
                <ListItem key={position.id || index}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={position.name}
                    secondary={position.holder}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              startIcon={<AddIcon />}
              size="small"
              sx={{ mt: 1 }}
              onClick={() => onAddPosition(dept.id)}
            >
              Add Position
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};

export default DepartmentsList;