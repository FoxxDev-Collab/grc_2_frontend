/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  Typography,
  Container,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import ArtifactUploadForm from '../../components/ArtifactUploadForm';
import { artifactsApi } from '../../services';

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ArtifactsPage = () => {
  const { systemId } = useParams();
  const [artifacts, setArtifacts] = useState([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtifacts = async () => {
    try {
      setIsLoading(true);
      const data = await artifactsApi.getAllArtifacts();
      setArtifacts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch artifacts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtifacts();
  }, []);

  const handleUploadSubmit = async (artifactData) => {
    try {
      await artifactsApi.createArtifact(artifactData);
      setIsUploadDialogOpen(false);
      fetchArtifacts();
    } catch (err) {
      setError('Failed to upload artifact');
      console.error(err);
    }
  };

  const handleDelete = async (artifactId) => {
    if (window.confirm('Are you sure you want to delete this artifact?')) {
      try {
        await artifactsApi.deleteArtifact(artifactId);
        fetchArtifacts();
      } catch (err) {
        setError('Failed to delete artifact');
        console.error(err);
      }
    }
  };

  const handleDownload = (artifactUrl) => {
    window.open(artifactUrl, '_blank');
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" component="div">System Artifacts</Typography>
          <Typography variant="body2" color="text.secondary" component="div" sx={{ mt: 1 }}>
            Manage your system&apos;s documentation and evidence
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsUploadDialogOpen(true)}
        >
          Upload Artifact
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Uploaded By</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {artifacts.map((artifact) => (
                <TableRow key={artifact.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {artifact.name}
                      {artifact.description && (
                        <Tooltip title={artifact.description}>
                          <InfoIcon fontSize="small" color="action" />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{artifact.type}</TableCell>
                  <TableCell>{formatFileSize(artifact.size)}</TableCell>
                  <TableCell>{artifact.uploadedBy}</TableCell>
                  <TableCell>
                    {new Date(artifact.uploadDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleDownload(artifact.fileUrl)}
                      title="Download"
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(artifact.id)}
                      title="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {artifacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">
                      No artifacts found. Upload your first artifact using the button above.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <ArtifactUploadForm
          onSubmit={handleUploadSubmit}
          onCancel={() => setIsUploadDialogOpen(false)}
        />
      </Dialog>
    </Container>
  );
};

export default ArtifactsPage;