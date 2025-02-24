const mockAssessmentData = {
  assessmentPlan: {
    id: 'ap-001',
    assessmentTitle: 'Annual Security Assessment 2025',
    assessmentType: 'Annual Assessment',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    assessmentTeam: 'Security Team A\nExternal Auditor: SecureAudit Inc.',
    objectives: 'Evaluate system security controls\nValidate compliance with security requirements\nIdentify potential vulnerabilities',
    methodology: 'NIST SP 800-53A Rev 5\nAutomated scanning\nManual testing\nDocument review',
    scope: 'All production systems\nNetwork infrastructure\nAccess controls\nSecurity policies',
    requirements: 'NIST 800-53 Low baseline\nOrganizational security policies\nRegulatory requirements',
    status: 'in-progress',
  },

  scanResults: [
    {
      id: 'scan-001',
      type: 'STIG Scan',
      date: '2025-02-15T10:00:00Z',
      findings: {
        high: 2,
        medium: 5,
        low: 8,
      },
      status: 'Completed',
      downloadUrl: '#',
      detailsUrl: '#',
    },
    {
      id: 'scan-002',
      type: 'SCAP Scan',
      date: '2025-02-01T14:30:00Z',
      findings: {
        high: 1,
        medium: 3,
        low: 6,
      },
      status: 'Completed',
      downloadUrl: '#',
      detailsUrl: '#',
    },
  ],

  controls: [
    {
      id: 'AC-1',
      title: 'Access Control Policy and Procedures',
      status: 'Compliant',
      evidence: 'Access Control Policy v2.1 implemented and reviewed',
      notes: 'Annual review completed',
      lastUpdated: '2025-02-10T09:00:00Z',
    },
    {
      id: 'AC-2',
      title: 'Account Management',
      status: 'Non-Compliant',
      evidence: 'Automated account review process not implemented',
      notes: 'Implementation in progress',
      lastUpdated: '2025-02-11T15:30:00Z',
    },
    {
      id: 'AC-3',
      title: 'Access Enforcement',
      status: 'Compliant',
      evidence: 'Role-based access control implemented',
      notes: 'Verified during testing',
      lastUpdated: '2025-02-12T11:20:00Z',
    },
    {
      id: 'AC-4',
      title: 'Information Flow Enforcement',
      status: 'Not-Applicable',
      evidence: 'System does not process classified information',
      notes: 'Approved deviation',
      lastUpdated: '2025-02-13T14:15:00Z',
    },
  ],

  documents: [
    {
      id: 'doc-001',
      name: 'System Security Plan',
      expirationDate: '2026-02-20',
      lastReviewed: '2025-02-15',
      validationNotes: 'Annual review completed. Updates required for new controls.',
      reviewHistory: [
        {
          date: '2025-02-15',
          notes: 'Annual review completed. Updates required for new controls.',
        },
        {
          date: '2024-02-15',
          notes: 'Initial review completed.',
        },
      ],
    },
    {
      id: 'doc-002',
      name: 'Incident Response Plan',
      expirationDate: '2025-03-15',
      lastReviewed: '2024-03-15',
      validationNotes: 'Review needed before expiration',
      reviewHistory: [
        {
          date: '2024-03-15',
          notes: 'Annual review completed. No major changes required.',
        },
      ],
    },
    {
      id: 'doc-003',
      name: 'Contingency Plan',
      expirationDate: '2025-01-10',
      lastReviewed: '2024-01-10',
      validationNotes: 'Document expired. Immediate review required.',
      reviewHistory: [
        {
          date: '2024-01-10',
          notes: 'Annual review completed. Updated recovery procedures.',
        },
      ],
    },
    {
      id: 'doc-004',
      name: 'Configuration Management Plan',
      expirationDate: '2025-06-30',
      lastReviewed: '2024-06-30',
      validationNotes: 'Current and valid',
      reviewHistory: [
        {
          date: '2024-06-30',
          notes: 'Updated to include new system components.',
        },
      ],
    },
  ],
};

export default mockAssessmentData;