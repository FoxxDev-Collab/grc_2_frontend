import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { atoTrackerApi } from '../../services';
import { processSteps } from './atoProcessData';

const ATOProcessPage = () => {
  const { clientId, systemId } = useParams();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [saving, setSaving] = useState(false);
  const [phaseProgress, setPhaseProgress] = useState({});

  useEffect(() => {
    loadATOProcess();
  }, [clientId, systemId]);

  const loadATOProcess = async () => {
    try {
      setLoading(true);
      const data = await atoTrackerApi.getATOProcess(clientId, systemId);
      
      // Initialize checked tasks and progress from API data
      const checkedTasksMap = {};
      const progressMap = {};

      if (data && data.phases) {
        data.phases.forEach(phase => {
          progressMap[phase.id] = phase.progress || 0;
          phase.sections.forEach(section => {
            section.tasks.forEach((task, index) => {
              const taskKey = `${phase.id}-${section.title}-${index}`;
              checkedTasksMap[taskKey] = task.completed;
            });
          });
        });
      }

      setCheckedTasks(checkedTasksMap);
      setPhaseProgress(progressMap);
      setError(null);
    } catch (err) {
      setError('Failed to load ATO process data. Please try again.');
      console.error('Error loading ATO process:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleTaskCheck = async (phaseId, sectionTitle, taskIndex) => {
    const taskKey = `${phaseId}-${sectionTitle}-${taskIndex}`;
    const newCheckedState = !checkedTasks[taskKey];

    try {
      setSaving(true);
      await atoTrackerApi.updateTaskStatus(
        clientId,
        systemId,
        phaseId,
        sectionTitle,
        taskIndex,
        newCheckedState
      );

      setCheckedTasks(prev => ({
        ...prev,
        [taskKey]: newCheckedState
      }));

      // Update phase progress
      const progress = await atoTrackerApi.getPhaseProgress(clientId, systemId, phaseId);
      setPhaseProgress(prev => ({
        ...prev,
        [phaseId]: progress.value
      }));

    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Error updating task status:', err);
    } finally {
      setSaving(false);
    }
  };

  const calculatePhaseProgress = (phase) => {
    // Use server-provided progress if available, otherwise calculate from checked tasks
    if (phaseProgress[phase.id] !== undefined) {
      return phaseProgress[phase.id];
    }

    let totalTasks = 0;
    let completedTasks = 0;

    phase.sections.forEach(section => {
      totalTasks += section.tasks.length;
      section.tasks.forEach((_, taskIndex) => {
        const taskKey = `${phase.id}-${section.title}-${taskIndex}`;
        if (checkedTasks[taskKey]) {
          completedTasks++;
        }
      });
    });

    return (completedTasks / totalTasks) * 100;
  };

  const getPhaseStatus = (progress) => {
    if (progress === 0) return 'Not Started';
    if (progress === 100) return 'Completed';
    return 'In Progress';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          ATO Process Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Track and manage your Authorization to Operate (ATO) process. Check off completed items
          to monitor progress through each phase.
        </Typography>
      </Box>

      {saving && (
        <LinearProgress sx={{ mb: 2 }} />
      )}

      {processSteps.map((phase) => {
        const progress = calculatePhaseProgress(phase);
        const status = getPhaseStatus(progress);
        const PhaseIcon = phase.icon;

        return (
          <Accordion
            key={phase.id}
            expanded={expanded === `phase${phase.id}`}
            onChange={handleAccordionChange(`phase${phase.id}`)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PhaseIcon color="primary" />
                </ListItemIcon>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">
                    Phase {phase.id}: {phase.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {phase.description}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Chip 
                    label={`${Math.round(progress)}%`}
                    color={progress === 100 ? 'success' : progress > 0 ? 'primary' : 'default'}
                    size="small"
                  />
                  <Chip 
                    label={status}
                    color={progress === 100 ? 'success' : progress > 0 ? 'primary' : 'default'}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {phase.sections.map((section) => (
                <Box key={section.title} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {section.title}
                  </Typography>
                  <List dense>
                    {section.tasks.map((task, taskIndex) => {
                      const taskKey = `${phase.id}-${section.title}-${taskIndex}`;
                      return (
                        <ListItem
                          key={taskIndex}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={!!checkedTasks[taskKey]}
                              onChange={() => handleTaskCheck(phase.id, section.title, taskIndex)}
                              color="primary"
                              disabled={saving}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={task}
                            sx={{
                              textDecoration: checkedTasks[taskKey] ? 'line-through' : 'none',
                              color: checkedTasks[taskKey] ? 'text.secondary' : 'text.primary',
                            }}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Paper>
  );
};

export default ATOProcessPage;