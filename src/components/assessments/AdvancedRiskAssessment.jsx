import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Divider,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const ADVANCED_QUESTIONS = [
  {
    id: 1,
    category: 'Data Protection',
    questions: [
      {
        id: 'dp1',
        text: 'What types of sensitive data does your organization handle?',
        type: 'multiSelect',
        options: ['PII', 'Financial', 'Healthcare', 'Intellectual Property'],
        findingTemplate: {
          title: 'Incomplete data classification coverage',
          description: 'Not all sensitive data types are properly classified and protected',
          severity: 'high',
          recommendation: 'Implement comprehensive data classification program covering all sensitive data types',
          category: 'Data Protection'
        }
      },
      {
        id: 'dp2',
        text: 'Describe your data encryption implementation',
        type: 'text',
        findingTemplate: {
          title: 'Inadequate encryption implementation',
          description: 'Data encryption implementation may not meet security requirements',
          severity: 'high',
          recommendation: 'Implement strong encryption for all sensitive data with proper key management',
          category: 'Data Protection'
        }
      },
      {
        id: 'dp3',
        text: 'Rate your data protection maturity (0-10)',
        type: 'slider',
        min: 0,
        max: 10,
        findingTemplate: {
          title: 'Low data protection maturity',
          description: 'Overall data protection practices need improvement',
          severity: 'medium',
          recommendation: 'Develop and implement comprehensive data protection program',
          category: 'Data Protection'
        }
      },
    ],
  },
  {
    id: 2,
    category: 'Access Control',
    questions: [
      {
        id: 'ac1',
        text: 'Do you implement role-based access control (RBAC)?',
        type: 'radio',
        options: ['Yes', 'Partially', 'No'],
        findingTemplate: {
          title: 'Insufficient access control implementation',
          description: 'Role-based access control is not fully implemented',
          severity: 'high',
          recommendation: 'Implement comprehensive RBAC across all systems',
          category: 'Access Control'
        }
      },
      {
        id: 'ac2',
        text: 'Describe your password policy requirements',
        type: 'text',
        findingTemplate: {
          title: 'Weak password policy',
          description: 'Password policy may not meet security requirements',
          severity: 'high',
          recommendation: 'Implement strong password policy meeting industry standards',
          category: 'Access Control'
        }
      },
      {
        id: 'ac3',
        text: 'Rate your authentication controls maturity (0-10)',
        type: 'slider',
        min: 0,
        max: 10,
        findingTemplate: {
          title: 'Low authentication maturity',
          description: 'Authentication controls need improvement',
          severity: 'medium',
          recommendation: 'Enhance authentication controls including MFA implementation',
          category: 'Access Control'
        }
      },
    ],
  },
  {
    id: 3,
    category: 'Incident Response',
    questions: [
      {
        id: 'ir1',
        text: 'Do you have a documented incident response plan?',
        type: 'radio',
        options: ['Yes', 'In Progress', 'No'],
        findingTemplate: {
          title: 'Missing incident response plan',
          description: 'No formal incident response plan is in place',
          severity: 'high',
          recommendation: 'Develop and implement formal incident response plan',
          category: 'Incident Response'
        }
      },
      {
        id: 'ir2',
        text: 'Describe your incident detection capabilities',
        type: 'text',
        findingTemplate: {
          title: 'Inadequate incident detection',
          description: 'Incident detection capabilities need improvement',
          severity: 'high',
          recommendation: 'Implement comprehensive incident detection and monitoring',
          category: 'Incident Response'
        }
      },
      {
        id: 'ir3',
        text: 'Rate your incident response maturity (0-10)',
        type: 'slider',
        min: 0,
        max: 10,
        findingTemplate: {
          title: 'Low incident response maturity',
          description: 'Overall incident response capabilities need improvement',
          severity: 'medium',
          recommendation: 'Enhance incident response program including regular testing',
          category: 'Incident Response'
        }
      },
    ],
  },
];

