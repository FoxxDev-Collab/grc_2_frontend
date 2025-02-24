import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

//this page needs to the use the API and actual db.json data to generate the questions
const BASIC_QUESTIONS = [
  {
    id: 1,
    text: "Is antivirus software installed and updated on all systems?",
    impact: "Antivirus helps protect against malware and cyber threats",
    category: "System Security",
    findingTemplate: {
      title: "Missing or outdated antivirus protection",
      description: "Systems lack proper antivirus protection or updates are not maintained",
      severity: "high",
      recommendation: "Install and configure antivirus software on all systems with automatic updates",
      category: "System Security"
    }
  },
  {
    id: 2,
    text: "Are firewalls configured and maintained on all network boundaries?",
    impact: "Firewalls help prevent unauthorized network access",
    category: "Network Security",
    findingTemplate: {
      title: "Inadequate firewall protection",
      description: "Network boundaries lack proper firewall configuration",
      severity: "high",
      recommendation: "Deploy and configure firewalls at all network boundaries",
      category: "Network Security"
    }
  },
  {
    id: 3,
    text: "Is multi-factor authentication (MFA) enabled for all critical systems?",
    impact: "MFA significantly reduces the risk of unauthorized access",
    category: "Access Control",
    findingTemplate: {
      title: "Missing Multi-Factor Authentication",
      description: "Critical systems lack MFA protection",
      severity: "high",
      recommendation: "Implement MFA for all critical system access",
      category: "Access Control"
    }
  },
  {
    id: 4,
    text: "Are password policies enforced across all systems?",
    impact: "Strong password policies are essential for access security",
    category: "Access Control",
    findingTemplate: {
      title: "Insufficient password policies",
      description: "Password policies do not meet security requirements",
      severity: "high",
      recommendation: "Implement and enforce strong password policies",
      category: "Access Control"
    }
  },
  {
    id: 5,
    text: "Is security awareness training provided regularly?",
    impact: "Training helps prevent social engineering attacks",
    category: "Security Awareness",
    findingTemplate: {
      title: "Inadequate security awareness training",
      description: "Security awareness training is not regularly conducted",
      severity: "medium",
      recommendation: "Implement regular security awareness training program",
      category: "Security Awareness"
    }
  },
  {
    id: 6,
    text: "Are regular backups performed and tested?",
    impact: "Backups are critical for business continuity",
    category: "Data Protection",
    findingTemplate: {
      title: "Insufficient backup procedures",
      description: "Backup processes are not adequate or tested",
      severity: "high",
      recommendation: "Implement comprehensive backup strategy with regular testing",
      category: "Data Protection"
    }
  },
  {
    id: 7,
    text: "Is sensitive data encrypted at rest and in transit?",
    impact: "Encryption protects data from unauthorized access",
    category: "Data Protection",
    findingTemplate: {
      title: "Inadequate data encryption",
      description: "Sensitive data is not properly encrypted",
      severity: "high",
      recommendation: "Implement encryption for data at rest and in transit",
      category: "Data Protection"
    }
  },
  {
    id: 8,
    text: "Is patch management performed regularly?",
    impact: "Regular patching prevents exploitation of known vulnerabilities",
    category: "System Security",
    findingTemplate: {
      title: "Inadequate patch management",
      description: "Systems are not patched regularly",
      severity: "high",
      recommendation: "Implement regular patch management process",
      category: "System Security"
    }
  }
];

const BasicRiskAssessment = ({ onSubmitAssessment }) => {
  const [answers, setAnswers] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generatedFindings, setGeneratedFindings] = useState([]);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const generateFindings = () => {
    const findings = [];
    let score = 0;
    const totalQuestions = BASIC_QUESTIONS.length;

    BASIC_QUESTIONS.forEach(question => {
      if (answers[question.id] === 'no') {
        findings.push({
          id: `f-${Date.now()}-${question.id}`,
          ...question.findingTemplate,
          sourceQuestion: question.id,
          status: 'open',
          createdDate: new Date().toISOString()
        });
      } else {
        score += 1;
      }
    });

    const scorePercentage = Math.round((score / totalQuestions) * 100);

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
      name: `Basic Security Assessment ${currentDate.toLocaleDateString()}`,
      date: currentDate.toISOString(),
      type: 'basic',
      answers,
      score,
      generatedFindings: findings
    });
  };

  const isComplete = () => {
    return Object.keys(answers).length === BASIC_QUESTIONS.length;
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
        Basic Security Assessment
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        This assessment evaluates fundamental security controls and automatically generates findings based on your responses. Findings can be tracked in the Audit system and promoted to Risks when necessary.
      </Typography>
      
      <Grid container spacing={3}>
        {BASIC_QUESTIONS.map((q) => (
          <Grid item xs={12} key={q.id}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {q.text}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {q.impact}
                  </Typography>
                </Box>
                <Chip 
                  label={q.category}
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={answers[q.id] === 'yes' ? 'contained' : 'outlined'}
                  color="success"
                  onClick={() => handleAnswer(q.id, 'yes')}
                >
                  Yes
                </Button>
                <Button
                  variant={answers[q.id] === 'no' ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => handleAnswer(q.id, 'no')}
                >
                  No
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

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
              This score is based on the number of security controls properly implemented.
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Generated Findings ({generatedFindings.findings?.length || 0})
          </Typography>

          <List>
            {generatedFindings.findings?.map((finding) => (
              <ListItem key={finding.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
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

BasicRiskAssessment.propTypes = {
  onSubmitAssessment: PropTypes.func.isRequired,
};

export default BasicRiskAssessment;