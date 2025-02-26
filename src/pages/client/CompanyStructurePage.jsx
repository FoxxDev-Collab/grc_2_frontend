/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {
  CompanyOverview,
  DepartmentsList,
  CompanyDocuments,
  DepartmentDialog,
  CompanyInfoDialog,
  useCompanyStructure
} from '../../components/company_structure';

const CompanyStructurePage = () => {
  const { clientId } = useParams();
  const {
    client,
    departments,
    documents,
    loading,
    error,
    updateClient,
    createDepartment,
    updateDepartment,
    addPosition,
    uploadDocument,
    downloadDocument
  } = useCompanyStructure(clientId);

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

  // Company Info Dialog Handlers
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

      await updateClient(updates);
      handleCloseCompanyDialog();
    } catch (err) {
      // Error is handled in the hook
    }
  };

  // Department Dialog Handlers
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
        await updateDepartment(selectedDepartment.id, {
          ...formData,
          positions: selectedDepartment.positions || []
        });
      } else {
        await createDepartment({
          ...formData,
          employeeCount: 0,
          positions: []
        });
      }
      handleCloseDialog();
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleExpandDepartment = (deptId) => {
    setExpandedDept(expandedDept === deptId ? '' : deptId);
  };

  const handleUploadDocument = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadDocument(file);
    }
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
        <CompanyOverview 
          client={client} 
          onEditOrganization={() => handleOpenCompanyDialog('organization')}
          onEditContact={() => handleOpenCompanyDialog('contact')}
        />
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
          <DepartmentsList 
            departments={departments}
            expandedDept={expandedDept}
            onExpandDepartment={handleExpandDepartment}
            onEditDepartment={handleOpenDialog}
            onAddPosition={addPosition}
          />
        </Grid>

        {/* Documents Section */}
        <Grid item xs={12} md={4}>
          <CompanyDocuments 
            documents={documents}
            onUpload={handleUploadDocument}
            onDownload={downloadDocument}
          />
        </Grid>
      </Grid>

      {/* Add/Edit Department Dialog */}
      <DepartmentDialog 
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
        isEdit={!!selectedDepartment}
      />

      {/* Edit Company Information Dialog */}
      <CompanyInfoDialog 
        open={openCompanyDialog}
        onClose={handleCloseCompanyDialog}
        onSubmit={handleCompanySubmit}
        formData={companyFormData}
        onChange={handleCompanyChange}
        section={editSection}
      />
    </Container>
  );
};

export default CompanyStructurePage;