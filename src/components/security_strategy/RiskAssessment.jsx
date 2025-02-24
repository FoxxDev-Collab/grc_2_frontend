//lets ensure this uses the API to gather the JSON data from the rest of the client information.
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Divider,
  IconButton,
  Tooltip,
  DialogContentText,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  BugReport as BugReportIcon,
  Security as SecurityIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

const RISK_LEVELS = ['low', 'medium', 'high'];

const RISK_LEVEL_DESCRIPTIONS = {
  likelihood: {
    low: 'Rare - May occur in exceptional circumstances',
    medium: 'Possible - Might occur at some time',
    high: 'Almost Certain - Expected to occur'
  },
  impact: {
    low: 'Minor impact on operations',
    medium: 'Moderate impact on operations',
    high: 'Severe impact on operations'
  }
};

const RISK_STATUSES = [
  { value: 'active', label: 'Active', color: 'error' },
  { value: 'mitigated', label: 'Mitigated', color: 'success' },
  { value: 'accepted', label: 'Accepted', color: 'warning' },
  { value: 'transferred', label: 'Transferred', color: 'info' }
];

const RISK_CATEGORIES = [
  'Access Control',
  'Data Protection',
  'Vulnerability Management',
  'Third Party Risk',
  'Business Continuity',
  'Compliance',
  'Infrastructure',
  'Application Security',
  'Human Risk',
  'Physical Security'
];

