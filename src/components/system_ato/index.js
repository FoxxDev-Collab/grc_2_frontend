/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';

// Component exports
export { default as PhaseHeader } from './PhaseHeader';
export { default as TabPanel } from './TabPanel';
export { default as StatusChip } from './StatusChip';

// Authorization components
export {
  RiskAssessmentForm,
  PackagePreparationForm,
  AuthorizationDecisionForm,
} from './authorization';

// Common prop types for ATO components
export const atoComponentProps = {
  phase: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }),
  system: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    securityLevel: PropTypes.string.isRequired,
    currentPhase: PropTypes.string.isRequired,
  }),
};

// ATO-specific constants
export const ATO_PHASES = {
  INITIAL_ASSESSMENT: 'initial-assessment',
  SYSTEM_CATEGORIZATION: 'system-categorization',
  SECURITY_CONTROLS: 'security-controls',
  ASSESSMENT: 'assessment',
  AUTHORIZATION: 'ato-authorization',
  CONTINUOUS_MONITORING: 'continuous-monitoring',
};

export const ATO_STATUS = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'in_progress',
  NOT_STARTED: 'not_started',
  APPROVED: 'approved',
  DENIED: 'denied',
  EXPIRED: 'expired',
};

// ATO utility functions
export const getPhaseProgress = (phase, system) => {
  return system?.phaseProgress?.[phase] || 0;
};

export const getPhaseStatus = (phase, system) => {
  const progress = getPhaseProgress(phase, system);
  if (progress >= 100) return ATO_STATUS.COMPLETED;
  if (progress > 0) return ATO_STATUS.IN_PROGRESS;
  return ATO_STATUS.NOT_STARTED;
};

export const getStatusColor = (status) => {
  const normalizedStatus = status.toLowerCase();
  if ([ATO_STATUS.COMPLETED, ATO_STATUS.APPROVED].includes(normalizedStatus)) {
    return 'success';
  }
  if ([ATO_STATUS.IN_PROGRESS, ATO_STATUS.EXPIRED].includes(normalizedStatus)) {
    return 'warning';
  }
  if (normalizedStatus === ATO_STATUS.DENIED) {
    return 'error';
  }
  return 'default';
};

export const formatPhaseTitle = (phase) => {
  return phase
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Phase-specific utilities
export const getRequiredDocuments = (phase) => {
  switch (phase) {
    case ATO_PHASES.INITIAL_ASSESSMENT:
      return ['System Inventory', 'Gap Analysis Report', 'Environment Documentation'];
    case ATO_PHASES.SYSTEM_CATEGORIZATION:
      return ['Information Types List', 'Impact Analysis Report', 'Security Objectives'];
    case ATO_PHASES.SECURITY_CONTROLS:
      return ['Security Control Baseline', 'Implementation Plan', 'System Security Plan'];
    case ATO_PHASES.ASSESSMENT:
      return ['Assessment Plan', 'Test Results', 'Assessment Report'];
    case ATO_PHASES.AUTHORIZATION:
      return ['Risk Assessment', 'POA&M', 'Authorization Package'];
    case ATO_PHASES.CONTINUOUS_MONITORING:
      return ['Monitoring Plan', 'Status Reports', 'Change Management Log'];
    default:
      return [];
  }
};