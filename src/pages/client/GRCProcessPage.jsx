import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Assessment as AssessmentIcon,
  FindInPage as FindInPageIcon,
  Gavel as GavelIcon,
  Warning as WarningIcon,
  Security as SecurityIcon,
  Flag as FlagIcon,
  Launch as LaunchIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const processSteps = [
  {
    id: 1,
    title: 'Security Assessment',
    icon: <AssessmentIcon />,
    description: 'Initial evaluation of security posture',
    timeline: 'Phase 1',
    details: [
      'Conduct initial system inventory',
      'Document system purpose and functions',
      'Identify system components and boundaries',
      'Map data flows and interconnections',
      'Review existing security documentation'
    ]
  },
  {
    id: 2,
    title: 'Findings',
    icon: <FindInPageIcon />,
    description: 'Documentation of assessment results',
    timeline: 'Phase 1',
    details: [
      'Document assessment results',
      'Identify security gaps',
      'Analyze compliance requirements',
      'Evaluate control effectiveness',
      'Prioritize remediation needs'
    ]
  },
  {
    id: 3,
    title: 'Audit System',
    icon: <GavelIcon />,
    description: 'Systematic review and documentation',
    timeline: 'Phase 2',
    details: [
      'Review control evidence',
      'Validate procedures',
      'Check configuration docs',
      'Review training materials',
      'Verify evidence collection'
    ]
  },
  {
    id: 4,
    title: 'Risk',
    icon: <WarningIcon />,
    description: 'Identification and analysis of security risks',
    timeline: 'Phase 2',
    details: [
      'Analyze assessment results',
      'Document identified risks',
      'Assess risk levels',
      'Define mitigations',
      'Create POA&M'
    ]
  },
  {
    id: 5,
    title: 'Security Strategy',
    icon: <SecurityIcon />,
    description: 'Development of comprehensive security approach',
    timeline: 'Phase 3',
    details: [
      'Define monitoring strategy',
      'Select security metrics',
      'Establish frequency',
      'Document procedures',
      'Define roles'
    ]
  },
  {
    id: 6,
    title: 'Security Objective',
    icon: <FlagIcon />,
    description: 'Specific security goals and requirements',
    timeline: 'Phase 3',
    details: [
      'Document security objectives',
      'Define protection requirements',
      'Identify critical functions',
      'Map business impact',
      'Establish security priorities'
    ]
  },
  {
    id: 7,
    title: 'Security Initiative',
    icon: <LaunchIcon />,
    description: 'Implementation of security measures',
    timeline: 'Phase 4',
    details: [
      'Create control implementation strategy',
      'Define control ownership',
      'Document inheritance decisions',
      'Establish implementation timeline',
      'Define success criteria'
    ]
  },
  {
    id: 8,
    title: 'Plan of Action & Milestones',
    icon: <PlaylistAddCheckIcon />,
    description: 'Detailed implementation roadmap',
    timeline: 'Phase 4',
    details: [
      'Compile authorization package',
      'Review documentation',
      'Validate completeness',
      'Prepare executive summary',
      'Document recommendations'
    ]
  }
];

const GRCProcessPage = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          GRC Process Flow
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This timeline illustrates the complete flow of our GRC (Governance, Risk, and Compliance) process.
          Each phase represents key steps in ensuring comprehensive security management.
        </Typography>
      </Box>

      <Timeline position="alternate">
        {processSteps.map((step, index) => (
          <TimelineItem key={step.id}>
            <TimelineOppositeContent color="text.secondary">
              {step.timeline}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary">
                {step.icon}
              </TimelineDot>
              {index < processSteps.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Card 
                sx={{ 
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'scale(1.02)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="div">
                    {step.title}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {step.description}
                  </Typography>
                  <List dense>
                    {step.details.map((detail, detailIndex) => (
                      <ListItem key={detailIndex}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={detail}
                          primaryTypographyProps={{
                            variant: 'body2',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Paper>
  );
};

export default GRCProcessPage;