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
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  CompanyOverview,
  DepartmentsList,
  DepartmentDialog,
  CompanyInfoDialog,
  useCompanyStructure
} from '../../components/company_structure';

const CompanyStructurePage = () => {
  const { clientId } = useParams();
  const {
    client,
    departments,
    loading,
    error,
    updateClient,
    createDepartment,
    updateDepartment,
    addPosition,
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
  const [viewMode, setViewMode] = useState('orgChart');

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

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Render organization chart
  const renderOrgChart = () => {
    // Define colors for different levels
    const colors = {
      executive: '#4a75f5',
      cLevel: '#5499C7',
      department: '#3498db',
      team: '#5DADE2',
      background: '#ffffff',
      line: '#cccccc',
      text: '#ffffff',
      textDark: '#333333'
    };

    // Define box styles for reuse
    const boxStyle = (color, width, height) => ({
      width,
      height,
      bgcolor: color,
      color: colors.text,
      borderRadius: 1,
      boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      zIndex: 2,
    });

    // Define line styles for connecting boxes
    const verticalLine = (top, left, height) => ({
      position: 'absolute',
      top,
      left,
      width: '2px',
      height,
      bgcolor: colors.line,
      zIndex: 1,
    });

    const horizontalLine = (top, left, width) => ({
      position: 'absolute',
      top,
      left,
      height: '2px',
      width,
      bgcolor: colors.line,
      zIndex: 1,
    });

    return (
      <Box sx={{ p: 4, position: 'relative', minHeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* CEO Box */}
        <Box sx={{ mb: 5 }}>
          <Box sx={boxStyle(colors.executive, 200, 80)}>
            <Typography variant="subtitle1" fontWeight="bold">CEO</Typography>
            <Typography variant="body2">{client?.primaryContact || 'Not specified'}</Typography>
          </Box>
        </Box>

        {/* Vertical line from CEO to horizontal line */}
        <Box sx={verticalLine('80px', '50%', '40px')} />

        {/* Horizontal line connecting C-Level executives */}
        <Box sx={horizontalLine('120px', '20%', '60%')} />

        {/* C-Level Executives */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '80%', mb: 5 }}>
          {['CIO/CISO', 'CFO', 'COO'].map((title, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Vertical line from horizontal line to each C-level box */}
              <Box sx={verticalLine('120px', '50%', '20px')} />
              <Box sx={boxStyle(colors.cLevel, 180, 70)}>
                <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
                <Typography variant="body2">Executive</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Vertical line from CIO to IT departments horizontal line */}
        <Box sx={{ position: 'absolute', top: '190px', left: '25%', width: '2px', height: '40px', bgcolor: colors.line }} />

        {/* Horizontal line connecting IT departments */}
        <Box sx={{ position: 'absolute', top: '230px', left: '10%', height: '2px', width: '30%', bgcolor: colors.line }} />

        {/* IT Departments */}
        <Box sx={{ position: 'absolute', top: '250px', left: '10%', display: 'flex', justifyContent: 'space-between', width: '30%' }}>
          {['IT Security', 'IT Operations'].map((deptName, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Vertical line from horizontal line to each department box */}
              <Box sx={{ position: 'absolute', top: '-20px', left: '50%', width: '2px', height: '20px', bgcolor: colors.line }} />
              <Box sx={boxStyle(colors.department, 140, 60)}>
                <Typography variant="body2" fontWeight="bold">{deptName}</Typography>
                <Typography variant="caption">{index === 0 ? '8' : '12'} Members</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Vertical line from CFO to Finance departments horizontal line */}
        <Box sx={{ position: 'absolute', top: '190px', left: '50%', width: '2px', height: '40px', bgcolor: colors.line }} />

        {/* Horizontal line connecting Finance departments */}
        <Box sx={{ position: 'absolute', top: '230px', left: '40%', height: '2px', width: '20%', bgcolor: colors.line }} />

        {/* Finance Department */}
        <Box sx={{ position: 'absolute', top: '250px', left: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={boxStyle(colors.department, 140, 60)}>
            <Typography variant="body2" fontWeight="bold">Finance</Typography>
            <Typography variant="caption">6 Members</Typography>
          </Box>
        </Box>

        {/* Vertical line from COO to Operations departments horizontal line */}
        <Box sx={{ position: 'absolute', top: '190px', left: '75%', width: '2px', height: '40px', bgcolor: colors.line }} />

        {/* Horizontal line connecting Operations departments */}
        <Box sx={{ position: 'absolute', top: '230px', left: '65%', height: '2px', width: '20%', bgcolor: colors.line }} />

        {/* Operations Department */}
        <Box sx={{ position: 'absolute', top: '250px', left: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={boxStyle(colors.department, 140, 60)}>
            <Typography variant="body2" fontWeight="bold">Operations</Typography>
            <Typography variant="caption">15 Members</Typography>
          </Box>
        </Box>
      </Box>
    );
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

      {/* Header */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Company Structure
        </Typography>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => handleOpenDialog()}
        >
          Edit Structure
        </Button>
      </Paper>

      {/* View Options */}
      <Paper sx={{ p: 1, mb: 3 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="view mode"
          sx={{ display: 'flex', flexWrap: 'wrap' }}
        >
          <ToggleButton value="orgChart" aria-label="org chart" sx={{ borderRadius: '15px', m: 0.5 }}>
            Org Chart
          </ToggleButton>
          <ToggleButton value="locations" aria-label="locations" sx={{ borderRadius: '15px', m: 0.5 }}>
            Locations
          </ToggleButton>
          <ToggleButton value="departments" aria-label="departments" sx={{ borderRadius: '15px', m: 0.5 }}>
            Departments
          </ToggleButton>
          <ToggleButton value="teams" aria-label="teams" sx={{ borderRadius: '15px', m: 0.5 }}>
            Teams
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {/* Main Content */}
      <Paper sx={{ mb: 3, minHeight: 400, overflow: 'hidden' }}>
        {viewMode === 'orgChart' && renderOrgChart()}
        {viewMode === 'departments' && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">
                Departments
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Department
              </Button>
            </Box>
            <DepartmentsList 
              departments={departments}
              expandedDept={expandedDept}
              onExpandDepartment={handleExpandDepartment}
              onEditDepartment={handleOpenDialog}
              onAddPosition={addPosition}
            />
          </Box>
        )}
        {viewMode === 'locations' && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Locations View</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This feature is coming soon.
            </Typography>
          </Box>
        )}
        {viewMode === 'teams' && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Teams View</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This feature is coming soon.
            </Typography>
          </Box>
        )}
      </Paper>

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