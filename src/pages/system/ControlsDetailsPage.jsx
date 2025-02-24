import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Stack,
  Divider,
} from '@mui/material';
import { ListAlt as DetailsIcon } from '@mui/icons-material';
import LowAC from '../../components/nist_controls_low_base/lowAC';
import LowAT from '../../components/nist_controls_low_base/lowAT';
import LowAU from '../../components/nist_controls_low_base/lowAU';

// TabPanel component for handling tab content display
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`control-family-tabpanel-${index}`}
      aria-labelledby={`control-family-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

const ControlsDetailsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Control family definitions
  const controlFamilies = [
    { id: 'AC', name: 'Access Control' },
    { id: 'AT', name: 'Awareness and Training' },
    { id: 'AU', name: 'Audit and Accountability' },
    { id: 'CA', name: 'Assessment, Authorization, and Monitoring' },
    { id: 'CM', name: 'Configuration Management' },
    { id: 'CP', name: 'Contingency Planning' },
    { id: 'IA', name: 'Identification and Authentication' },
    { id: 'IR', name: 'Incident Response' },
    { id: 'MA', name: 'Maintenance' },
    { id: 'MP', name: 'Media Protection' },
    { id: 'PE', name: 'Physical and Environmental Protection' },
    { id: 'PL', name: 'Planning' },
    { id: 'PS', name: 'Personnel Security' },
    { id: 'RA', name: 'Risk Assessment' },
    { id: 'SA', name: 'System and Services Acquisition' },
    { id: 'SC', name: 'System and Communications Protection' },
    { id: 'SI', name: 'System and Information Integrity' },
    { id: 'SR', name: 'Supply Chain Risk Management' },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Function to render the appropriate component based on control family
  const renderControlFamily = (familyId) => {
    switch (familyId) {
      case 'AC':
        return <LowAC />;
      case 'AT':
        return <LowAT />;
      case 'AU':
        return <LowAU />;
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {controlFamilies.find(f => f.id === familyId)?.name} ({familyId})
            </Typography>
            <Typography>
              Component for {controlFamilies.find(f => f.id === familyId)?.name} controls will be implemented soon.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Page Header */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <DetailsIcon color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" gutterBottom>
              Security Control Details
            </Typography>
            <Typography variant="body1" color="textSecondary">
              View and manage NIST control catalog components for LOW baseline
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Control Families Tabs */}
      <Paper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="security control families tabs"
          >
            {controlFamilies.map((family, index) => (
              <Tab
                key={family.id}
                label={
                  <Stack alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle2">{family.id}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {family.name}
                    </Typography>
                  </Stack>
                }
                id={`control-family-tab-${index}`}
                aria-controls={`control-family-tabpanel-${index}`}
                sx={{ minHeight: 72, textTransform: 'none' }}
              />
            ))}
          </Tabs>
        </Box>

        <Divider />

        {/* Tab Panels */}
        {controlFamilies.map((family, index) => (
          <TabPanel key={family.id} value={activeTab} index={index}>
            {renderControlFamily(family.id)}
          </TabPanel>
        ))}
      </Paper>
    </Container>
  );
};

export default ControlsDetailsPage;