// Mock security objectives
export const mockObjectives = [
  {
    id: 1,
    clientId: 1,
    name: 'Implement Zero Trust Architecture',
    description: 'Transform network security to a Zero Trust model with enhanced access controls and network segmentation',
    progress: 65,
    status: 'In Progress',
    dueDate: '2024-12-31',
    priority: 'High',
    owner: 'Security Operations',
    assignedTo: 'Alice Brown',
    relatedRisks: [1],
    metrics: {
      successCriteria: ['MFA adoption rate > 95%', 'Network segmentation complete', 'Identity-based access controls implemented'],
      currentMetrics: ['MFA adoption: 82%', 'Segmentation: 60% complete', 'Identity controls: In progress']
    }
  },
  {
    id: 2,
    clientId: 1,
    name: 'Enhance Data Protection Controls',
    description: 'Strengthen data protection mechanisms across all systems including encryption and DLP implementation',
    progress: 40,
    status: 'In Progress',
    dueDate: '2024-09-30',
    priority: 'High',
    owner: 'Information Technology',
    assignedTo: 'David Wilson',
    relatedRisks: [2],
    metrics: {
      successCriteria: ['100% sensitive data encrypted', 'DLP implementation complete', 'Backup systems upgraded'],
      currentMetrics: ['Encryption: 85% complete', 'DLP: Planning phase', 'Backup upgrade: 50% complete']
    }
  },
  {
    id: 3,
    clientId: 1,
    name: 'Security Awareness Program',
    description: 'Implement comprehensive security awareness training program for all employees',
    progress: 90,
    status: 'Completed',
    dueDate: '2024-03-31',
    priority: 'Medium',
    owner: 'Security Operations',
    assignedTo: 'Alice Brown',
    relatedRisks: [1, 2],
    metrics: {
      successCriteria: ['95% training completion rate', 'Phishing test success < 5%', 'Monthly awareness sessions'],
      currentMetrics: ['Training: 98% complete', 'Phishing success: 3%', 'Sessions: On track']
    }
  },
  {
    id: 4,
    clientId: 1,
    name: 'Network Infrastructure Modernization',
    description: 'Upgrade and modernize network infrastructure to improve performance and security',
    progress: 30,
    status: 'In Progress',
    dueDate: '2024-11-30',
    priority: 'High',
    owner: 'Network Operations',
    assignedTo: 'Sarah Johnson',
    relatedRisks: [3],
    metrics: {
      successCriteria: ['Network performance improved by 50%', 'New monitoring tools implemented', '99.99% uptime achieved'],
      currentMetrics: ['Performance: +20%', 'Monitoring: In progress', 'Uptime: 99.95%']
    }
  },
  {
    id: 5,
    clientId: 1,
    name: 'Compliance Framework Implementation',
    description: 'Implement and maintain comprehensive compliance framework across organization',
    progress: 55,
    status: 'In Progress',
    dueDate: '2024-10-31',
    priority: 'High',
    owner: 'Risk & Compliance',
    assignedTo: 'Michael Chen',
    relatedRisks: [4],
    metrics: {
      successCriteria: ['Framework documentation complete', 'All controls implemented', 'Audit readiness achieved'],
      currentMetrics: ['Documentation: 75%', 'Controls: 60%', 'Audit prep: In progress']
    }
  },
  {
    id: 6,
    clientId: 1,
    name: 'Cloud Security Enhancement',
    description: 'Strengthen security controls and monitoring for cloud infrastructure',
    progress: 45,
    status: 'In Progress',
    dueDate: '2024-08-31',
    priority: 'High',
    owner: 'Information Technology',
    assignedTo: 'David Wilson',
    relatedRisks: [5],
    metrics: {
      successCriteria: ['Cloud security baseline established', 'Monitoring implemented', 'Access controls reviewed'],
      currentMetrics: ['Baseline: In progress', 'Monitoring: 70%', 'Access review: 50%']
    }
  }
];

// Objective status options
export const mockObjectiveStatus = [
  'Planning',
  'In Progress',
  'Completed',
  'On Hold',
  'Cancelled'
];

// Priority levels
export const mockPriorityLevels = [
  'Low',
  'Medium',
  'High',
  'Critical'
];

// Metric categories
export const mockMetricCategories = [
  'Security',
  'Performance',
  'Compliance',
  'Training',
  'Infrastructure'
];

// Success criteria types
export const mockSuccessCriteriaTypes = [
  'Percentage',
  'Completion',
  'Implementation',
  'Measurement',
  'Timeline'
];