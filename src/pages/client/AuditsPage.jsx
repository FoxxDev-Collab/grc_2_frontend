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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  Alert,
  CircularProgress,
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
    tags: []
  });
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [findingDialogOpen, setFindingDialogOpen] = useState(false);
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

      setFindings(findingsData);
      setMetrics(metricsData);
      setSourceTypes(sourceTypesData);
      setSeverityLevels(severityLevelsData);
      setFindingStatuses(findingStatusesData);
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
                  Critical: {metrics.bySeverity.critical}
                </Typography>
                <Typography variant="body1">
                  High: {metrics.bySeverity.high}
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
        <List>
          {findings.map((finding) => (
            <ListItem
              key={finding.id}
              sx={{
                mb: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                flexDirection: 'column',
                alignItems: 'stretch',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {getSourceTypeIcon(finding.sourceType)}
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Typography variant="h6">
                    {finding.title}
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
                    label={finding.status}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>

              <Typography variant="body1" paragraph>
                {finding.description}
              </Typography>

              {/* Only show tags section if there are tags */}
              {finding.category && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  <Chip
                    key={finding.category}
                    label={finding.category}
                    size="small"
                    variant="outlined"
                  />
                  {finding.nistControl && (
                    <Chip
                      key={finding.nistControl}
                      label={finding.nistControl}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              )}

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
                {!finding.promotedToRisk && (
                  <Tooltip title="Promote to Risk">
                    <IconButton
                      size="small"
                      onClick={() => handlePromoteToRisk(finding)}
                    >
                      <ArrowUpwardIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </ListItem>
          ))}
        </List>

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
                <FormControl fullWidth>
                  <InputLabel>Tags</InputLabel>
                  <Select
                    multiple
                    value={filters.tags}
                    label="Tags"
                    onChange={(e) => handleFilterChange('tags', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {commonTags.map((tag) => (
                      <MenuItem key={tag} value={tag}>
                        {tag}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
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
                  <TextField
                    fullWidth
                    label="Title"
                    value={selectedFinding.title}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={selectedFinding.description}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Source"
                    value={selectedFinding.sourceType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Source Details"
                    value={selectedFinding.sourceDetails}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                {selectedFinding.recommendation && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Recommendation"
                      value={selectedFinding.recommendation}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                )}
                {selectedFinding.evidence?.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Evidence
                    </Typography>
                    <List>
                      {selectedFinding.evidence.map((evidence) => (
                        <ListItem key={evidence.id}>
                          <Typography variant="body2">
                            {evidence.description}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
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
      </Paper>
    </Container>
  );
};

export default AuditsPage;