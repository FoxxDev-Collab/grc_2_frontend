/* eslint-disable react/prop-types */
import 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const CompanyDocuments = ({ documents, onUpload, onDownload }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          Company Documents
        </Typography>
        <Button
          component="label"
          startIcon={<UploadIcon />}
          size="small"
        >
          Upload
          <input
            type="file"
            hidden
            onChange={onUpload}
          />
        </Button>
      </Box>
      <Grid container spacing={2}>
        {documents.map((doc) => (
          <Grid item xs={12} key={doc.id}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DescriptionIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    {doc.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Last updated: {doc.lastUpdated}
                </Typography>
                <Chip
                  size="small"
                  label={doc.type}
                  sx={{ mt: 1 }}
                />
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={() => onDownload(doc.id)}
                >
                  Download
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default CompanyDocuments;