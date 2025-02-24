/* eslint-disable no-unused-vars */
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const SecurityTestingUpload = ({ onUpload, onDelete, scanResults = [] }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/xml' || file.name.endsWith('.xml')) {
        setSelectedFile(file);
        setUploadError('');
      } else {
        setUploadError('Please select a valid STIG/SCAP XML file');
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        await onUpload(selectedFile);
        setSelectedFile(null);
        setShowUploadDialog(false);
      } catch (error) {
        setUploadError(error.message);
      }
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Security Testing Results</Typography>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setShowUploadDialog(true)}
          >
            Upload Scan
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Scan Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Findings</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scanResults.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell>{scan.type}</TableCell>
                  <TableCell>{new Date(scan.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        size="small"
                        label={`${scan.findings.high} High`}
                        color="error"
                      />
                      <Chip
                        size="small"
                        label={`${scan.findings.medium} Medium`}
                        color="warning"
                      />
                      <Chip
                        size="small"
                        label={`${scan.findings.low} Low`}
                        color="info"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={scan.status}
                      color={scan.status === 'Completed' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      title="Download Results"
                      onClick={() => window.open(scan.downloadUrl)}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      title="View Details"
                      onClick={() => window.open(scan.detailsUrl)}
                    >
                      <AssessmentIcon />
                    </IconButton>
                    <IconButton
                      title="Delete Scan"
                      onClick={() => onDelete(scan.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {scanResults.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No scan results available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={showUploadDialog} onClose={() => setShowUploadDialog(false)}>
          <DialogTitle>Upload Security Scan Results</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <input
                accept=".xml"
                style={{ display: 'none' }}
                id="scan-file-upload"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="scan-file-upload">
                <Button variant="outlined" component="span">
                  Select STIG/SCAP File
                </Button>
              </label>
              {selectedFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {selectedFile.name}
                </Typography>
              )}
              {uploadError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {uploadError}
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowUploadDialog(false)}>Cancel</Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile}
              variant="contained"
            >
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

SecurityTestingUpload.propTypes = {
  onUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  scanResults: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      findings: PropTypes.shape({
        high: PropTypes.number.isRequired,
        medium: PropTypes.number.isRequired,
        low: PropTypes.number.isRequired,
      }).isRequired,
      status: PropTypes.string.isRequired,
      downloadUrl: PropTypes.string.isRequired,
      detailsUrl: PropTypes.string.isRequired,
    })
  ),
};

export default SecurityTestingUpload;