const AdvancedRiskAssessment = ({ onSubmitAssessment }) => {
  const [answers, setAnswers] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generatedFindings, setGeneratedFindings] = useState([]);
  const [selectedDataTypes, setSelectedDataTypes] = useState([]);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleDataTypeChange = (event) => {
    setSelectedDataTypes(event.target.value);
    handleAnswer('dp1', event.target.value);
  };

  const generateFindings = () => {
    const findings = [];
    let score = 0;
    let maxScore = 0;

    ADVANCED_QUESTIONS.forEach(category => {
      category.questions.forEach(question => {
        let finding = null;
        
        switch (question.id) {
          case 'dp1':
            if (!answers[question.id] || answers[question.id].length < 2) {
              finding = question.findingTemplate;
            } else {
              score += answers[question.id].length;
            }
            maxScore += 4; // Maximum number of data types
            break;

          case 'ac1':
          case 'ir1':
            if (answers[question.id] === 'No' || answers[question.id] === 'In Progress') {
              finding = question.findingTemplate;
            } else {
              score += 10;
            }
            maxScore += 10;
            break;

          case 'dp2':
          case 'ac2':
          case 'ir2':
            if (!answers[question.id] || answers[question.id].length < 50) {
              finding = question.findingTemplate;
            } else {
              score += 10;
            }
            maxScore += 10;
            break;

          case 'dp3':
          case 'ac3':
          case 'ir3':
            if (answers[question.id] < 7) {
              finding = {
                ...question.findingTemplate,
                description: `${question.findingTemplate.description} (Current maturity: ${answers[question.id]}/10)`
              };
            }
            score += answers[question.id] || 0;
            maxScore += 10;
            break;
        }

        if (finding) {
          findings.push({
            id: `f-${Date.now()}-${question.id}`,
            ...finding,
            sourceQuestion: question.id,
            status: 'open',
            createdDate: new Date().toISOString()
          });
        }
      });
    });

    const scorePercentage = Math.round((score / maxScore) * 100);

    return {
      findings,
      score: scorePercentage
    };
  };

  const handlePreview = () => {
    const { findings, score } = generateFindings();
    setGeneratedFindings({ findings, score });
    setPreviewOpen(true);
  };

  const handleSubmit = () => {
    const { findings, score } = generateFindings();
    const currentDate = new Date();
    
    onSubmitAssessment({
      name: `Advanced Security Assessment ${currentDate.toLocaleDateString()}`,
      date: currentDate.toISOString(),
      type: 'advanced',
      answers,
      score,
      generatedFindings: findings
    });
  };

  const isComplete = () => {
    let totalQuestions = 0;
    let answeredQuestions = 0;
    ADVANCED_QUESTIONS.forEach(category => {
      category.questions.forEach(question => {
        totalQuestions++;
        if (answers[question.id]) answeredQuestions++;
      });
    });
    return answeredQuestions === totalQuestions;
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'radio': {
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{question.text}</FormLabel>
            <RadioGroup
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
            >
              {question.options.map(option => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      }
      case 'multiSelect': {
        return (
          <FormControl fullWidth>
            <InputLabel>{question.text}</InputLabel>
            <Select
              multiple
              value={selectedDataTypes}
              onChange={handleDataTypeChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {question.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
      case 'text': {
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            label={question.text}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          />
        );
      }
      case 'slider': {
        return (
          <Box sx={{ width: '100%' }}>
            <Typography gutterBottom>{question.text}</Typography>
            <Slider
              value={answers[question.id] || 0}
              onChange={(e, value) => handleAnswer(question.id, value)}
              min={question.min}
              max={question.max}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        );
      }
      default:
        return null;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Advanced Security Assessment
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        This in-depth assessment evaluates your organization&apos;s security controls and automatically generates detailed findings. Findings can be tracked in the Audit system and promoted to Risks when necessary.
      </Typography>

      {ADVANCED_QUESTIONS.map((category) => (
        <Paper key={category.id} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            {category.category}
          </Typography>
          
          <Grid container spacing={4}>
            {category.questions.map(question => (
              <Grid item xs={12} key={question.id}>
                {renderQuestion(question)}
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handlePreview}
          disabled={!isComplete()}
        >
          Preview Findings
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isComplete()}
        >
          Submit Assessment
        </Button>
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Assessment Preview
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Overall Score: {generatedFindings.score}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This score is based on the maturity levels and completeness of security controls.
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Generated Findings ({generatedFindings.findings?.length || 0})
          </Typography>

          <List>
            {generatedFindings.findings?.map((finding) => (
              <ListItem key={finding.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                  <WarningIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    {finding.title}
                  </Typography>
                  <Chip
                    label={finding.severity}
                    color={getSeverityColor(finding.severity)}
                    size="small"
                    sx={{ ml: 'auto' }}
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
                  <Chip
                    label="Ready for Audit"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit Assessment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

AdvancedRiskAssessment.propTypes = {
  onSubmitAssessment: PropTypes.func.isRequired,
};

export default AdvancedRiskAssessment;