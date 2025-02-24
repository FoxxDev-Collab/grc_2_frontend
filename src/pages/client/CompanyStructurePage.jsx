import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { clientApi } from '../../services';

const CompanyStructurePage = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCompanyDialog, setOpenCompanyDialog] = useState(false);
  const [editSection, setEditSection] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    headTitle: '',
    positions: []
  });
  const [companyFormData, setCompanyFormData] = useState({
    industry: '',
    employeeCount: '',
    annualRevenue: '',
    primaryContact: '',
    email: '',
    phone: '',
  });
  const [expandedDept, setExpandedDept] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCompanyStructure = async () => {
      try {
        setLoading(true);
        const [clientData, deptData, docsData] = await Promise.all([
          clientApi.getClient(Number(clientId)),
          clientApi.getDepartments(clientId),
          clientApi.getCompanyDocuments(clientId)
        ]);
        setClient(clientData);
        setDepartments(deptData);
        setDocuments(docsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyStructure();
  }, [clientId]);

  const handleOpenCompanyDialog = (section) => {
    setEditSection(section);
    setCompanyFormData({
      industry: client.industry || '',
      employeeCount: client.employeeCount || '',
      annualRevenue: client.annualRevenue || '',
      primaryContact: client.primaryContact || '',
      email: client.email || '',
      phone: client.phone || '',
    });
    setOpenCompanyDialog(true);
  };

  const handleCloseCompanyDialog = () => {
    setOpenCompanyDialog(false);
    setEditSection('');
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanySubmit = async () => {
    try {
      const updates = {};
      if (editSection === 'organization') {
        updates.industry = companyFormData.industry;
        updates.employeeCount = companyFormData.employeeCount;
        updates.annualRevenue = companyFormData.annualRevenue;
      } else if (editSection === 'contact') {
        updates.primaryContact = companyFormData.primaryContact;
        updates.email = companyFormData.email;
        updates.phone = companyFormData.phone;
      }

      const updatedClient = await clientApi.updateClient(Number(clientId), updates);
      setClient(updatedClient);
      handleCloseCompanyDialog();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenDialog = (department = null) => {
    if (department) {
      setSelectedDepartment(department);
      setFormData({
        name: department.name,
        head: department.head,
        headTitle: department.headTitle,
        positions: department.positions || []
      });
    } else {
      setSelectedDepartment(null);
      setFormData({
        name: '',
        head: '',
        headTitle: '',
        positions: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDepartment(null);
    setFormData({
      name: '',
      head: '',
      headTitle: '',
      positions: []
    });
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
      if (selectedDepartment) {
        const updatedDept = await clientApi.updateDepartment(clientId, selectedDepartment.id, {
          ...formData,
          positions: selectedDepartment.positions || []
        });
        setDepartments(prev =>
          prev.map(dept =>
            dept.id === selectedDepartment.id ? updatedDept : dept
          )
        );
      } else {
        const newDept = await clientApi.createDepartment(clientId, {
          ...formData,
          employeeCount: 0,
          positions: []
        });
        setDepartments(prev => [...prev, newDept]);
      }
      handleCloseDialog();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddPosition = async (deptId) => {
    try {
      const department = departments.find(d => d.id === deptId);
      if (!department) {
        throw new Error('Department not found');
      }

      const position = {
        id: (department.positions?.length || 0) + 1,
        name: 'New Position',
        holder: 'Unassigned'
      };

      const updatedPositions = [...(department.positions || []), position];
      
      const updatedDept = await clientApi.updateDepartment(clientId, deptId, {
        ...department,
        positions: updatedPositions
      });

      setDepartments(prev =>
        prev.map(dept =>
          dept.id === deptId ? updatedDept : dept
        )
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUploadDocument = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      const newDoc = await clientApi.uploadDocument(clientId, formData);
      setDocuments(prev => [...prev, newDoc]);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownloadDocument = async (docId) => {
    try {
      await clientApi.downloadDocument(clientId, docId);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExpandDepartment = (deptId) => {
    setExpandedDept(expandedDept === deptId ? '' : deptId);
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

      {/* Company Overview Section */}
      {client && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Organization Details
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleOpenCompanyDialog('organization')}
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
                  onClick={() => handleOpenCompanyDialog('contact')}
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
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Company Structure
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Department
            </Button>
          </Box>
        </Grid>

        {/* Departments Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Departments & Positions
            </Typography>
            {departments.map((dept) => (
              <Accordion
                key={dept.id}
                expanded={expandedDept === dept.id}
                onChange={() => handleExpandDepartment(dept.id)}
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
                        handleOpenDialog(dept);
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
                    onClick={() => handleAddPosition(dept.id)}
                  >
                    Add Position
                  </Button>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>

        {/* Documents Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Company Documents
              </Typography>
              <Button
                component="label"
                startIcon={<UploadIcon />}
                size="small"
              >
                Upload
                <input
                  type="file"
                  hidden
                  onChange={handleUploadDocument}
                />
              </Button>
            </Box>
            <Grid container spacing={2}>
              {documents.map((doc) => (
                <Grid item xs={12} key={doc.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <DescriptionIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle2">
                          {doc.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        Last updated: {doc.lastUpdated}
                      </Typography>
                      <Chip
                        size="small"
                        label={doc.type}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadDocument(doc.id)}
                      >
                        Download
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Add/Edit Department Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDepartment ? 'Edit Department' : 'Add New Department'}
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
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Department Head"
                name="head"
                value={formData.head}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Head Title"
                name="headTitle"
                value={formData.headTitle}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedDepartment ? 'Save Changes' : 'Add Department'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Company Information Dialog */}
      <Dialog open={openCompanyDialog} onClose={handleCloseCompanyDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editSection === 'organization' ? 'Edit Organization Details' : 'Edit Contact Information'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {editSection === 'organization' ? (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Industry"
                    name="industry"
                    value={companyFormData.industry}
                    onChange={handleCompanyChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Number of Employees"
                    name="employeeCount"
                    type="number"
                    value={companyFormData.employeeCount}
                    onChange={handleCompanyChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Annual Revenue"
                    name="annualRevenue"
                    value={companyFormData.annualRevenue}
                    onChange={handleCompanyChange}
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
                    value={companyFormData.primaryContact}
                    onChange={handleCompanyChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={companyFormData.email}
                    onChange={handleCompanyChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={companyFormData.phone}
                    onChange={handleCompanyChange}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompanyDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCompanySubmit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CompanyStructurePage;