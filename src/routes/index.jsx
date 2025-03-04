// Import Auth Pages/Components
import LoginPage from '../pages/auth/LoginPage';

// Import Client User Pages
import { Navigate, createBrowserRouter } from 'react-router-dom';
import SystemLayout from '../layouts/SystemLayout';
import ClientLayout from '../layouts/ClientLayout';
import DashboardPage from '../pages/client/DashboardPage';
import SystemsManagementPage from '../pages/client/SystemsManagementPage';
import SecurityAssessmentsPage from '../pages/client/SecurityAssessmentsPage';
import AuditsPage from '../pages/client/AuditsPage';
import UsersManagementPage from '../pages/client/UsersManagementPage';
import CompanyStructurePage from '../pages/client/CompanyStructurePage';
import SecurityStrategyPage from '../pages/client/SecurityStrategyPage';
import IncidentsPage from '../pages/client/IncidentsPage';
import GRCProcessPage from '../pages/client/GRCProcessPage';
import AssetManagementPage from '../pages/client/AssetManagementPage';
import ExecutiveDashboard from '../components/reporting/ExecutiveDashboard';
import PropTypes from 'prop-types';


// Import GRC User pages
import CreateClientPage from '../pages/grc_system/CreateClientPage';
import ClientManagementPage from '../pages/grc_system/ClientManagementPage';
import GRCUsersManagementPage from '../pages/grc_system/GRCUsersManagementPage';
import SettingsPage from '../pages/grc_system/SettingsPage';
import GRCDashboard from '../pages/grc_system/GRCDashboard';
import GRCSystemLayout from '../layouts/GRCSystemLayout';
import NISTGuidePage from '../pages/grc_system/NISTGuidePage';

// Import new phase-based pages
import Initial_AssessmentPage from '../pages/system/Initial_AssessmentPage';
import System_CategorizationPage from '../pages/system/System_CategorizationPage';
import Security_ControlsPage from '../pages/system/Security_ControlsPage';
import AssessmentPage from '../pages/system/AssessmentPage';
import ATO_AuthorizationPage from '../pages/system/ATO_AuthorizationPage';
import Continuous_MonitoringPage from '../pages/system/Continuous_MonitoringPage';
import SystemDashboard from '../pages/system/SystemDashboard';
import ATOProcessPage from '../pages/system/ATOProcessPage';
import ArtifactsPage from '../pages/system/ArtifactsPage';

// Import new Security Controls pages
import ControlsOverviewPage from '../pages/system/ControlsOverviewPage';
import ControlsBaselinePage from '../pages/system/ControlsBaselinePage';
import ControlsDetailsPage from '../pages/system/ControlsDetailsPage';
import ControlsImplementationPage from '../pages/system/ControlsImplementationPage';


// Import auth API
import authApi from '../services/api/grc/AuthApi';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  if (!authApi.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/system',
    element: (
      <ProtectedRoute>
        <GRCSystemLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <GRCDashboard />,
      },
      {
        path: 'clients',
        element: <ClientManagementPage />,
      },
      {
        path: 'grc-users',
        element: <GRCUsersManagementPage />,
      },
      {
        path: 'create-client',
        element: <CreateClientPage />,
      },
      {
        path: 'profile',
        element: <div>Profile Page (Coming Soon)</div>,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'nist-guide',
        element: <NISTGuidePage />,
      }
    ],
  },
  {
    path: '/client/:clientId',
    element: (
      <ProtectedRoute>
        <ClientLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'grc-process',
        element: <GRCProcessPage />,
      },
      {
        path: 'systems',
        element: <SystemsManagementPage />,
      },
      {
        path: 'assets',
        element: <AssetManagementPage />,
      },
      {
        path: 'assessments',
        element: <SecurityAssessmentsPage />,
      },
      {
        path: 'audits',
        element: <AuditsPage />,
      },
      {
        path: 'incidents',
        element: <IncidentsPage />,
      },
      {
        path: 'users',
        element: <UsersManagementPage />,
      },
      {
        path: 'company',
        element: <CompanyStructurePage />,
      },
      {
        path: 'security-strategy',
        element: <SecurityStrategyPage />,
      },
      {
        path: 'reports',
        element: <ExecutiveDashboard />,
      },
      {
        path: 'systems/:systemId',
        element: (
          <ProtectedRoute>
            <SystemLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <SystemDashboard />,
          },
          {
            path: 'ato-process',
            element: <ATOProcessPage />,
          },
          {
            path: 'initial-assessment',
            element: <Initial_AssessmentPage />,
          },
          {
            path: 'system-categorization',
            element: <System_CategorizationPage />,
          },
          {
            path: 'security-controls',
            element: <Security_ControlsPage />,
          },
          {
            path: 'security-controls/overview',
            element: <ControlsOverviewPage />,
          },
          {
            path: 'security-controls/baseline',
            element: <ControlsBaselinePage />,
          },
          {
            path: 'security-controls/details',
            element: <ControlsDetailsPage />,
          },
          {
            path: 'security-controls/implementation',
            element: <ControlsImplementationPage />,
          },
          {
            path: 'artifacts',
            element: <ArtifactsPage />,
          },
          {
            path: 'assessment',
            element: <AssessmentPage />,
          },
          {
            path: 'ato-authorization',
            element: <ATO_AuthorizationPage />,
          },
          {
            path: 'continuous-monitoring',
            element: <Continuous_MonitoringPage />,
          },
        ],
      },
    ],
  },
]);

export default router;