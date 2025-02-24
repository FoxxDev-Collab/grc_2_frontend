import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  Alert,
  Snackbar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { systemComponentsApi } from '../../services';
import SystemComponentForm from '../../components/SystemComponentForm';

const ComponentsPage = () => {
  const [components, setComponents] = useState([]);
  const [componentTypes, setComponentTypes] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');

  const loadComponentTypes = async () => {
    try {
      const types = await systemComponentsApi.getComponentTypes();
      setComponentTypes(types);
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to load component types: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const loadComponents = async () => {
    try {
      setLoading(true);
      const response = await systemComponentsApi.getComponents();
      setComponents(response);
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to load components: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([loadComponents(), loadComponentTypes()]);
  }, []);

  const handleCreateComponent = async (formData) => {
    try {
      await systemComponentsApi.createComponent(formData);
      setAlert({
        open: true,
        message: 'Component created successfully',
        severity: 'success'
      });
      setIsFormOpen(false);
      loadComponents();
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to create component: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleUpdateComponent = async (formData) => {
    try {
      await systemComponentsApi.updateComponent(selectedComponent.id, formData);
      setAlert({
        open: true,
        message: 'Component updated successfully',
        severity: 'success'
      });
      setIsFormOpen(false);
      setSelectedComponent(null);
      loadComponents();
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to update component: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleDeleteComponent = async (id) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        await systemComponentsApi.deleteComponent(id);
        setAlert({
          open: true,
          message: 'Component deleted successfully',
          severity: 'success'
        });
        loadComponents();
      } catch (error) {
        setAlert({
          open: true,
          message: `Failed to delete component: ${error.message}`,
          severity: 'error'
        });
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'success',
      INACTIVE: 'error',
      MAINTENANCE: 'warning',
      DECOMMISSIONED: 'default'
    };
    return colors[status] || 'default';
  };

  const filteredComponents = filterType
    ? components.filter(component => component.type === filterType)
    : components;

  const renderSpecifications = (specifications) => {
    return Object.entries(specifications)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  if (loading && components.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            System Components
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                label="Filter by Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {componentTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedComponent(null);
                setIsFormOpen(true);
              }}
            >
              Add Component
            </Button>
            <IconButton onClick={loadComponents} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Specifications</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredComponents.map((component) => (
                <TableRow key={component.id}>
                  <TableCell>{component.name}</TableCell>
                  <TableCell>{component.type.replace('_', ' ')}</TableCell>
                  <TableCell>{component.description}</TableCell>
                  <TableCell>
                    <Tooltip title={renderSpecifications(component.specifications)}>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {renderSpecifications(component.specifications)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={component.status}
                      color={getStatusColor(component.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(component.lastUpdated).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => {
                          setSelectedComponent(component);
                          setIsFormOpen(true);
                        }}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteComponent(component.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedComponent(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <SystemComponentForm
            initialData={selectedComponent}
            onSubmit={selectedComponent ? handleUpdateComponent : handleCreateComponent}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedComponent(null);
            }}
          />
        </Dialog>

        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          <Alert
            onClose={() => setAlert({ ...alert, open: false })}
            severity={alert.severity}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default ComponentsPage;