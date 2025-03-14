//move this to the components directory
import {
  Search as SearchIcon,
  Category as CategoryIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  VerifiedUser as VerifiedUserIcon,
  MonitorHeart as MonitorIcon,
} from '@mui/icons-material';

export const processSteps = [
  {
    id: 1,
    title: 'Initial Assessment',
    icon: SearchIcon,
    description: 'System discovery and initial evaluation',
    sections: [
      {
        title: 'System Discovery',
        tasks: [
          'Conduct initial system inventory',
          'Document system purpose and functions',
          'Identify system components and boundaries',
          'Map data flows and interconnections',
          'Review existing security documentation'
        ]
      },
      {
        title: 'Gap Analysis',
        tasks: [
          'Compare current state against required controls',
          'Document existing security measures',
          'Identify missing controls and documentation',
          'Assess current security practices',
          'Review existing policies and procedures'
        ]
      },
      {
        title: 'Environment Analysis',
        tasks: [
          'Evaluate hosting environment (Cloud/On-Prem/Hybrid)',
          'Document infrastructure components',
          'Review network architecture',
          'Assess system dependencies',
          'Identify critical system interfaces'
        ]
      },
      {
        title: 'Stakeholder Analysis',
        tasks: [
          'Identify key system stakeholders',
          'Document system owners and operators',
          'Map security responsibilities',
          'Establish points of contact',
          'Define communication channels'
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'System Categorization',
    icon: CategoryIcon,
    description: 'Information classification and impact analysis',
    sections: [
      {
        title: 'Information Types',
        tasks: [
          'Identify all information types',
          'Document data sensitivity levels',
          'Map regulatory requirements',
          'Define data ownership',
          'Document data flows'
        ]
      },
      {
        title: 'Impact Analysis',
        tasks: [
          'Assess confidentiality impact',
          'Evaluate integrity impact',
          'Determine availability impact',
          'Document impact rationale',
          'Define system categorization'
        ]
      },
      {
        title: 'Security Objectives',
        tasks: [
          'Document security objectives',
          'Define protection requirements',
          'Identify critical functions',
          'Map business impact',
          'Establish security priorities'
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Security Controls',
    icon: SecurityIcon,
    description: 'Control selection and implementation',
    sections: [
      {
        title: 'Baseline Selection',
        tasks: [
          'Select security control baseline',
          'Document baseline rationale',
          'Map regulatory requirements',
          'Identify applicable overlays',
          'Define supplemental controls'
        ]
      },
      {
        title: 'Control Implementation',
        tasks: [
          'Configure security settings',
          'Deploy security tools',
          'Implement procedures',
          'Document configurations',
          'Validate implementations'
        ]
      },
      {
        title: 'System Security Plan',
        tasks: [
          'Document system description',
          'Detail control implementations',
          'Map security responsibilities',
          'Document architecture',
          'Define boundaries'
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Assessment',
    icon: AssessmentIcon,
    description: 'Security testing and evaluation',
    sections: [
      {
        title: 'Assessment Planning',
        tasks: [
          'Develop assessment plan',
          'Define testing procedures',
          'Identify assessment tools',
          'Create test cases',
          'Document methodology'
        ]
      },
      {
        title: 'Security Testing',
        tasks: [
          'Conduct vulnerability scans',
          'Perform penetration testing',
          'Test control effectiveness',
          'Document test results',
          'Validate configurations'
        ]
      },
      {
        title: 'Control Assessment',
        tasks: [
          'Review control evidence',
          'Test control effectiveness',
          'Document findings',
          'Identify gaps',
          'Assess residual risk'
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Authorization',
    icon: VerifiedUserIcon,
    description: 'ATO package and decision',
    sections: [
      {
        title: 'Risk Assessment',
        tasks: [
          'Analyze assessment results',
          'Document identified risks',
          'Assess risk levels',
          'Define mitigations',
          'Create POA&M'
        ]
      },
      {
        title: 'Package Preparation',
        tasks: [
          'Compile authorization package',
          'Review documentation',
          'Validate completeness',
          'Prepare executive summary',
          'Document recommendations'
        ]
      },
      {
        title: 'Authorization Decision',
        tasks: [
          'Present to authorizing official',
          'Review residual risks',
          'Document decision',
          'Define conditions',
          'Establish authorization boundary'
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Continuous Monitoring',
    icon: MonitorIcon,
    description: 'Ongoing security maintenance',
    sections: [
      {
        title: 'Monitoring Program',
        tasks: [
          'Define monitoring strategy',
          'Select security metrics',
          'Establish frequency',
          'Document procedures',
          'Define roles'
        ]
      },
      {
        title: 'Change Management',
        tasks: [
          'Document change procedures',
          'Review security impact',
          'Update documentation',
          'Track modifications',
          'Maintain baseline'
        ]
      },
      {
        title: 'Maintenance',
        tasks: [
          'Review security posture',
          'Update documentation',
          'Maintain evidence',
          'Track compliance',
          'Report status'
        ]
      }
    ]
  }
];