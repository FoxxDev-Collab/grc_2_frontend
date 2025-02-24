export const mockComponents = [
  {
    id: '1',
    type: 'PHYSICAL',
    name: 'Primary Database Server',
    description: 'Main database server hosting customer data',
    specifications: {
      manufacturer: 'Dell',
      model: 'PowerEdge R740',
      cpu: 'Intel Xeon Gold 6248R',
      ram: '384GB',
      storage: '4TB SSD RAID-10'
    },
    status: 'ACTIVE',
    lastUpdated: '2024-02-19T10:00:00Z'
  },
  {
    id: '2',
    type: 'VIRTUAL',
    name: 'Web Application Server',
    description: 'Primary web application server',
    specifications: {
      os: 'Ubuntu 22.04 LTS',
      vcpus: 8,
      ram: '32GB',
      storage: '500GB'
    },
    status: 'ACTIVE',
    lastUpdated: '2024-02-19T10:00:00Z'
  },
  {
    id: '3',
    type: 'NETWORK',
    name: 'Core Switch',
    description: 'Primary network switch for data center',
    specifications: {
      manufacturer: 'Cisco',
      model: 'Catalyst 9300',
      ports: '48x 10GbE',
      throughput: '960 Gbps'
    },
    status: 'ACTIVE',
    lastUpdated: '2024-02-19T10:00:00Z'
  }
];

export const mockComponentTypes = [
  'PHYSICAL',
  'VIRTUAL',
  'NETWORK',
  'SECURITY_APPLIANCE'
];

export const mockComponentStatuses = [
  'ACTIVE',
  'INACTIVE',
  'MAINTENANCE',
  'DECOMMISSIONED'
];

// Helper to generate unique IDs (moved from API file)
export const generateMockId = () => Math.random().toString(36).substr(2, 9);