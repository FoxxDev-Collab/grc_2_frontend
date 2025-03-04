import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useTheme,
  Typography,
  Skeleton,
  Divider,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Computer as ComputerIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Shield as ShieldIcon,
  Gavel as GavelIcon,
  Report as ReportIcon,
  AccountTree as AccountTreeIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import TopNavBar from '../components/TopNavBar';
import { clientApi } from '../services';

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 64; // Width when collapsed for system view

const ClientLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { clientId } = useParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if we're in a system route
  const isSystemRoute = location.pathname.includes('/systems/') && location.pathname.split('/').length > 4;
  const currentDrawerWidth = isSystemRoute ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  useEffect(() => {
    const loadClient = async () => {
      try {
        const data = await clientApi.getClient(Number(clientId));
        setClient(data);
        setError('');
      } catch (err) {
        setError('Failed to load client information');
        console.error('Error loading client:', err);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [clientId]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: `/client/${clientId}/dashboard` },
    { text: 'GRC Process', icon: <AccountTreeIcon />, path: `/client/${clientId}/grc-process` },
    { text: 'Assets', icon: <InventoryIcon />, path: `/client/${clientId}/assets` },
    { text: 'Security Assessments', icon: <SecurityIcon />, path: `/client/${clientId}/assessments` },
    { text: 'Audits', icon: <GavelIcon />, path: `/client/${clientId}/audits` },
    { text: 'Security Strategy', icon: <ShieldIcon />, path: `/client/${clientId}/security-strategy` },
    { text: 'ATO Systems', icon: <ComputerIcon />, path: `/client/${clientId}/systems` },
    { text: 'Company', icon: <BusinessIcon />, path: `/client/${clientId}/company` },
    { text: 'Reports', icon: <AssessmentIcon />, path: `/client/${clientId}/reports` },
    { text: 'Incidents', icon: <ReportIcon />, path: `/client/${clientId}/incidents` },
    { text: 'Users', icon: <PeopleIcon />, path: `/client/${clientId}/users` },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        {loading ? (
          <Skeleton variant="text" width={150} height={32} />
        ) : (
          <Box sx={{ py: 1 }}>
            {!isSystemRoute && (
              <>
                <Typography variant="subtitle1" noWrap component="div" sx={{ fontWeight: 'bold' }}>
                  {client?.name || 'Unknown Client'}
                </Typography>
                <Typography variant="caption" color="textSecondary" component="div">
                  {client?.industry || 'Loading...'}
                </Typography>
              </>
            )}
          </Box>
        )}
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: isSystemRoute ? 'center' : 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isSystemRoute ? 0 : 3,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isSystemRoute && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <TopNavBar onDrawerToggle={handleDrawerToggle}>
        {!loading && client && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" noWrap component="div">
              {client.name}
            </Typography>
            <Chip 
              label={`Compliance: ${client.complianceScore}%`}
              color={client.complianceScore >= 80 ? 'success' : client.complianceScore >= 60 ? 'warning' : 'error'}
              size="small"
            />
          </Box>
        )}
      </TopNavBar>
      
      <Box
        component="nav"
        sx={{ 
          width: { sm: currentDrawerWidth }, 
          flexShrink: { sm: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: currentDrawerWidth,
              backgroundColor: theme.palette.background.paper,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: currentDrawerWidth,
              backgroundColor: theme.palette.background.paper,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          backgroundColor: theme.palette.background.default,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar /> {/* Adds spacing below fixed AppBar */}
        {error ? (
          <Box sx={{ mt: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Outlet />
        )}
      </Box>
    </Box>
  );
};

export default ClientLayout;