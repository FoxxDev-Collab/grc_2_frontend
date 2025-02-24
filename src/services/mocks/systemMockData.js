// Enum definitions
export const SystemStatus = {
  DRAFT: 'DRAFT',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
};

export const ATOStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  EXPIRED: 'EXPIRED'
};

export const SecurityLevel = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high'
};

export const InformationLevel = {
  PUBLIC: 'public',
  INTERNAL: 'internal',
  CONFIDENTIAL: 'confidential',
  RESTRICTED: 'restricted'
};

export const SystemCategory = {
  MISSION_CRITICAL: 'Mission Critical',
  BUSINESS_CRITICAL: 'Business Critical',
  BUSINESS_OPERATIONAL: 'Business Operational',
  BUSINESS_SUPPORT: 'Business Support'
};

// Mock data arrays
export const mockSystemTypes = [
  'Major Application',
  'General Support System',
  'Minor Application',
  'Other'
];

export const mockNetworkTypes = [
  'LAN',
  'WAN',
  'VPN',
  'Cloud',
  'Hybrid'
];

export const mockComponentTypes = [
  'Server',
  'Database',
  'Application',
  'Network Device',
  'Security Appliance'
];

export const mockProcedureTypes = [
  'Backup',
  'Recovery',
  'Maintenance',
  'Security',
  'Compliance'
];

export const mockCommonPorts = [
  { port: 80, service: 'HTTP' },
  { port: 443, service: 'HTTPS' },
  { port: 22, service: 'SSH' },
  { port: 3306, service: 'MySQL' },
  { port: 5432, service: 'PostgreSQL' }
];

export const mockSystems = [
  {
    id: "sys-001",  // Changed from 1 to match the format used in createSystem
    clientId: 1,
    name: "Core Banking Platform",
    type: "Major Application",
    category: SystemCategory.MISSION_CRITICAL,
    securityLevel: SecurityLevel.HIGH,
    informationLevel: InformationLevel.CONFIDENTIAL,
    status: SystemStatus.IN_PROGRESS,
    atoStatus: ATOStatus.IN_PROGRESS,
    currentPhase: "initial_assessment",
    createdAt: "2025-02-20T10:00:00Z",
    updatedAt: "2025-02-20T10:30:00Z",
    lastAssessment: null,
    phaseProgress: {
      "initial-assessment": 65,
      "system-categorization": 30,
      "security-controls": 10,
      "assessment": 0,
      "ato-authorization": 0,
      "continuous-monitoring": 0
    },
    phases: {
      initialAssessment: {
        discovery: {
          status: "in_progress",
          completedItems: [
            "System inventory",
            "System purpose documentation"
          ],
          pendingItems: [
            "Data flow mapping",
            "System boundaries"
          ]
        },
        gapAnalysis: {
          status: "in_progress",
          completedItems: [
            "Current state assessment"
          ],
          pendingItems: [
            "Control gap identification",
            "Security practice review"
          ]
        },
        environment: {
          status: "completed",
          details: {
            hosting: "Hybrid",
            components: ["Web Servers", "Database Clusters", "Load Balancers"]
          }
        },
        stakeholders: {
          status: "not_started",
          identified: [],
          pending: ["System Owner", "Security Officer", "Operations Team"]
        }
      },
      systemCategorization: {
        infoTypes: {
          status: "in_progress",
          identified: [
            "Customer Data",
            "Transaction Records"
          ],
          pending: [
            "Audit Logs",
            "Configuration Data"
          ]
        },
        impact: {
          status: "not_started",
          assessments: {
            confidentiality: null,
            integrity: null,
            availability: null
          }
        },
        objectives: {
          status: "not_started",
          defined: [],
          pending: [
            "Data Protection Goals",
            "System Availability Targets",
            "Compliance Requirements"
          ]
        }
      },
      securityControls: {
        baseline: {
          status: "not_started",
          selected: null,
          rationale: null
        },
        tailoring: {
          status: "not_started",
          completedControls: [],
          pendingControls: []
        },
        implementation: {
          status: "not_started",
          implemented: [],
          pending: []
        },
        documentation: {
          status: "not_started",
          completed: [],
          pending: [
            "Security Policies",
            "Procedures",
            "Training Materials"
          ]
        }
      },
      assessment: {
        planning: {
          status: "not_started",
          completed: [],
          pending: [
            "Assessment Plan",
            "Test Procedures",
            "Tool Selection"
          ]
        },
        testing: {
          status: "not_started",
          completed: [],
          pending: [
            "Vulnerability Scans",
            "Penetration Tests",
            "Control Testing"
          ]
        },
        review: {
          status: "not_started",
          completed: [],
          pending: [
            "Documentation Review",
            "Evidence Validation",
            "Findings Documentation"
          ]
        }
      },
      authorization: {
        riskAssessment: {
          status: "not_started",
          completed: [],
          pending: [
            "Risk Analysis",
            "Mitigation Planning",
            "Residual Risk Assessment"
          ]
        },
        package: {
          status: "not_started",
          completed: [],
          pending: [
            "Package Assembly",
            "Documentation Review",
            "Executive Summary"
          ]
        },
        decision: {
          status: "not_started",
          result: null,
          conditions: []
        }
      },
      continuousMonitoring: {
        program: {
          status: "not_started",
          defined: [],
          pending: [
            "Monitoring Strategy",
            "Metrics Definition",
            "Reporting Requirements"
          ]
        },
        assessment: {
          status: "not_started",
          completed: [],
          pending: [
            "Control Effectiveness",
            "Metric Collection",
            "Risk Updates"
          ]
        },
        maintenance: {
          status: "not_started",
          completed: [],
          pending: [
            "System Updates",
            "Documentation Maintenance",
            "Training Updates"
          ]
        }
      }
    },
    components: [],
    networks: [],
    ports: [],
    procedures: [],
    artifacts: [],
    boundaries: {
      physical: [],
      network: [],
      security: []
    },
    compliance: {
      nist: 0,
      hipaa: 0,
      pci: 0
    }
  }
];

export const getSystem = (clientId, systemId) => {
  return mockSystems.find(s => s.clientId === clientId && s.id === systemId) || null;
};

export const updateSystem = (clientId, systemId, updates) => {
  const index = mockSystems.findIndex(s => s.clientId === clientId && s.id === systemId);
  if (index !== -1) {
    mockSystems[index] = { ...mockSystems[index], ...updates };
    return mockSystems[index];
  }
  return null;
};

export const updatePhaseStatus = (clientId, systemId, phase, status) => {
  const system = getSystem(clientId, systemId);
  if (system && system.phases[phase]) {
    system.phases[phase].status = status;
    return system;
  }
  return null;
};