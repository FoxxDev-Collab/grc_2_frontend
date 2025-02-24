// Mock security assessments data
export const mockSecurityAssessments = [
  {
    id: 'sa-1',
    clientId: 1,
    type: 'basic',
    name: 'Basic Security Assessment Q1 2024',
    date: '2024-01-15T10:00:00Z',
    status: 'completed',
    score: 75,
    reviewer: {
      name: 'Alice Brown',
      role: 'CISO',
      department: 'Security Operations'
    },
    answers: {
      1: 'yes',  // Antivirus
      2: 'yes',  // Firewall
      3: 'no',   // MFA
      4: 'yes',  // Password Policy
      5: 'yes',  // Security Training
      6: 'yes',  // Backup
      7: 'no',   // Encryption
      8: 'yes',  // Patch Management
      9: 'yes',  // Network Monitoring
      10: 'no',  // Incident Response
      11: 'yes', // Access Control
      12: 'yes'  // Security Policies
    },
    recommendations: [
      {
        id: 'rec-1',
        category: 'Access Control',
        recommendation: 'Implement Multi-Factor Authentication',
        impact: 'Strengthens access security and reduces unauthorized access risk',
        priority: 'high',
        status: 'pending'
      },
      {
        id: 'rec-2',
        category: 'Data Protection',
        recommendation: 'Implement data encryption',
        impact: 'Protects sensitive data from unauthorized access',
        priority: 'high',
        status: 'in_progress'
      },
      {
        id: 'rec-3',
        category: 'Incident Response',
        recommendation: 'Develop incident response plan',
        impact: 'Improves response time and effectiveness during security incidents',
        priority: 'medium',
        status: 'pending'
      }
    ],
    generatedFindings: [
      {
        id: 'f-1', // Reference to finding in auditMockData
        title: 'Insufficient password complexity requirements',
        severity: 'high',
        category: 'Access Control'
      },
      {
        id: 'f-4',
        title: 'Missing Multi-Factor Authentication',
        severity: 'high',
        category: 'Access Control'
      },
      {
        id: 'f-5',
        title: 'Incomplete encryption implementation',
        severity: 'medium',
        category: 'Data Protection'
      }
    ]
  },
  {
    id: 'sa-2',
    clientId: 1,
    type: 'advanced',
    name: 'Advanced Security Assessment Q1 2024',
    date: '2024-02-01T10:00:00Z',
    status: 'completed',
    score: 82,
    reviewer: {
      name: 'Michael Chen',
      role: 'Risk Director',
      department: 'Risk & Compliance'
    },
    answers: {
      'dp1': ['PII', 'Financial', 'Intellectual Property'],
      'dp2': 'AES-256 encryption for databases and file storage, with key rotation',
      'dp3': 8,
      'ac1': 'Yes',
      'ac2': 'Minimum 12 characters, complexity requirements, 90-day rotation',
      'ac3': 7,
      'ir1': 'Yes',
      'ir2': 'Automated monitoring and alerting with incident response team on call',
      'ir3': 9
    },
    recommendations: [
      {
        id: 'rec-4',
        category: 'Data Protection',
        recommendation: 'Expand data classification coverage',
        impact: 'Ensures proper handling of all sensitive data types',
        priority: 'high',
        status: 'completed'
      },
      {
        id: 'rec-5',
        category: 'Access Control',
        recommendation: 'Enhance access control measures',
        impact: 'Strengthens overall security posture',
        priority: 'medium',
        status: 'in_progress'
      },
      {
        id: 'rec-6',
        category: 'Incident Response',
        recommendation: 'Improve incident response capabilities',
        impact: 'Reduces impact of security incidents',
        priority: 'medium',
        status: 'deferred'
      }
    ],
    generatedFindings: [
      {
        id: 'f-6',
        title: 'Incomplete data classification',
        severity: 'medium',
        category: 'Data Protection'
      },
      {
        id: 'f-7',
        title: 'Access control maturity gaps',
        severity: 'medium',
        category: 'Access Control'
      }
    ]
  }
];

// Assessment types with detailed question structures
export const assessmentTypes = {
  basic: {
    name: 'Basic Assessment',
    description: 'Initial security evaluation covering fundamental controls',
    estimatedTime: '1-2 hours',
    recommendedFrequency: 'Quarterly',
    categories: [
      'Access Control',
      'Data Protection',
      'Network Security',
      'System Security',
      'Security Awareness',
      'Incident Response'
    ],
    questions: [
      {
        id: 1,
        text: 'Is antivirus software installed and updated on all systems?',
        category: 'System Security',
        findingTemplate: {
          title: 'Missing or outdated antivirus protection',
          severity: 'high',
          recommendation: 'Install and configure antivirus software on all systems with automatic updates'
        }
      },
      {
        id: 2,
        text: 'Are firewalls configured and maintained on all network boundaries?',
        category: 'Network Security',
        findingTemplate: {
          title: 'Inadequate firewall protection',
          severity: 'high',
          recommendation: 'Deploy and configure firewalls at all network boundaries'
        }
      }
      // Additional questions would be defined here
    ]
  },
  advanced: {
    name: 'Advanced Assessment',
    description: 'Comprehensive security evaluation with detailed analysis',
    estimatedTime: '4-6 hours',
    recommendedFrequency: 'Semi-annually',
    categories: [
      'Data Protection',
      'Access Control',
      'Incident Response',
      'Network Architecture',
      'Cloud Security',
      'Application Security',
      'Security Operations',
      'Compliance'
    ],
    sections: [
      {
        id: 'dp',
        name: 'Data Protection',
        questions: [
          {
            id: 'dp1',
            text: 'What types of sensitive data are stored or processed?',
            type: 'multi-select',
            options: ['PII', 'Financial', 'Health', 'Intellectual Property'],
            findingTemplate: {
              title: 'Incomplete data classification',
              severity: 'medium',
              recommendation: 'Implement comprehensive data classification program'
            }
          }
          // Additional questions would be defined here
        ]
      }
      // Additional sections would be defined here
    ]
  }
};

// Assessment statuses
export const assessmentStatuses = [
  'scheduled',
  'in_progress',
  'pending_review',
  'completed',
  'archived'
];

// Recommendation priorities
export const recommendationPriorities = [
  'critical',
  'high',
  'medium',
  'low'
];

// Recommendation statuses
export const recommendationStatuses = [
  'pending',
  'in_progress',
  'completed',
  'deferred'
];

// Finding severity mapping based on assessment responses
export const findingSeverityMapping = {
  critical: {
    conditions: ['Multiple high-risk findings', 'Immediate business impact'],
    requiredActions: ['Immediate notification', 'Executive briefing']
  },
  high: {
    conditions: ['Single high-risk finding', 'Potential business impact'],
    requiredActions: ['48-hour response', 'Management notification']
  },
  medium: {
    conditions: ['Control gaps', 'Limited exposure'],
    requiredActions: ['Planned remediation', 'Regular updates']
  },
  low: {
    conditions: ['Minor issues', 'Policy violations'],
    requiredActions: ['Track in backlog', 'Include in reporting']
  }
};

// Assessment metrics
export const assessmentMetrics = {
  completed: {
    last30Days: 5,
    last90Days: 15,
    lastYear: 45
  },
  averageScores: {
    basic: 78,
    advanced: 82
  },
  findingsGenerated: {
    total: 127,
    byType: {
      basic: 85,
      advanced: 42
    }
  },
  trends: {
    scoreImprovement: '+5%',
    findingReduction: '-12%',
    completionRate: '95%'
  }
};