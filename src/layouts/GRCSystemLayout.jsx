import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';

const SystemLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TopNavBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <Toolbar /> {/* Adds spacing below fixed AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default SystemLayout; 