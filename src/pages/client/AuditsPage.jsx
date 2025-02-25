/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  Alert,
  CircularProgress,
  DialogContentText,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  BugReport as BugReportIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  ArrowUpward as ArrowUpwardIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { auditApi } from '../../services';

const AuditsPage = () => {
  const { clientId } = useParams();
  const [findings, setFindings] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sourceType: '',
    severity: '',
    status: '',
    tags: [],
    includePromoted: false
  });
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [findingDialogOpen, setFindingDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [naDialogOpen, setNaDialogOpen] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [sourceTypes, setSourceTypes] = useState([]);
  const [severityLevels, setSeverityLevels] = useState([]);
  const [findingStatuses, setFindingStatuses] = useState([]);
  const [commonTags, setCommonTags] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        findingsData,
        metricsData,
        sourceTypesData,
        severityLevelsData,
        findingStatusesData,
        commonTagsData
      ] = await Promise.all([
        auditApi.getFindings(clientId, filters),
        auditApi.getFindingMetrics(clientId),
        auditApi.getSourceTypes(),
        auditApi.getSeverityLevels(),
        auditApi.getFindingStatuses(),
        auditApi.getCommonTags()
      ]);

      // Filter out promoted findings if not included in filters
      const filteredFindings = filters.includePromoted 
        ? findingsData 
        : findingsData.filter(finding => !finding.promotedToRisk);

      setFindings(filteredFindings);
      setMetrics(metricsData);
      setSourceTypes(sourceTypesData);
      setSeverityLevels(severityLevelsData);
      setFindingStatuses([...findingStatusesData, 'not_applicable']);
      setCommonTags(commonTagsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [clientId, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handlePromoteToRisk = async (finding) => {
    try {
      setLoading(true);
      await auditApi.promoteToRisk(finding.id, {
        clientId: Number(clientId),
        name: finding.title,
        description: finding.description,
        impact: finding.severity === 'critical' || finding.severity === 'high' ? 'high' : 'medium',
        likelihood: 'medium',
        category: finding.category || 'General'
      });
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFinding = async () => {
    if (!selectedFinding) return;
    
    try {
      setLoading(true);
      await auditApi.deleteFinding(selectedFinding.id, Number(clientId));
      setDeleteDialogOpen(false);
      setSelectedFinding(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkNotApplicable = async () => {
    if (!selectedFinding) return;
    
    try {
      setLoading(true);
      await auditApi.updateFindingStatus(selectedFinding.id, Number(clientId), 'not_applicable');
      setNaDialogOpen(false);
      setSelectedFinding(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'error';
      case 'in_progress':
        return 'warning';
      case 'closed':
        return 'success';
      case 'promoted_to_risk':
        return 'info';
      case 'not_applicable':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading && !findings.length) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Findings Repository
          </Typography>
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={() => setFilterDialogOpen(true)}
          >
            Filter Findings
          </Button>
        </Box>

        {/* Metrics Summary */}
        {metrics && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {metrics.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Findings
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body1">
                  Critical/High: {metrics.bySeverity.critical + metrics.bySeverity.high}
                </Typography>
                <Typography variant="body1">
                  Medium/Low: {metrics.bySeverity.medium + metrics.bySeverity.low}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  By Severity
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body1">
                  Open: {metrics.byStatus.open}
                </Typography>
                <Typography variant="body1">
                  In Progress: {metrics.byStatus.in_progress}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  By Status
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {metrics.promotedToRisk}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Promoted to Risks
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Findings List */}
        {findings.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No findings match the current filters.
          </Alert>
        ) : (
          <List>
            {findings.map((finding) => (
              <ListItem
                key={finding.id}
                sx={{
                  mb: 2,
                  border: 1,
                  borderColor: finding.promotedToRisk ? 'info.main' : 'divider',
                  borderRadius: 1,
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  backgroundColor: finding.status === 'not_applicable' ? '#f5f5f5' : 'inherit',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getSourceTypeIcon(finding.sourceType)}
                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography variant="h6">
                      {finding.title}
                      {finding.promotedToRisk && (
                        <Chip
                          label="Promoted to Risk"
                          color="info"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                      {finding.status === 'not_applicable' && (
                        <Chip
                          label="Not Applicable"
                          color="default"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {finding.sourceDetails} | Created: {new Date(finding.createdDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={finding.severity}
                      color={getSeverityColor(finding.severity)}
                      size="small"
                    />
                    <Chip
                      label={getStatusLabel(finding.status)}
                      color={getStatusColor(finding.status)}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>

                <Typography variant="body1" paragraph>
                  {finding.description}
                </Typography>

                {/* Only show category if it exists */}
                {finding.category && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Category:</strong> {finding.category}
                      {finding.nistControl && ` | NIST Control: ${finding.nistControl}`}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedFinding(finding);
                        setFindingDialogOpen(true);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Edit Finding">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedFinding(finding);
                        setFindingDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  
                  {!finding.promotedToRisk && finding.status !== 'not_applicable' && (
                    <Tooltip title="Promote to Risk">
                      <IconButton
                        size="small"
                        onClick={() => handlePromoteToRisk(finding)}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {!finding.promotedToRisk && finding.status !== 'not_applicable' && (
                    <Tooltip title="Mark as Not Applicable">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedFinding(finding);
                          setNaDialogOpen(true);
                        }}
                      >
                        <BlockIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  <Tooltip title="Delete Finding">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedFinding(finding);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItem>
            ))}
          </List>
        )}

        {/* Filter Dialog */}
        <Dialog
          open={filterDialogOpen}
          onClose={() => setFilterDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Filter Findings</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Source Type</InputLabel>
                  <Select
                    value={filters.sourceType}
                    label="Source Type"
                    onChange={(e) => handleFilterChange('sourceType', e.target.value)}
                  >
                    <MenuItem value="">All Sources</MenuItem>
                    {sourceTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={filters.severity}
                    label="Severity"
                    onChange={(e) => handleFilterChange('severity', e.target.value)}
                  >
                    <MenuItem value="">All Severities</MenuItem>
                    {severityLevels.map((severity) => (
                      <MenuItem key={severity} value={severity}>
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {findingStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.includePromoted}
                      onChange={(e) => handleFilterChange('includePromoted', e.target.checked)}
                    />
                  }
                  label="Include findings promoted to risks"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setFilters({
                  sourceType: '',
                  severity: '',
                  status: '',
                  tags: [],
                  includePromoted: false
                });
                setFilterDialogOpen(false);
              }}
            >
              Reset Filters
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setFilterDialogOpen(false);
              }}
            >
              Apply Filters
            </Button>
          </DialogActions>
        </Dialog>

        {/* Finding Detail Dialog */}
        <Dialog
          open={findingDialogOpen}
          onClose={() => {
            setFindingDialogOpen(false);
            setSelectedFinding(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Finding Details</DialogTitle>
          <DialogContent>
            {selectedFinding && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {selectedFinding.title}
                    </Typography>
                    <Chip
                      label={selectedFinding.severity}
                      color={getSeverityColor(selectedFinding.severity)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={getStatusLabel(selectedFinding.status)}
                      color={getStatusColor(selectedFinding.status)}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body1" paragraph>
                    {selectedFinding.description}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Source:</strong> {selectedFinding.sourceType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Created:</strong> {new Date(selectedFinding.createdDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                
                {selectedFinding.category && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Category:</strong> {selectedFinding.category}
                    </Typography>
                  </Grid>
                )}
                
                {selectedFinding.nistControl && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>NIST Control:</strong> {selectedFinding.nistControl}
                    </Typography>
                  </Grid>
                )}
                
                {selectedFinding.recommendation && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Recommendation
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedFinding.recommendation}
                    </Typography>
                  </Grid>
                )}
                
                {selectedFinding.promotedToRisk && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      This finding has been promoted to a risk with ID: {selectedFinding.riskId}
                    </Alert>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setFindingDialogOpen(false);
                setSelectedFinding(null);
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Finding</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this finding? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteFinding} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Not Applicable Dialog */}
        <Dialog
          open={naDialogOpen}
          onClose={() => setNaDialogOpen(false)}
        >
          <DialogTitle>Mark as Not Applicable</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to mark this finding as Not Applicable? 
              This indicates that the finding is not relevant to your environment.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNaDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleMarkNotApplicable} color="primary" variant="contained">
              Mark as Not Applicable
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AuditsPage;