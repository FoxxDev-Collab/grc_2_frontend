// Mock risk data
export const mockRisks = [
  {
    id: 'r-001',
    clientId: 1,
    name: 'Insufficient Access Controls',
    description: 'Current access control mechanisms do not meet security requirements',
    impact: 'high',
    likelihood: 'medium',
    category: 'Access Control',
    status: 'active',
    lastAssessed: '2024-02-15T08:00:00Z',
    sourceFindings: [
      {
        findingId: 'f-1',
        title: 'Missing MFA Implementation',
        sourceType: 'security_assessment',
        date: '2024-02-15T08:00:00Z'
      }
    ],
    businessImpact: {
      financial: 'Potential unauthorized access could lead to financial losses',
      operational: 'System access issues could disrupt operations',
      reputational: 'Security breaches could damage company reputation',
      compliance: 'Non-compliance with security standards'
    },
    treatment: {
      approach: 'mitigate',
      plan: 'Implement MFA and enhance access controls',
      status: 'in_progress',
      objectives: ['obj-1', 'obj-2'],
      lastUpdated: '2024-02-16T10:00:00Z'
    }
  },
  {
    id: 'r-002',
    clientId: 1,
    name: 'Unencrypted Data Storage',
    description: 'Sensitive data stored without proper encryption',
    impact: 'high',
    likelihood: 'high',
    category: 'Data Protection',
    status: 'active',
    lastAssessed: '2024-02-14T09:00:00Z',
    sourceFindings: [
      {
        findingId: 'f-2',
        title: 'Unencrypted Database Backups',
        sourceType: 'vulnerability_scan',
        date: '2024-02-14T09:00:00Z'
      }
    ],
    businessImpact: {
      financial: 'Data breach could result in significant fines',
      operational: 'Data protection issues could affect system performance',
      reputational: 'Data breaches could severely impact trust',
      compliance: 'Direct violation of data protection regulations'
    },
    treatment: {
      approach: 'mitigate',
      plan: 'Implement database and backup encryption',
      status: 'not_started',
      objectives: ['obj-3'],
      lastUpdated: '2024-02-14T09:00:00Z'
    }
  },
  {
    id: 'r-003',
    clientId: 1,
    name: 'Outdated System Components',
    description: 'Critical system components running outdated versions',
    impact: 'medium',
    likelihood: 'high',
    category: 'Vulnerability Management',
    status: 'active',
    lastAssessed: '2024-02-13T14:00:00Z',
    sourceFindings: [
      {
        findingId: 'f-3',
        title: 'Multiple Systems Running Outdated Software',
        sourceType: 'external_audit',
        date: '2024-02-13T14:00:00Z'
      }
    ],
    businessImpact: {
      financial: 'Potential system failures could impact revenue',
      operational: 'System instability affects productivity',
      reputational: 'Service disruptions could affect client trust',
      compliance: 'Non-compliance with security requirements'
    },
    treatment: {
      approach: 'mitigate',
      plan: 'Implement systematic update process',
      status: 'in_progress',
      objectives: ['obj-4'],
      lastUpdated: '2024-02-13T15:00:00Z'
    }
  },
  {
    id: 'r-004',
    clientId: 1,
    name: 'Inadequate Backup Procedures',
    description: 'Current backup procedures do not meet recovery requirements',
    impact: 'high',
    likelihood: 'medium',
    category: 'Business Continuity',
    status: 'mitigated',
    lastAssessed: '2024-02-12T11:00:00Z',
    sourceFindings: [
      {
        findingId: 'f-4',
        title: 'Backup Recovery Tests Failed',
        sourceType: 'security_assessment',
        date: '2024-02-12T11:00:00Z'
      }
    ],
    businessImpact: {
      financial: 'Data loss could result in significant recovery costs',
      operational: 'System recovery issues could extend downtime',
      reputational: 'Extended service disruptions affect client confidence',
      compliance: 'Non-compliance with business continuity requirements'
    },
    treatment: {
      approach: 'mitigate',
      plan: 'Implement automated backup system with regular testing',
      status: 'completed',
      objectives: ['obj-5'],
      lastUpdated: '2024-02-12T16:00:00Z'
    }
  },
  {
    id: 'r-005',
    clientId: 1,
    name: 'Insufficient Security Monitoring',
    description: 'Limited visibility into security events and incidents',
    impact: 'medium',
    likelihood: 'medium',
    category: 'Security Operations',
    status: 'active',
    lastAssessed: '2024-02-11T13:00:00Z',
    sourceFindings: [
      {
        findingId: 'f-5',
        title: 'Incomplete Security Event Logging',
        sourceType: 'security_assessment',
        date: '2024-02-11T13:00:00Z'
      }
    ],
    businessImpact: {
      financial: 'Delayed incident response could increase damages',
      operational: 'Limited visibility affects security operations',
      reputational: 'Security incidents could go undetected',
      compliance: 'Non-compliance with monitoring requirements'
    },
    treatment: {
      approach: 'mitigate',
      plan: 'Implement SIEM solution with 24/7 monitoring',
      status: 'in_progress',
      objectives: ['obj-6'],
      lastUpdated: '2024-02-11T14:00:00Z'
    }
  }
];