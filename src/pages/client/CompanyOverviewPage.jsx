/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { 
  CompanyOverview,
  CompanyInfoDialog,
  useCompanyStructure
} from '../../components/company_structure';

const CompanyOverviewPage = () => {
  const { clientId } = useParams();
  const {
    client,
    loading,
    error,
    updateClient,
  } = useCompanyStructure(clientId);

  const [openCompanyDialog, setOpenCompanyDialog] = useState(false);
  const [editSection, setEditSection] = useState('');
  const [companyFormData, setCompanyFormData] = useState({
    industry: '',
    employeeCount: '',
    annualRevenue: '',
    primaryContact: '',
    email: '',
    phone: '',
  });

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

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Company Overview
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to the company management section. Here you can view and manage your company&apos;s information, 
          organizational structure, and important documents. Use the navigation menu to access detailed views 
          of your company structure and document management system.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={() => window.location.href = `/client/${clientId}/company/structure`}
            >
              View Company Structure
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={() => window.location.href = `/client/${clientId}/company/documents`}
            >
              Manage Documents
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Company Overview Section */}
      {client && (
        <CompanyOverview 
          client={client} 
          onEditOrganization={() => handleOpenCompanyDialog('organization')}
          onEditContact={() => handleOpenCompanyDialog('contact')}
        />
      )}

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

export default CompanyOverviewPage;