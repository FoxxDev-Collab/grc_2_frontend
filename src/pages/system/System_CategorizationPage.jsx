/* eslint-disable no-unused-vars */
import { Box, Tabs, Tab, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  InformationTypesForm,
  ImpactAnalysisForm,
  SecurityObjectivesForm
} from '../../components/system_ato/system_categorization';
import { TabPanel, PhaseHeader } from '../../components/system_ato';
import { systemCategorizationApi } from '../../services';

function System_CategorizationPage() {
  const { clientId, systemId } = useParams();
  const [currentTab, setCurrentTab] = useState(0);
  const [notification, setNotification] = useState(null);
  const [progress, setProgress] = useState(0);
  const [sectionStatus, setSectionStatus] = useState({
    informationTypes: 'not_started',
    impactAnalysis: 'not_started',
    securityObjectives: 'not_started'
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressData = await systemCategorizationApi.getProgress(parseInt(clientId, 10), systemId);
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
      const progressData = await systemCategorizationApi.getProgress(parseInt(clientId, 10), systemId);
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
        title="System Categorization" 
        description="Complete the system categorization phase by providing detailed information about information types, impact analysis, and security objectives."
        progress={progress}
        phase="system_categorization"
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
            label="Information Types" 
            sx={getTabStyle(sectionStatus.informationTypes)}
          />
          <Tab 
            label="Impact Analysis"
            sx={getTabStyle(sectionStatus.impactAnalysis)}
          />
          <Tab 
            label="Security Objectives"
            sx={getTabStyle(sectionStatus.securityObjectives)}
          />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <InformationTypesForm 
          clientId={parseInt(clientId, 10)}
          systemId={systemId}
          onSubmitSuccess={handleFormSubmitSuccess}
          onSubmitError={handleFormSubmitError}
        />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <ImpactAnalysisForm 
          clientId={parseInt(clientId, 10)}
          systemId={systemId}
          onSubmitSuccess={handleFormSubmitSuccess}
          onSubmitError={handleFormSubmitError}
        />
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <SecurityObjectivesForm 
          clientId={parseInt(clientId, 10)}
          systemId={systemId}
          onSubmitSuccess={handleFormSubmitSuccess}
          onSubmitError={handleFormSubmitError}
        />
      </TabPanel>
    </Box>
  );
}

export default System_CategorizationPage;