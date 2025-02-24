import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  LinearProgress,
  Alert,
  AlertTitle,
  Chip,
} from '@mui/material';
import {
  Assessment as RiskIcon,
  Description as PackageIcon,
  Gavel as DecisionIcon,
} from '@mui/icons-material';
import { TabPanel } from '../../components/system_ato';
import {
  RiskAssessmentForm,
  PackagePreparationForm,
  AuthorizationDecisionForm,
} from '../../components/system_ato/authorization';
import authorizationApi from '../../services';

const ATO_AuthorizationPage = () => {
  const { clientId, systemId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authData, setAuthData] = useState({
    riskAssessment: {
      risks: [],
      nonCompliantControls: [],
    },
    package: {
      completed: [],
      pending: [],
      executiveSummary: '',
      status: '',
      validationStatus: '',
      completionPercentage: 0,
    },
    decision: {
      result: '',
      official: '',
      date: '',
      expirationDate: '',
      justification: '',
      conditions: [],
      boundary: '',
    },
  });

  useEffect(() => {
    const loadAuthorizationData = async () => {
      try {
        setLoading(true);
        const data = await authorizationApi.getAuthorizationData(clientId, systemId);
        setAuthData(data);
        setError('');
      } catch (err) {
        setError(err.message);
        console.error('Error loading authorization data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (clientId && systemId) {
      loadAuthorizationData();
    }
  }, [clientId, systemId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Risk Assessment Handlers
  const handlePromoteToPOAM = async (poamItem) => {
    try {
      const updatedData = await authorizationApi.createPOAMItem(clientId, systemId, poamItem);
      setAuthData(updatedData);
    } catch (err) {
      setError('Failed to create POA&M item: ' + err.message);
    }
  };

  // Package Preparation Handlers
  const handleUploadDocument = async (docId) => {
    try {
      // Implementation would depend on your file upload mechanism
      console.log('Uploading document:', docId);
    } catch (err) {
      setError('Failed to upload document: ' + err.message);
    }
  };

  const handleDownloadDocument = async (docId) => {
    try {
      // Implementation would depend on your file download mechanism
      console.log('Downloading document:', docId);
    } catch (err) {
      setError('Failed to download document: ' + err.message);
    }
  };

  const handleUpdateExecutiveSummary = async (summary) => {
    try {
      const updatedData = await authorizationApi.updateAuthorizationPackage(clientId, systemId, {
        executiveSummary: summary,
      });
      setAuthData(updatedData);
    } catch (err) {
      setError('Failed to update executive summary: ' + err.message);
    }
  };

  const handleValidatePackage = async () => {
    try {
      const updatedData = await authorizationApi.validateAuthorizationPackage(clientId, systemId);
      setAuthData(updatedData);
    } catch (err) {
      setError('Failed to validate package: ' + err.message);
    }
  };

  // Authorization Decision Handlers
  const handleUpdateDecision = async (decision) => {
    try {
      const updatedData = await authorizationApi.updateAuthorizationDecision(clientId, systemId, decision);
      setAuthData(updatedData);
    } catch (err) {
      setError('Failed to update decision: ' + err.message);
    }
  };

  const handleAddCondition = async (condition) => {
    try {
      const updatedConditions = [...(authData.decision.conditions || []), condition];
      const updatedData = await authorizationApi.updateAuthorizationDecision(clientId, systemId, {
        ...authData.decision,
        conditions: updatedConditions,
      });
      setAuthData(updatedData);
    } catch (err) {
      setError('Failed to add condition: ' + err.message);
    }
  };

  const handleRemoveCondition = async (index) => {
    try {
      const updatedConditions = authData.decision.conditions.filter((_, i) => i !== index);
      const updatedData = await authorizationApi.updateAuthorizationDecision(clientId, systemId, {
        ...authData.decision,
        conditions: updatedConditions,
      });
      setAuthData(updatedData);
    } catch (err) {
      setError('Failed to remove condition: ' + err.message);
    }
  };

  const handleUpdateBoundary = async (boundary) => {
    try {
      const updatedData = await authorizationApi.updateAuthorizationDecision(clientId, systemId, {
        ...authData.decision,
        boundary,
      });
      setAuthData(updatedData);
    } catch (err) {
      setError('Failed to update boundary: ' + err.message);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Phase Header */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              ATO Authorization
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Risk assessment, package preparation, and authorization decision.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'right' }}>
              <Chip
                label={`${authData.package?.completionPercentage || 0}% Complete`}
                color={
                  authData.package?.completionPercentage >= 100
                    ? 'success'
                    : authData.package?.completionPercentage > 0
                    ? 'warning'
                    : 'default'
                }
                sx={{ mb: 1 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Authorization Status Alert */}
      {authData.decision?.result && (
        <Alert 
          severity={authData.decision.result === 'approved' ? 'success' : 'warning'}
          sx={{ mb: 4 }}
        >
          <AlertTitle>Authorization Status</AlertTitle>
          {authData.decision.result === 'approved' ? (
            <>
              System has been granted ATO on {authData.decision.date}
              {authData.decision.expirationDate && (
                <Typography variant="body2">
                  Expires on: {authData.decision.expirationDate}
                </Typography>
              )}
            </>
          ) : (
            'Authorization is pending or conditional'
          )}
        </Alert>
      )}

      {/* Authorization Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="authorization tabs"
        >
          <Tab icon={<RiskIcon />} label="Risk Assessment" />
          <Tab icon={<PackageIcon />} label="Package Preparation" />
          <Tab icon={<DecisionIcon />} label="Authorization Decision" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <RiskAssessmentForm
            assessmentResults={authData.riskAssessment.nonCompliantControls}
            onPromoteToPOAM={handlePromoteToPOAM}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <PackagePreparationForm
            packageData={authData.package}
            onUploadDocument={handleUploadDocument}
            onDownloadDocument={handleDownloadDocument}
            onUpdateExecutiveSummary={handleUpdateExecutiveSummary}
            onValidatePackage={handleValidatePackage}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <AuthorizationDecisionForm
            authorizationData={authData.decision}
            onUpdateDecision={handleUpdateDecision}
            onAddCondition={handleAddCondition}
            onRemoveCondition={handleRemoveCondition}
            onUpdateBoundary={handleUpdateBoundary}
          />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ATO_AuthorizationPage;