const RiskAssessment = ({
  risks,
  onAddRisk,
  onUpdateRisk,
  onDeleteRisk,
  onViewFinding,
}) => {
  const [expandedRisk, setExpandedRisk] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) {
      errors.name = 'Risk name is required';
    }
    if (!formData.description?.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.impact) {
      errors.impact = 'Impact level is required';
    }
    if (!formData.likelihood) {
      errors.likelihood = 'Likelihood is required';
    }
    if (!formData.status) {
      errors.status = 'Status is required';
    }
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    return errors;
  };

  const handleOpenDialog = (risk = null) => {
    setFormData(risk || {
      name: '',
      description: '',
      impact: '',
      likelihood: '',
      status: 'active',
      category: '',
      businessImpact: {
        financial: '',
        operational: '',
        reputational: '',
        compliance: ''
      },
      treatment: {
        approach: 'mitigate',
        plan: '',
        dueDate: null,
        status: 'not_started'
      }
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
    setFormErrors({});
  };

  const handleOpenDeleteDialog = (risk) => {
    setFormData(risk);
    setDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
    setFormData({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleBusinessImpactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      businessImpact: {
        ...prev.businessImpact,
        [field]: value
      }
    }));
  };

  const handleTreatmentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      treatment: {
        ...prev.treatment,
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (formData.id) {
        await onUpdateRisk(formData.id, formData);
      } else {
        await onAddRisk(formData);
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Error submitting risk:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await onDeleteRisk(formData.id);
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting risk:', err);
    }
  };

  const getRiskColor = (status) => {
    const statusConfig = RISK_STATUSES.find(s => s.value === status);
    return statusConfig?.color || 'default';
  };

  const calculateRiskLevel = (impact, likelihood) => {
    const levels = { high: 3, medium: 2, low: 1 };
    const score = levels[likelihood] * levels[impact];
    if (score >= 6) return { level: 'Critical', color: 'error' };
    if (score >= 4) return { level: 'High', color: 'error' };
    if (score >= 2) return { level: 'Medium', color: 'warning' };
    return { level: 'Low', color: 'success' };
  };

  const getSourceTypeIcon = (sourceType) => {
    switch (sourceType) {
      case 'security_assessment':
        return <AssignmentIcon />;
      case 'vulnerability_scan':
        return <BugReportIcon />;
      case 'external_audit':
        return <SecurityIcon />;
      default:
        return <WarningIcon />;
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          Risk Assessment
        </Typography>
        <Button
          startIcon={<AddIcon />}
          size="small"
          variant="contained"
          onClick={() => handleOpenDialog()}
        >
          Add Risk
        </Button>
      </Box>

      {risks.map((risk) => (
        <Accordion
          key={risk.id}
          expanded={expandedRisk === risk.id}
          onChange={() => setExpandedRisk(expandedRisk === risk.id ? '' : risk.id)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <WarningIcon sx={{ mr: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">{risk.name}</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Chip
                    size="small"
                    label={`Impact: ${risk.impact}`}
                    color={risk.impact === 'high' ? 'error' : risk.impact === 'medium' ? 'warning' : 'success'}
                  />
                  <Chip
                    size="small"
                    label={`Likelihood: ${risk.likelihood}`}
                    color={risk.likelihood === 'high' ? 'error' : risk.likelihood === 'medium' ? 'warning' : 'success'}
                  />
                  <Chip
                    size="small"
                    label={calculateRiskLevel(risk.impact, risk.likelihood).level}
                    color={calculateRiskLevel(risk.impact, risk.likelihood).color}
                  />
                  {risk.category && (
                    <Chip
                      size="small"
                      label={risk.category}
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
              <Chip
                size="small"
                label={RISK_STATUSES.find(s => s.value === risk.status)?.label || risk.status}
                color={getRiskColor(risk.status)}
                sx={{ mr: 1 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  {risk.description}
                </Typography>
              </Grid>

              {/* Source Findings Section */}
              {risk.sourceFindings?.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Source Findings:
                  </Typography>
                  <List>
                    {risk.sourceFindings.map((finding) => (
                      <ListItem
                        key={finding.findingId}
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <ListItemIcon>
                          {getSourceTypeIcon(finding.sourceType)}
                        </ListItemIcon>
                        <ListItemText
                          primary={finding.title}
                          secondary={`Source: ${finding.sourceType} | Date: ${new Date(finding.date).toLocaleDateString()}`}
                        />
                        <IconButton
                          size="small"
                          onClick={() => onViewFinding(finding.findingId)}
                        >
                          <LinkIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}

              {/* Business Impact Section */}
              {risk.businessImpact && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Business Impact:
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(risk.businessImpact).map(([key, value]) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}

              {/* Treatment Plan Section */}
              {risk.treatment && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Treatment Plan:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Approach:</strong> {risk.treatment.approach}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Plan:</strong> {risk.treatment.plan}
                      </Typography>
                    </Grid>
                    {risk.treatment.dueDate && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Due Date:</strong> {new Date(risk.treatment.dueDate).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Status:</strong> {risk.treatment.status.replace('_', ' ')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Last assessed: {new Date(risk.lastAssessed).toLocaleDateString()}
                  </Typography>
                  <Box>
                    <Tooltip title="Edit Risk">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(risk);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Risk">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDeleteDialog(risk);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Add/Edit Risk Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {formData.id ? 'Edit Risk' : 'Add New Risk'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Risk Name"
                name="name"
                value={formData.name || ''}
                onChange={handleFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={handleFormChange}
                multiline
                rows={3}
                error={!!formErrors.description}
                helperText={formErrors.description}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.impact} required>
                <InputLabel>Impact Level</InputLabel>
                <Select
                  name="impact"
                  value={formData.impact || ''}
                  onChange={handleFormChange}
                  label="Impact Level"
                >
                  {RISK_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)} - {RISK_LEVEL_DESCRIPTIONS.impact[level]}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.impact && (
                  <FormHelperText>{formErrors.impact}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.likelihood} required>
                <InputLabel>Likelihood</InputLabel>
                <Select
                  name="likelihood"
                  value={formData.likelihood || ''}
                  onChange={handleFormChange}
                  label="Likelihood"
                >
                  {RISK_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)} - {RISK_LEVEL_DESCRIPTIONS.likelihood[level]}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.likelihood && (
                  <FormHelperText>{formErrors.likelihood}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.status} required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleFormChange}
                  label="Status"
                >
                  {RISK_STATUSES.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.status && (
                  <FormHelperText>{formErrors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.category} required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleFormChange}
                  label="Category"
                >
                  {RISK_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.category && (
                  <FormHelperText>{formErrors.category}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Business Impact
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Financial Impact"
                    value={formData.businessImpact?.financial || ''}
                    onChange={(e) => handleBusinessImpactChange('financial', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Operational Impact"
                    value={formData.businessImpact?.operational || ''}
                    onChange={(e) => handleBusinessImpactChange('operational', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Reputational Impact"
                    value={formData.businessImpact?.reputational || ''}
                    onChange={(e) => handleBusinessImpactChange('reputational', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Compliance Impact"
                    value={formData.businessImpact?.compliance || ''}
                    onChange={(e) => handleBusinessImpactChange('compliance', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Treatment Plan
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Treatment Plan"
                    value={formData.treatment?.plan || ''}
                    onChange={(e) => handleTreatmentChange('plan', e.target.value)}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Treatment Approach</InputLabel>
                    <Select
                      value={formData.treatment?.approach || 'mitigate'}
                      onChange={(e) => handleTreatmentChange('approach', e.target.value)}
                      label="Treatment Approach"
                    >
                      <MenuItem value="mitigate">Mitigate</MenuItem>
                      <MenuItem value="accept">Accept</MenuItem>
                      <MenuItem value="transfer">Transfer</MenuItem>
                      <MenuItem value="avoid">Avoid</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    value={formData.treatment?.dueDate || ''}
                    onChange={(e) => handleTreatmentChange('dueDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {formData.id ? 'Save Changes' : 'Add Risk'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Risk</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the risk &ldquo;{formData.name}&rdquo;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

RiskAssessment.propTypes = {
  risks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      impact: PropTypes.string.isRequired,
      likelihood: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      lastAssessed: PropTypes.string.isRequired,
      sourceFindings: PropTypes.arrayOf(
        PropTypes.shape({
          findingId: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          sourceType: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
        })
      ),
      businessImpact: PropTypes.shape({
        financial: PropTypes.string,
        operational: PropTypes.string,
        reputational: PropTypes.string,
        compliance: PropTypes.string,
      }),
      treatment: PropTypes.shape({
        approach: PropTypes.string,
        plan: PropTypes.string,
        dueDate: PropTypes.string,
        status: PropTypes.string,
      }),
    })
  ).isRequired,
  onAddRisk: PropTypes.func.isRequired,
  onUpdateRisk: PropTypes.func.isRequired,
  onDeleteRisk: PropTypes.func.isRequired,
  onViewFinding: PropTypes.func.isRequired,
};

export default RiskAssessment;