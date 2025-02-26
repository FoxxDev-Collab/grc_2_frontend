import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { systemApi, SecurityLevel, InformationLevel, SystemCategory } from '../../services';

const SYSTEM_TYPES = [
  'Major Application',
  'General Support System',
  'Minor Application',
  'Other'
];

const SystemsManagementPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    securityLevel: '',
    informationLevel: '',
    category: '',
    location: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSystems = async () => {
      try {
        setLoading(true);
        // Add debugging
        console.log('SystemsManagementPage loading systems with:', {
          clientId,
          clientIdType: typeof clientId
        });
        
        // Convert clientId to number since it's stored as number in mock data
        const systemsData = await systemApi.getSystems(Number(clientId));
        console.log('SystemsManagementPage systems data:', systemsData); // Debug
        setSystems(systemsData);
        setError('');
      } catch (err) {
        setError(err.message);
        console.error('Error loading systems:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSystems();
  }, [clientId]);

  const handleOpenDialog = (system = null) => {
    if (system) {
      setSelectedSystem(system);
      setFormData({
        name: system.name,
        type: system.type,
        description: system.description,
        securityLevel: system.securityLevel,
        informationLevel: system.informationLevel,
        category: system.category,
        location: system.location || ''
      });
    } else {
      setSelectedSystem(null);
      setFormData({
        name: '',
        type: '',
        description: '',
        securityLevel: '',
        informationLevel: '',
        category: '',
        location: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSystem(null);
    setFormData({
      name: '',
      type: '',
      description: '',
      securityLevel: '',
      informationLevel: '',
      category: '',
      location: ''
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.name || !formData.type || !formData.securityLevel || 
          !formData.informationLevel || !formData.category) {
        setError('Please fill in all required fields');
        return;
      }

      let updatedSystem;
      if (selectedSystem) {
        // Update existing system
        updatedSystem = await systemApi.updateSystem(Number(clientId), selectedSystem.id, formData);
        setSystems(prev =>
          prev.map(sys => sys.id === updatedSystem.id ? updatedSystem : sys)
        );
      } else {
        // Add new system
        updatedSystem = await systemApi.createSystem(Number(clientId), formData);
        setSystems(prev => [...prev, updatedSystem]);
      }

      handleCloseDialog();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (systemId) => {
    try {
      await systemApi.deleteSystem(Number(clientId), systemId);
      setSystems(prev => prev.filter(sys => sys.id !== systemId));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSecurityControls = (systemId) => {
    console.log('Navigating to system:', systemId); // Debug
    navigate(`/client/${clientId}/systems/${systemId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Systems Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add System
        </Button>
      </Box>

      {systems.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No systems added yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Click the &quot;Add System&quot; button to add your first system
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Security Level</TableCell>
                <TableCell>ATO Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {systems.map((system) => (
                <TableRow key={system.id}>
                  <TableCell>{system.name}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={system.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={system.securityLevel.toUpperCase()}
                      color={
                        system.securityLevel === SecurityLevel.CRITICAL ? 'error' :
                        system.securityLevel === SecurityLevel.HIGH ? 'warning' :
                        system.securityLevel === SecurityLevel.MEDIUM ? 'info' : 'success'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={system.atoStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      color={
                        system.atoStatus === 'approved' ? 'success' :
                        system.atoStatus === 'in_progress' ? 'warning' :
                        system.atoStatus === 'expired' ? 'error' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit System">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(system)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View System">
                      <IconButton
                        size="small"
                        onClick={() => handleSecurityControls(system.id)}
                      >
                        <SecurityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete System">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(system.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit System Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedSystem ? 'Edit System' : 'Add New System'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="System Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                select
                label="System Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                {SYSTEM_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                select
                label="Security Level"
                name="securityLevel"
                value={formData.securityLevel}
                onChange={handleChange}
              >
                {Object.entries(SecurityLevel).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                select
                label="Information Level"
                name="informationLevel"
                value={formData.informationLevel}
                onChange={handleChange}
              >
                {Object.entries(InformationLevel).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                select
                label="System Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {Object.entries(SystemCategory).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., On-premises, Cloud, Office"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="System description and purpose..."
              />
            </Grid>
          </Grid>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedSystem ? 'Save Changes' : 'Add System'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SystemsManagementPage;