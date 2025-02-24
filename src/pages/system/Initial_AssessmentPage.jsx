/* eslint-disable no-unused-vars */
import { Box, Tabs, Tab, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SystemDiscoveryForm from '../../components/system_ato/initial_assessment/SystemDiscoveryForm';
import EnvironmentAnalysisForm from '../../components/system_ato/initial_assessment/EnvironmentAnalysisForm';
import NetworkBoundaryForm from '../../components/system_ato/initial_assessment/NetworkBoundaryForm';
import StakeholderAnalysisForm from '../../components/system_ato/initial_assessment/StakeholderAnalysisForm';
import TabPanel from '../../components/system_ato/TabPanel';
import PhaseHeader from '../../components/system_ato/PhaseHeader';
import { initialAssessmentApi } from '../../services';

function Initial_AssessmentPage() {
  const { clientId, systemId } = useParams();
  const [currentTab, setCurrentTab] = useState(0);
  const [notification, setNotification] = useState(null);
  const [progress, setProgress] = useState(0);
  const [sectionStatus, setSectionStatus] = useState({
    discovery: 'not_started',
    environment: 'not_started',
    boundary: 'not_started',
    stakeholders: 'not_started'
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressData = await initialAssessmentApi.getProgress(parseInt(clientId, 10), systemId);
        setProgress(progressData.progress);
        setSectionStatus(progressData.sections);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    if (clientId && systemId) {
      fetchProgress();
    }
  }, [clientId, systemId]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleFormSubmitSuccess = async () => {
    try {
      // Refresh progress data
      const progressData = await initialAssessmentApi.getProgress(parseInt(clientId, 10), systemId);
      setProgress(progressData.progress);
      setSectionStatus(progressData.sections);

      setNotification({
        type: 'success',
        message: 'Information saved successfully'
      });
    } catch (error) {
      console.error('Error refreshing progress:', error);
    }
  };

  const handleFormSubmitError = (error) => {
    setNotification({
      type: 'error',
      message: `Error saving information: ${error.message}`
    });
  };

  const getTabStyle = (status) => ({
    color: status === 'completed' ? 'success.main' : 'inherit',
    '& .MuiTab-iconWrapper': {
      color: status === 'completed' ? 'success.main' : 'inherit'
    }
  });

  return (
    <Box sx={{ width: '100%' }}>
      <PhaseHeader 
        title="Initial Assessment" 
        description="Complete the initial assessment phase by providing detailed information about the system."
        progress={progress}
        phase="initial_assessment"
      />
      
      {notification && (
        <Alert 
          severity={notification.type}
          onClose={() => setNotification(null)}
          sx={{ mb: 2 }}
        >
          {notification.message}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab 
            label="System Discovery" 
            sx={getTabStyle(sectionStatus.discovery)}
          />
          <Tab 
            label="Environment Analysis"
            sx={getTabStyle(sectionStatus.environment)}
          />
          <Tab 
            label="Network & Boundaries"
            sx={getTabStyle(sectionStatus.boundary)}
          />
          <Tab 
            label="Stakeholders"
            sx={getTabStyle(sectionStatus.stakeholders)}
          />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <SystemDiscoveryForm 
          clientId={parseInt(clientId, 10)}
          systemId={systemId}
          onSubmitSuccess={handleFormSubmitSuccess}
          onSubmitError={handleFormSubmitError}
        />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <EnvironmentAnalysisForm 
          clientId={parseInt(clientId, 10)}
          systemId={systemId}
          onSubmitSuccess={handleFormSubmitSuccess}
          onSubmitError={handleFormSubmitError}
        />
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <NetworkBoundaryForm 
          clientId={parseInt(clientId, 10)}
          systemId={systemId}
          onSubmitSuccess={handleFormSubmitSuccess}
          onSubmitError={handleFormSubmitError}
        />
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <StakeholderAnalysisForm 
          clientId={parseInt(clientId, 10)}
          systemId={systemId}
          onSubmitSuccess={handleFormSubmitSuccess}
          onSubmitError={handleFormSubmitError}
        />
      </TabPanel>
    </Box>
  );
}

export default Initial_AssessmentPage;