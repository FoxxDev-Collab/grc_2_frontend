// User roles enum
export const USER_ROLES = {
  PROGRAM_MANAGER: 'PROGRAM_MANAGER',
  ISSM: 'ISSM',
  ISSO: 'ISSO',
  ISSE: 'ISSE',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN'
};

// Role-based permissions
export const ROLE_PERMISSIONS = {
  [USER_ROLES.PROGRAM_MANAGER]: ['manage_users', 'manage_systems', 'view_audits', 'manage_strategy'],
  [USER_ROLES.ISSM]: ['manage_users', 'manage_systems', 'manage_audits', 'manage_strategy'],
  [USER_ROLES.ISSO]: ['view_users', 'manage_systems', 'manage_audits'],
  [USER_ROLES.ISSE]: ['view_users', 'view_systems', 'view_audits'],
  [USER_ROLES.SYSTEM_ADMIN]: ['all']
};

// Available permissions
export const AVAILABLE_PERMISSIONS = [
  'manage_users',
  'view_users',
  'manage_systems',
  'view_systems',
  'manage_audits',
  'view_audits',
  'manage_strategy',
  'all'
];

// Mock user data
export const mockUsers = [
  {
    id: 1,
    username: 'john.smith',
    email: 'john.smith@acme.com',
    role: USER_ROLES.PROGRAM_MANAGER,
    clientId: 'client-1',
    firstName: 'John',
    lastName: 'Smith',
    title: 'Program Manager',
    department: 'Security',
    phone: '(555) 123-4567',
    isActive: true,
    lastActive: '2024-02-19T10:00:00Z',
    permissions: ROLE_PERMISSIONS[USER_ROLES.PROGRAM_MANAGER]
  },
  {
    id: 2,
    username: 'sarah.johnson',
    email: 'sarah.johnson@acme.com',
    role: USER_ROLES.ISSM,
    clientId: 'client-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    title: 'Information System Security Manager',
    department: 'Security',
    phone: '(555) 234-5678',
    isActive: true,
    lastActive: '2024-02-19T09:00:00Z',
    permissions: ROLE_PERMISSIONS[USER_ROLES.ISSM]
  },
  {
    id: 3,
    username: 'mike.wilson',
    email: 'mike.wilson@acme.com',
    role: USER_ROLES.ISSO,
    clientId: 'client-1',
    firstName: 'Mike',
    lastName: 'Wilson',
    title: 'Information System Security Officer',
    department: 'IT',
    phone: '(555) 345-6789',
    isActive: true,
    lastActive: '2024-02-19T08:00:00Z',
    permissions: ROLE_PERMISSIONS[USER_ROLES.ISSO]
  },
  {
    id: 4,
    username: 'alice.brown',
    email: 'alice.brown@healthcareplus.com',
    role: USER_ROLES.PROGRAM_MANAGER,
    clientId: 'client-2',
    firstName: 'Alice',
    lastName: 'Brown',
    title: 'Security Program Manager',
    department: 'Security',
    phone: '(555) 456-7890',
    isActive: true,
    lastActive: '2024-02-19T11:00:00Z',
    permissions: ROLE_PERMISSIONS[USER_ROLES.PROGRAM_MANAGER]
  },
  {
    id: 5,
    username: 'admin',
    email: 'admin@grc.com',
    role: USER_ROLES.SYSTEM_ADMIN,
    clientId: null,
    firstName: 'System',
    lastName: 'Administrator',
    title: 'System Administrator',
    department: 'IT',
    phone: '(555) 999-9999',
    isActive: true,
    lastActive: '2024-02-19T12:00:00Z',
    permissions: ROLE_PERMISSIONS[USER_ROLES.SYSTEM_ADMIN]
  }
];

// User departments
export const mockDepartments = [
  'Security',
  'IT',
  'Compliance',
  'Risk Management',
  'Operations',
  'Executive'
];

// User titles
export const mockTitles = [
  'Program Manager',
  'Information System Security Manager',
  'Information System Security Officer',
  'Security Engineer',
  'System Administrator',
  'Security Analyst',
  'Compliance Officer',
  'Risk Manager'
];

// User status options
export const mockUserStatus = [
  'active',
  'inactive',
  'suspended',
  'pending'
];