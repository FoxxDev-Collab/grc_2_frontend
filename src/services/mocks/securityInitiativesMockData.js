// Mock security initiatives
export const mockInitiatives = [
  {
    id: 1,
    clientId: 1,
    name: 'MFA Implementation',
    description: 'Deploy multi-factor authentication across all systems and applications',
    phase: 'Phase 2',
    timeline: '2024 Q2',
    status: 'In Progress',
    objectiveId: 1, // Zero Trust Architecture
    milestones: [
      { id: 1, name: 'MFA Solution Selection', completed: true },
      { id: 2, name: 'Identity Provider Integration', completed: true },
      { id: 3, name: 'User Enrollment', completed: false },
      { id: 4, name: 'Legacy System Integration', completed: false }
    ],
    resources: {
      team: ['Security Operations', 'Information Technology'],
      budget: '120,000',
      tools: ['Identity Management Platform', 'MFA Solution']
    }
  },
  {
    id: 2,
    clientId: 1,
    name: 'Network Segmentation',
    description: 'Implement network segmentation and micro-segmentation',
    phase: 'Phase 2',
    timeline: '2024 Q3',
    status: 'In Progress',
    objectiveId: 1, // Zero Trust Architecture
    milestones: [
      { id: 1, name: 'Network Assessment', completed: true },
      { id: 2, name: 'Segmentation Design', completed: true },
      { id: 3, name: 'Implementation', completed: false },
      { id: 4, name: 'Testing and Validation', completed: false }
    ],
    resources: {
      team: ['Network Operations', 'Security Operations'],
      budget: '250,000',
      tools: ['Network Management System', 'Security Tools']
    }
  },
  {
    id: 3,
    clientId: 1,
    name: 'Data Encryption Program',
    description: 'Implement end-to-end encryption for sensitive data',
    phase: 'Phase 1',
    timeline: '2024 Q3',
    status: 'Planning',
    objectiveId: 2, // Enhance Data Protection
    milestones: [
      { id: 1, name: 'Data Classification', completed: false },
      { id: 2, name: 'Encryption Solution Deployment', completed: false },
      { id: 3, name: 'Key Management Setup', completed: false },
      { id: 4, name: 'User Training', completed: false }
    ],
    resources: {
      team: ['Information Technology', 'Security Operations'],
      budget: '180,000',
      tools: ['Encryption Solution', 'Key Management System']
    }
  },
  {
    id: 4,
    clientId: 1,
    name: 'Security Awareness Training',
    description: 'Deploy comprehensive security awareness training program',
    phase: 'Phase 3',
    timeline: '2024 Q1',
    status: 'Completed',
    objectiveId: 3, // Security Awareness Program
    milestones: [
      { id: 1, name: 'Training Platform Setup', completed: true },
      { id: 2, name: 'Content Development', completed: true },
      { id: 3, name: 'Employee Training', completed: true },
      { id: 4, name: 'Effectiveness Assessment', completed: true }
    ],
    resources: {
      team: ['Security Operations', 'Risk & Compliance'],
      budget: '75,000',
      tools: ['Learning Management System', 'Phishing Simulator']
    }
  },
  {
    id: 5,
    clientId: 1,
    name: 'Network Performance Upgrade',
    description: 'Upgrade network infrastructure and monitoring capabilities',
    phase: 'Phase 2',
    timeline: '2024 Q3',
    status: 'In Progress',
    objectiveId: 4, // Network Infrastructure Modernization
    milestones: [
      { id: 1, name: 'Infrastructure Assessment', completed: true },
      { id: 2, name: 'Hardware Upgrades', completed: false },
      { id: 3, name: 'Monitoring Implementation', completed: false },
      { id: 4, name: 'Performance Testing', completed: false }
    ],
    resources: {
      team: ['Network Operations', 'Information Technology'],
      budget: '350,000',
      tools: ['Network Monitoring Tools', 'Performance Analytics']
    }
  },
  {
    id: 6,
    clientId: 1,
    name: 'Compliance Documentation',
    description: 'Develop and maintain comprehensive compliance documentation',
    phase: 'Phase 2',
    timeline: '2024 Q3',
    status: 'In Progress',
    objectiveId: 5, // Compliance Framework Implementation
    milestones: [
      { id: 1, name: 'Framework Selection', completed: true },
      { id: 2, name: 'Documentation Development', completed: true },
      { id: 3, name: 'Control Implementation', completed: false },
      { id: 4, name: 'Internal Audit', completed: false }
    ],
    resources: {
      team: ['Risk & Compliance', 'Security Operations'],
      budget: '120,000',
      tools: ['GRC Platform', 'Documentation System']
    }
  },
  {
    id: 7,
    clientId: 1,
    name: 'Cloud Security Controls',
    description: 'Implement cloud security controls and monitoring',
    phase: 'Phase 2',
    timeline: '2024 Q3',
    status: 'In Progress',
    objectiveId: 6, // Cloud Security Enhancement
    milestones: [
      { id: 1, name: 'Cloud Security Assessment', completed: true },
      { id: 2, name: 'Control Implementation', completed: false },
      { id: 3, name: 'Monitoring Setup', completed: false },
      { id: 4, name: 'Security Testing', completed: false }
    ],
    resources: {
      team: ['Information Technology', 'Security Operations'],
      budget: '200,000',
      tools: ['Cloud Security Platform', 'Monitoring Tools']
    }
  }
];

// Initiative status options
export const mockInitiativeStatus = [
  'Planning',
  'In Progress',
  'Completed',
  'On Hold',
  'Cancelled'
];

// Phase options
export const mockPhases = [
  'Phase 1',
  'Phase 2',
  'Phase 3',
  'Phase 4'
];

// Timeline options
export const mockTimelines = [
  '2024 Q1',
  '2024 Q2',
  '2024 Q3',
  '2024 Q4',
  '2025 Q1'
];

// Resource categories
export const mockResourceCategories = [
  'Team',
  'Budget',
  'Tools',
  'Vendors',
  'Infrastructure'
];