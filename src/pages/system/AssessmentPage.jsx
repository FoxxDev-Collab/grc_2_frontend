/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  LinearProgress,
  Chip,
  Grid,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  BugReport as TestingIcon,
  Rule as ControlIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';

import AssessmentPlanningForm from '../../components/system_ato/assessment/AssessmentPlanningForm';
import SecurityTestingUpload from '../../components/system_ato/assessment/SecurityTestingUpload';
import ControlAssessment from '../../components/system_ato/assessment/ControlAssessment';
import DocumentationReview from '../../components/system_ato/assessment/DocumentationReview';
import { assessmentApi } from '../../services';

const TabPanel = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`phase-tabpanel-${index}`}
    aria-labelledby={`phase-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

const AssessmentPage = () => {
  const { clientId, systemId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for each component
  const [assessmentPlan, setAssessmentPlan] = useState(null);
  const [scanResults, setScanResults] = useState([]);
  const [controls, setControls] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadAssessmentData();
  }, [clientId, systemId]);

  const loadAssessmentData = async () => {
    try {
      setLoading(true);
      const [
        planData,
        scansData,
        controlsData,
        docsData
      ] = await Promise.all([
        assessmentApi.getAssessmentPlan(clientId, systemId),
        assessmentApi.getScanResults(clientId, systemId),
        assessmentApi.getControlAssessments(clientId, systemId),
        assessmentApi.getDocumentationReview(clientId, systemId)
      ]);

      setAssessmentPlan(planData);
      setScanResults(scansData);
      setControls(controlsData);
      setDocuments(docsData);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Error loading assessment data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Assessment Planning Handlers
  const handleAssessmentPlanSubmit = async (formData) => {
    try {
      const updatedPlan = await assessmentApi.updateAssessmentPlan(
        clientId,
        systemId,
        formData
      );
      setAssessmentPlan(updatedPlan);
    } catch (err) {
      setError(err.message);
    }
  };

  // Security Testing Handlers
  const handleScanUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('scanFile', file);
      const newScan = await assessmentApi.uploadScanResults(
        clientId,
        systemId,
        formData
      );
      setScanResults([newScan, ...scanResults]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleScanDelete = async (scanId) => {
    try {
      await assessmentApi.deleteScanResult(clientId, systemId, scanId);
      setScanResults(scanResults.filter(scan => scan.id !== scanId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Control Assessment Handlers
  const handleControlUpdate = async (updatedControl) => {
    try {
      const result = await assessmentApi.updateControlAssessment(
        clientId,
        systemId,
        updatedControl
      );
      setControls(controls.map(control => 
        control.id === result.id ? result : control
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  // Documentation Review Handlers
  const handleDocumentUpdate = async (updatedDoc) => {
    try {
      const result = await assessmentApi.updateDocumentReview(
        clientId,
        systemId,
        updatedDoc
      );
      setDocuments(documents.map(doc => 
        doc.id === result.id ? result : doc
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDocumentDownload = async (document) => {
    try {
      const url = await assessmentApi.getDocumentDownloadUrl(
        clientId,
        systemId,
        document.id
      );
      window.open(url, '_blank');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const calculateProgress = () => {
    if (!assessmentPlan || !scanResults || !controls || !documents) {
      return 0;
    }

    let totalScore = 0;
    let totalItems = 4; // One point for each major section

    // Assessment Planning progress
    if (assessmentPlan.status === 'completed') {
      totalScore += 1;
    } else if (assessmentPlan.status === 'in-progress') {
      totalScore += 0.5;
    }

    // Security Testing progress
    const completedScans = scanResults.filter(scan => scan.status === 'Completed').length;
    if (scanResults.length > 0) {
      totalScore += completedScans / scanResults.length;
    }

    // Control Assessment progress
    const compliantControls = controls.filter(control => control.status === 'Compliant').length;
    const notApplicableControls = controls.filter(control => control.status === 'Not-Applicable').length;
    const effectiveTotal = controls.length - notApplicableControls;
    if (effectiveTotal > 0) {
      totalScore += compliantControls / effectiveTotal;
    }

    // Documentation Review progress
    const reviewedDocs = documents.filter(doc => doc.lastReviewed).length;
    if (documents.length > 0) {
      totalScore += reviewedDocs / documents.length;
    }

    return Math.round((totalScore / totalItems) * 100);
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
        <Typography color="error">{error}</Typography>
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
              Assessment
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Security testing, control assessment, and documentation review.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'right' }}>
              <Chip
                label={`${calculateProgress()}% Complete`}
                color={calculateProgress() === 100 ? 'success' : 'warning'}
                sx={{ mb: 1 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Assessment Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="assessment tabs"
        >
          <Tab icon={<AssessmentIcon />} label="Assessment Planning" />
          <Tab icon={<TestingIcon />} label="Security Testing" />
          <Tab icon={<ControlIcon />} label="Control Assessment" />
          <Tab icon={<DocumentIcon />} label="Documentation Review" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <AssessmentPlanningForm
            onSubmit={handleAssessmentPlanSubmit}
            initialData={assessmentPlan}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <SecurityTestingUpload
            onUpload={handleScanUpload}
            onDelete={handleScanDelete}
            scanResults={scanResults}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <ControlAssessment
            controls={controls}
            onUpdateControl={handleControlUpdate}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <DocumentationReview
            documents={documents}
            onUpdateDocument={handleDocumentUpdate}
            onDownload={handleDocumentDownload}
          />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AssessmentPage;