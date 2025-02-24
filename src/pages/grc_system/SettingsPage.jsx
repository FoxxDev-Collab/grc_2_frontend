import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { settingsApi } from '../../services';

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [s3Config, setS3Config] = useState({
    region: '',
    accessKeyId: '',
    secretAccessKey: '',
    defaultBucket: ''
  });
  const [buckets, setBuckets] = useState([]);
  const [openNewBucketDialog, setOpenNewBucketDialog] = useState(false);
  const [newBucketName, setNewBucketName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsApi.getSettings();
      setSettings(data);
      if (data.s3.enabled) {
        setS3Config({
          region: data.s3.region,
          accessKeyId: data.s3.accessKeyId,
          secretAccessKey: data.s3.secretAccessKey,
          defaultBucket: data.s3.defaultBucket
        });
        loadBuckets();
      }
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBuckets = async () => {
    try {
      const bucketList = await settingsApi.listS3Buckets();
      setBuckets(bucketList);
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handleS3ConfigSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await settingsApi.updateS3Config(s3Config);
      showSnackbar('S3 configuration updated successfully', 'success');
      loadSettings();
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await settingsApi.testS3Connection();
      showSnackbar(result.message, 'success');
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBucket = async () => {
    if (!newBucketName) return;
    
    setIsLoading(true);
    try {
      await settingsApi.createS3Bucket(newBucketName);
      showSnackbar('Bucket created successfully', 'success');
      setOpenNewBucketDialog(false);
      setNewBucketName('');
      loadBuckets();
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefaultBucket = async (bucketName) => {
    setIsLoading(true);
    try {
      await settingsApi.setDefaultBucket(bucketName);
      showSnackbar('Default bucket updated successfully', 'success');
      loadSettings();
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        System Settings
      </Typography>

      <Grid container spacing={3}>
        {/* S3 Configuration */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Amazon S3 Configuration" 
              subheader="Configure S3 storage for document management"
              action={
                settings?.s3.enabled && (
                  <Button
                    startIcon={<RefreshIcon />}
                    onClick={handleTestConnection}
                    disabled={isLoading}
                  >
                    Test Connection
                  </Button>
                )
              }
            />
            <CardContent>
              <form onSubmit={handleS3ConfigSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="AWS Region"
                      value={s3Config.region}
                      onChange={(e) => setS3Config(prev => ({ ...prev, region: e.target.value }))}
                      required
                      disabled={isLoading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Access Key ID"
                      value={s3Config.accessKeyId}
                      onChange={(e) => setS3Config(prev => ({ ...prev, accessKeyId: e.target.value }))}
                      required
                      disabled={isLoading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Secret Access Key"
                      type="password"
                      value={s3Config.secretAccessKey}
                      onChange={(e) => setS3Config(prev => ({ ...prev, secretAccessKey: e.target.value }))}
                      required
                      disabled={isLoading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isLoading}
                    >
                      Save Configuration
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* S3 Buckets */}
        {settings?.s3.enabled && (
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="S3 Buckets"
                subheader="Manage your S3 buckets"
                action={
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => setOpenNewBucketDialog(true)}
                    disabled={isLoading}
                  >
                    New Bucket
                  </Button>
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  {buckets.map((bucket) => (
                    <Grid item xs={12} sm={6} md={4} key={bucket.name}>
                      <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6">{bucket.name}</Typography>
                          {bucket.name === settings.s3.defaultBucket ? (
                            <CheckIcon color="success" />
                          ) : (
                            <Button
                              size="small"
                              onClick={() => handleSetDefaultBucket(bucket.name)}
                              disabled={isLoading}
                            >
                              Set as Default
                            </Button>
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Region: {bucket.region}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Created: {new Date(bucket.createdAt).toLocaleDateString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* New Bucket Dialog */}
      <Dialog open={openNewBucketDialog} onClose={() => setOpenNewBucketDialog(false)}>
        <DialogTitle>Create New S3 Bucket</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Bucket Name"
            value={newBucketName}
            onChange={(e) => setNewBucketName(e.target.value)}
            sx={{ mt: 2 }}
            helperText="Bucket names must be between 3 and 63 characters long and can contain lowercase letters, numbers, and hyphens"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewBucketDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateBucket} variant="contained" disabled={!newBucketName || isLoading}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;