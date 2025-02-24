/* eslint-disable no-unused-vars */
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CompleteIcon,
  RadioButtonUnchecked as IncompleteIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';

const PackagePreparationForm = ({
  packageData,
  onUploadDocument,
  onDownloadDocument,
  onUpdateExecutiveSummary,
  onValidatePackage,
}) => {
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState(
    packageData?.executiveSummary || ''
  );

  const handleSummarySave = () => {
    onUpdateExecutiveSummary(executiveSummary);
    setSummaryDialogOpen(false);
  };

  const calculateCompleteness = () => {
    if (!packageData) return 0;
    const totalDocs = packageData.completed.length + packageData.pending.length;
    return Math.round((packageData.completed.length / totalDocs) * 100);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Package Preparation
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Required Documentation
            </Typography>
            <List>
              {packageData?.completed.map((doc) => (
                <ListItem key={`completed-${doc.id}`}>
                  <ListItemIcon>
                    <CompleteIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={doc.name}
                    secondary={`Last Updated: ${new Date(
                      doc.lastUpdated
                    ).toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => onDownloadDocument(doc.id)}
                      title="Download Document"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {packageData?.pending.map((doc) => (
                <ListItem key={`pending-${doc.id}`}>
                  <ListItemIcon>
                    <IncompleteIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={doc.name}
                    secondary="Status: Pending Upload"
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => onUploadDocument(doc.id)}
                      title="Upload Document"
                    >
                      <UploadIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Executive Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" paragraph>
                {packageData?.executiveSummary
                  ? packageData.executiveSummary.substring(0, 200) + '...'
                  : 'No executive summary has been prepared yet.'}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setSummaryDialogOpen(true)}
              >
                {packageData?.executiveSummary ? 'Edit Summary' : 'Add Summary'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Package Status
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Completion Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateCompleteness()}
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" align="right">
                {calculateCompleteness()}% Complete
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={onValidatePackage}
                disabled={calculateCompleteness() < 100}
              >
                Validate Package
              </Button>
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                sx={{ mt: 1 }}
              >
                {calculateCompleteness() < 100
                  ? 'Complete all required documents to validate'
                  : 'Ready for validation'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Executive Summary Dialog */}
      <Dialog
        open={summaryDialogOpen}
        onClose={() => setSummaryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Executive Summary</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={8}
            value={executiveSummary}
            onChange={(e) => setExecutiveSummary(e.target.value)}
            placeholder="Provide an executive summary of the system's security posture, key findings, and recommendations..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSummaryDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSummarySave} variant="contained">
            Save Summary
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

PackagePreparationForm.propTypes = {
  packageData: PropTypes.shape({
    completed: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        lastUpdated: PropTypes.string.isRequired,
      })
    ).isRequired,
    pending: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    executiveSummary: PropTypes.string,
    status: PropTypes.string,
    validationStatus: PropTypes.string,
  }),
  onUploadDocument: PropTypes.func.isRequired,
  onDownloadDocument: PropTypes.func.isRequired,
  onUpdateExecutiveSummary: PropTypes.func.isRequired,
  onValidatePackage: PropTypes.func.isRequired,
};

export default PackagePreparationForm;