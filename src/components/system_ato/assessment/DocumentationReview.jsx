/* eslint-disable no-unused-vars */
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Description as DocumentIcon,
  CheckCircle as ValidIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const DocumentationReview = ({ documents, onUpdateDocument, onDownload }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    validationNotes: '',
    reviewDate: new Date().toISOString().split('T')[0],
  });

  const getExpirationStatus = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const daysUntilExpiration = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiration < 0) {
      return { status: 'expired', color: 'error', icon: <ErrorIcon color="error" /> };
    } else if (daysUntilExpiration <= 30) {
      return { status: 'expiring-soon', color: 'warning', icon: <WarningIcon color="warning" /> };
    }
    return { status: 'valid', color: 'success', icon: <ValidIcon color="success" /> };
  };

  const handleReviewDocument = (doc) => {
    setSelectedDoc(doc);
    setReviewForm({
      validationNotes: '',
      reviewDate: new Date().toISOString().split('T')[0],
    });
    setDialogOpen(true);
  };

  const handleSaveReview = () => {
    onUpdateDocument({
      ...selectedDoc,
      lastReviewed: reviewForm.reviewDate,
      validationNotes: reviewForm.validationNotes,
      reviewHistory: [
        {
          date: reviewForm.reviewDate,
          notes: reviewForm.validationNotes,
        },
        ...(selectedDoc.reviewHistory || []),
      ],
    });
    setDialogOpen(false);
  };

  const groupDocumentsByStatus = () => {
    return documents.reduce(
      (acc, doc) => {
        const status = getExpirationStatus(doc.expirationDate).status;
        acc[status].push(doc);
        return acc;
      },
      { expired: [], 'expiring-soon': [], valid: [] }
    );
  };

  const groupedDocs = groupDocumentsByStatus();

  return (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, bgcolor: 'error.light' }}>
              <Typography variant="h6" color="error.contrastText">
                Expired
              </Typography>
              <Typography variant="h4" color="error.contrastText">
                {groupedDocs.expired.length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, bgcolor: 'warning.light' }}>
              <Typography variant="h6" color="warning.contrastText">
                Expiring Soon
              </Typography>
              <Typography variant="h4" color="warning.contrastText">
                {groupedDocs['expiring-soon'].length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, bgcolor: 'success.light' }}>
              <Typography variant="h6" color="success.contrastText">
                Valid
              </Typography>
              <Typography variant="h4" color="success.contrastText">
                {groupedDocs.valid.length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      {/* Documents List */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Documentation Review Status
            </Typography>
            <List>
              {documents.map((doc) => {
                const expirationStatus = getExpirationStatus(doc.expirationDate);
                return (
                  <ListItem
                    key={doc.id}
                    sx={{
                      mb: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <ListItemIcon>{expirationStatus.icon}</ListItemIcon>
                    <ListItemText
                      primary={doc.name}
                      secondary={
                        <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="body2" component="span">
                            Expires: {new Date(doc.expirationDate).toLocaleDateString()}
                          </Typography>
                          {doc.lastReviewed && (
                            <Typography variant="body2" component="span">
                              Last Reviewed: {new Date(doc.lastReviewed).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Review History">
                        <IconButton
                          edge="end"
                          onClick={() => console.log('Show history')}
                          sx={{ mr: 1 }}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Document">
                        <IconButton
                          edge="end"
                          onClick={() => onDownload(doc)}
                          sx={{ mr: 1 }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Review Document">
                        <IconButton
                          edge="end"
                          onClick={() => handleReviewDocument(doc)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Review Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Review Document - {selectedDoc?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              type="date"
              label="Review Date"
              value={reviewForm.reviewDate}
              onChange={(e) => setReviewForm({ ...reviewForm, reviewDate: e.target.value })}
              fullWidth
            />
            <TextField
              label="Validation Notes"
              multiline
              rows={4}
              value={reviewForm.validationNotes}
              onChange={(e) => setReviewForm({ ...reviewForm, validationNotes: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveReview} variant="contained" color="primary">
            Save Review
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

DocumentationReview.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      expirationDate: PropTypes.string.isRequired,
      lastReviewed: PropTypes.string,
      validationNotes: PropTypes.string,
      reviewHistory: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          notes: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  onUpdateDocument: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default DocumentationReview;