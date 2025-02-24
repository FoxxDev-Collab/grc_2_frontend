import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  TextField,
  FormControl,
  FormLabel,
  Stack,
  Paper,
  Typography,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { artifactsApi } from '../services';

const ArtifactUploadForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [type, setType] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');
  const [artifactTypes, setArtifactTypes] = useState([]);

  useEffect(() => {
    const fetchArtifactTypes = async () => {
      try {
        const types = await artifactsApi.getArtifactTypes();
        setArtifactTypes(types);
      } catch (error) {
        console.error('Failed to fetch artifact types:', error);
      }
    };
    fetchArtifactTypes();
  }, []);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !file || !type || !uploadedBy) return;

    try {
      // First upload the file
      const fileData = await artifactsApi.uploadArtifactFile(file);

      // Then create the artifact with the file data
      onSubmit({
        name,
        description,
        type,
        uploadedBy,
        ...fileData
      });
    } catch (error) {
      console.error('Failed to upload artifact:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Upload New Artifact
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            required
            label="Artifact Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />

          <FormControl required fullWidth>
            <InputLabel>Artifact Type</InputLabel>
            <Select
              value={type}
              label="Artifact Type"
              onChange={(e) => setType(e.target.value)}
            >
              {artifactTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            required
            label="Uploaded By"
            value={uploadedBy}
            onChange={(e) => setUploadedBy(e.target.value)}
            fullWidth
          />

          <FormControl required>
            <FormLabel>Upload File</FormLabel>
            <input
              required
              accept="*/*"
              type="file"
              onChange={handleFileChange}
              style={{ marginTop: '8px' }}
            />
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={!name || !file || !type || !uploadedBy}
            >
              Upload Artifact
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

ArtifactUploadForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ArtifactUploadForm;