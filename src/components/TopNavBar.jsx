import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  useTheme,
  Divider,
  Chip,
} from '@mui/material';
import {
  AccountCircle,
  Brightness4,
  Brightness7,
  Settings,
  Home,
  ExitToApp,
  Menu as MenuIcon,
  People,
  Business,
  BookOnlineOutlined,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../context/ThemeContext';

const TopNavBar = ({ children, onDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isDarkMode, onThemeToggle } = useCustomTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const isSystemDashboard = location.pathname === '/system/dashboard';
  const isClientView = location.pathname.includes('/client/');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/system/profile');
  };

  const handleSettingsClick = () => {
    handleClose();
    navigate('/system/settings');
  };

  const handleHomeClick = () => {
    navigate('/system/dashboard');
  };

  const handleGRCUsersClick = () => {
    navigate('/system/grc-users');
  };

  const handleClientsClick = () => {
    navigate('/system/clients');
  };

  const handleNISTGuideClick = () => {
    navigate('/system/nist-guide');
  }

  return (
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {isClientView && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo/Title Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: isClientView ? 'pointer' : 'default',
              '&:hover': isClientView ? { opacity: 0.8 } : {},
            }}
            onClick={isClientView ? handleHomeClick : undefined}
          >
            GRC System
          </Typography>
          
          {currentUser && (
            <Chip
              label={currentUser.role.replace(/_/g, ' ')}
              size="small"
              sx={{ ml: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            />
          )}
          
          {/* Divider when showing client info */}
          {children && (
            <>
              <Divider 
                orientation="vertical" 
                flexItem 
                sx={{ 
                  mx: 2, 
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  height: '24px',
                  my: 'auto',
                }} 
              />
              {children}
            </>
          )}
        </Box>

        {/* Navigation Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isSystemDashboard && (
            <Button
              color="inherit"
              startIcon={<Home />}
              onClick={handleHomeClick}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Dashboard
            </Button>
          )}

          {/* GRC Users Management - Only visible for Senior AOs */}
          {currentUser?.role === 'SENIOR_AO' && (
            <Button
              color="inherit"
              startIcon={<People />}
              onClick={handleGRCUsersClick}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              GRC Users
            </Button>
          )}

          {/* Clients Management */}
          <Button
            color="inherit"
            startIcon={<BookOnlineOutlined />}
            onClick={handleNISTGuideClick}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            NIST Guide
          </Button>

          {/* Clients Management */}
          <Button
            color="inherit"
            startIcon={<Business />}
            onClick={handleClientsClick}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Clients
          </Button>

          {/* Settings */}
          <Button
            color="inherit"
            startIcon={<Settings />}
            onClick={handleSettingsClick}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Settings
          </Button>

          {/* Theme Toggle */}
          <IconButton 
            color="inherit" 
            onClick={onThemeToggle}
            sx={{ ml: { xs: 1, sm: 2 } }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            edge="end"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

TopNavBar.propTypes = {
  children: PropTypes.node,
  onDrawerToggle: PropTypes.func,
};

TopNavBar.defaultProps = {
  children: null,
  onDrawerToggle: () => {},
};

export default TopNavBar;