import { useState, useEffect } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton,
  Typography,
  Divider,
  IconButton,
  Stack,
  useTheme,
  Skeleton,
  Drawer,
  Collapse,
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Assignment as InitialAssessmentIcon,
  Category as CategorizationIcon,
  Security as ControlsIcon,
  Assessment as AssessmentIcon,
  Verified as AuthorizationIcon,
  MonitorHeart as MonitoringIcon,
  ArrowBack as ArrowBackIcon,
  AccountTree as ProcessIcon,
  Folder as ArtifactsIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  ViewList as OverviewIcon,
  Tune as BaselineIcon,
  ListAlt as DetailsIcon,
  Build as ImplementationIcon,
} from '@mui/icons-material';
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { systemApi } from '../services';

const DRAWER_WIDTH = 240;

const SystemLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { clientId, systemId } = useParams();
  const [selectedPath, setSelectedPath] = useState(location.pathname);
  const [system, setSystem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [securityControlsOpen, setSecurityControlsOpen] = useState(false);

  useEffect(() => {
    const loadSystem = async () => {
      try {
        const systemData = await systemApi.getSystem(Number(clientId), systemId);
        setSystem(systemData);
        setError('');
      } catch (err) {
        setError('Failed to load system information');
        console.error('Error loading system:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSystem();
  }, [clientId, systemId]);

  useEffect(() => {
    setSelectedPath(location.pathname);
    // Check if we're in any security controls sub-route
    if (location.pathname.includes('/security-controls')) {
      setSecurityControlsOpen(true);
    }
  }, [location]);

  const navigationItems = [
    {
      title: 'Overview',
      icon: <DashboardIcon />,
      path: `/client/${clientId}/systems/${systemId}`,
    },
    {
      title: 'ATO Process',
      icon: <ProcessIcon />,
      path: `/client/${clientId}/systems/${systemId}/ato-process`,
    },
    {
      title: 'Initial Assessment',
      icon: <InitialAssessmentIcon />,
      path: `/client/${clientId}/systems/${systemId}/initial-assessment`,
    },
    {
      title: 'System Categorization',
      icon: <CategorizationIcon />,
      path: `/client/${clientId}/systems/${systemId}/system-categorization`,
    },
    {
      title: 'Security Controls',
      icon: <ControlsIcon />,
      path: `/client/${clientId}/systems/${systemId}/security-controls`,
      children: [
        {
          title: 'Overview',
          icon: <OverviewIcon />,
          path: `/client/${clientId}/systems/${systemId}/security-controls/overview`,
        },
        {
          title: 'Baseline Selection',
          icon: <BaselineIcon />,
          path: `/client/${clientId}/systems/${systemId}/security-controls/baseline`,
        },
        {
          title: 'Control Details',
          icon: <DetailsIcon />,
          path: `/client/${clientId}/systems/${systemId}/security-controls/details`,
        },
        {
          title: 'Implementation',
          icon: <ImplementationIcon />,
          path: `/client/${clientId}/systems/${systemId}/security-controls/implementation`,
        },
      ],
    },
    {
      title: 'Artifacts',
      icon: <ArtifactsIcon />,
      path: `/client/${clientId}/systems/${systemId}/artifacts`,
    },
    {
      title: 'Assessment',
      icon: <AssessmentIcon />,
      path: `/client/${clientId}/systems/${systemId}/assessment`,
    },
    {
      title: 'ATO Authorization',
      icon: <AuthorizationIcon />,
      path: `/client/${clientId}/systems/${systemId}/ato-authorization`,
    },
    {
      title: 'Continuous Monitoring',
      icon: <MonitoringIcon />,
      path: `/client/${clientId}/systems/${systemId}/continuous-monitoring`,
    },
  ];

  const handleSecurityControlsClick = () => {
    setSecurityControlsOpen(!securityControlsOpen);
  };

  const drawerContent = (
    <>
      <Box sx={{ p: 1 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              edge="start" 
              onClick={() => navigate(`/client/${clientId}/systems`)}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Back to Systems
            </Typography>
          </Box>
          {loading ? (
            <Skeleton variant="text" width={150} height={32} />
          ) : (
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                fontWeight: 500,
                color: 'primary.main',
              }}
            >
              {system?.name || 'Unknown System'}
            </Typography>
          )}
        </Stack>
      </Box>
      <Divider />
      <List sx={{ overflowY: 'auto', height: 'calc(100% - 140px)' }}>
        <ListItem sx={{ py: 2 }}>
          <Typography variant="h6" component="div">
            System Management
          </Typography>
        </ListItem>
        <Divider />
        {navigationItems.map((item) => (
          <Box key={item.path}>
            <ListItem disablePadding>
              <ListItemButton
                selected={!item.children && selectedPath === item.path}
                onClick={item.children ? handleSecurityControlsClick : () => navigate(item.path)}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
                {item.children && (
                  securityControlsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />
                )}
              </ListItemButton>
            </ListItem>
            {item.children && (
              <Collapse in={securityControlsOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.path}
                      selected={selectedPath === child.path}
                      onClick={() => navigate(child.path)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon>{child.icon}</ListItemIcon>
                      <ListItemText primary={child.title} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ 
          width: DRAWER_WIDTH,
          flexShrink: 0,
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              height: 'calc(100vh - 64px)',
              top: 64,
              borderRight: 1,
              borderColor: 'divider',
              backgroundColor: theme.palette.background.paper,
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          backgroundColor: theme.palette.background.default,
          mt: '12px',
        }}
      >
        {error ? (
          <Typography color="error">
            {error}
          </Typography>
        ) : (
          <Outlet />
        )}
      </Box>
    </Box>
  );
};

export default SystemLayout;
