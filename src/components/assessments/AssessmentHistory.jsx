//this page needs to use the APIs to collect the assessment data and display it in a table
//this data will be used by the Audit page to promote findings to risk in the security strategy page
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Collapse,
  Alert,
} from '@mui/material';
import {
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Compare as CompareIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Send as SendIcon,
} from '@mui/icons-material';

const AssessmentHistory = ({ 
  assessments = [], 
  onViewAssessment,
  onCompareAssessments,
  onPromoteToAudit,
}) => {
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [expandedAssessment, setExpandedAssessment] = useState(null);

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getTypeIcon = (type) => {
    return type === 'basic' ? <AssignmentIcon /> : <TrendingUpIcon />;
  };

  const getTypeLabel = (type) => {
    return type === 'basic' ? 'Basic Assessment' : 'Advanced Assessment';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFindingStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'in_progress':
        return <ScheduleIcon color="primary" />;
      case 'open':
        return <WarningIcon color="warning" />;
      default:
        return <ErrorIcon color="error" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
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

  // Filter assessments based on selected filters
  const filteredAssessments = assessments
    .filter(a => statusFilter === 'all' || a.status === statusFilter)
    .filter(a => typeFilter === 'all' || a.type === typeFilter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'score') {
        return (b.score || 0) - (a.score || 0);
      }
      return 0;
    });

  // Calculate summary statistics
  const stats = {
    totalAssessments: assessments.length,
    averageScore: assessments.length > 0
      ? Math.round(assessments.reduce((sum, a) => sum + (a.score || 0), 0) / assessments.length)
      : 0,
    byType: {
      basic: assessments.filter(a => a.type === 'basic').length,
      advanced: assessments.filter(a => a.type === 'advanced').length,
    },
    findings: {
      total: assessments.reduce((sum, a) => sum + (a.generatedFindings?.length || 0), 0),
      bySeverity: {
        critical: assessments.reduce((sum, a) => 
          sum + (a.generatedFindings?.filter(f => f.severity === 'critical').length || 0), 0),
        high: assessments.reduce((sum, a) => 
          sum + (a.generatedFindings?.filter(f => f.severity === 'high').length || 0), 0),
        medium: assessments.reduce((sum, a) => 
          sum + (a.generatedFindings?.filter(f => f.severity === 'medium').length || 0), 0),
        low: assessments.reduce((sum, a) => 
          sum + (a.generatedFindings?.filter(f => f.severity === 'low').length || 0), 0),
      }
    }
  };

  const handleCompare = () => {
    if (selectedAssessments.length < 2) return;
    onCompareAssessments(selectedAssessments);
    setCompareDialogOpen(true);
  };

  const toggleAssessmentSelection = (assessmentId) => {
    if (selectedAssessments.includes(assessmentId)) {
      setSelectedAssessments(selectedAssessments.filter(id => id !== assessmentId));
    } else {
      setSelectedAssessments([...selectedAssessments, assessmentId]);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Assessment History
      </Typography>

      {/* Summary Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {stats.totalAssessments}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Assessments
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {stats.averageScore}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Score
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body1">
              Basic: {stats.byType.basic}
            </Typography>
            <Typography variant="body1">
              Advanced: {stats.byType.advanced}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              By Type
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body1">
              Critical: {stats.findings.bySeverity.critical}
            </Typography>
            <Typography variant="body1">
              High: {stats.findings.bySeverity.high}
            </Typography>
            <Typography variant="body1">
              Medium: {stats.findings.bySeverity.medium}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Findings by Severity
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="pending_review">Pending Review</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="score">Score</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            startIcon={<CompareIcon />}
            onClick={handleCompare}
            disabled={selectedAssessments.length < 2}
            fullWidth
          >
            Compare Selected
          </Button>
        </Grid>
      </Grid>

      {filteredAssessments.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Findings</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAssessments.map((assessment) => (
                <React.Fragment key={assessment.id}>
                  <TableRow 
                    selected={selectedAssessments.includes(assessment.id)}
                    onClick={() => toggleAssessmentSelection(assessment.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Chip
                        size="small"
                        label={selectedAssessments.indexOf(assessment.id) + 1}
                        color="primary"
                        sx={{ 
                          display: selectedAssessments.includes(assessment.id) ? 'inline-flex' : 'none'
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(assessment.date)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTypeIcon(assessment.type)}
                        <Typography variant="body2">
                          {getTypeLabel(assessment.type)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{assessment.name}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={assessment.score ? `${assessment.score}%` : 'N/A'}
                        color={assessment.score ? getScoreColor(assessment.score) : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={(assessment.status || 'unknown').replace('_', ' ')}
                        color={assessment.status === 'completed' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      {assessment.generatedFindings?.length > 0 && (
                        <Chip
                          size="small"
                          label={`${assessment.generatedFindings.length} Findings`}
                          color="primary"
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewAssessment(assessment.id);
                          }}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Toggle Findings">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedAssessment(
                              expandedAssessment === assessment.id ? null : assessment.id
                            );
                          }}
                        >
                          {expandedAssessment === assessment.id ? 
                            <ExpandLessIcon /> : 
                            <ExpandMoreIcon />
                          }
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={expandedAssessment === assessment.id}>
                        <Box sx={{ margin: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" component="div">
                              Generated Findings
                            </Typography>
                            <Button
                              variant="contained"
                              startIcon={<SendIcon />}
                              onClick={() => onPromoteToAudit(assessment.id)}
                              disabled={!assessment.generatedFindings?.length}
                            >
                              Promote All to Audit
                            </Button>
                          </Box>
                          
                          {assessment.generatedFindings?.length > 0 ? (
                            <List>
                              {assessment.generatedFindings.map((finding) => (
                                <ListItem
                                  key={finding.id}
                                  sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                                    {getFindingStatusIcon(finding.status)}
                                    <Typography variant="subtitle1" sx={{ ml: 1, flexGrow: 1 }}>
                                      {finding.title}
                                    </Typography>
                                    <Chip
                                      size="small"
                                      label={finding.severity}
                                      color={getSeverityColor(finding.severity)}
                                    />
                                  </Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {finding.description}
                                  </Typography>
                                  <Typography variant="body2" sx={{ mt: 1 }}>
                                    <strong>Recommendation:</strong> {finding.recommendation}
                                  </Typography>
                                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                    <Chip
                                      label={finding.category}
                                      size="small"
                                      variant="outlined"
                                    />
                                    {finding.status === 'open' && (
                                      <Button
                                        size="small"
                                        startIcon={<SendIcon />}
                                        onClick={() => onPromoteToAudit(assessment.id, finding.id)}
                                      >
                                        Promote to Audit
                                      </Button>
                                    )}
                                  </Box>
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Alert severity="info">
                              No findings were generated for this assessment.
                            </Alert>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No assessment history found. Complete a basic or advanced assessment to begin tracking your security posture.
          </Typography>
        </Paper>
      )}

      {/* Compare Dialog */}
      <Dialog
        open={compareDialogOpen}
        onClose={() => setCompareDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Assessment Comparison</DialogTitle>
        <DialogContent>
          {/* Comparison content would be rendered here based on the compareAssessments API response */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompareDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

AssessmentHistory.propTypes = {
  assessments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['basic', 'advanced']).isRequired,
    name: PropTypes.string.isRequired,
    score: PropTypes.number,
    status: PropTypes.string,
    generatedFindings: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      severity: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      recommendation: PropTypes.string,
      status: PropTypes.string,
    })),
  })),
  onViewAssessment: PropTypes.func.isRequired,
  onCompareAssessments: PropTypes.func.isRequired,
  onPromoteToAudit: PropTypes.func.isRequired,
};

export default AssessmentHistory;