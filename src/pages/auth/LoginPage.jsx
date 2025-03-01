/* eslint-disable no-undef */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
  useTheme,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../services/hooks/useAuth';

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, loading: authLoading, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Validate password not empty
      if (!formData.password.trim()) {
        throw new Error('Password cannot be empty');
      }
      
      await login(formData);
      
      // If login is successful and remember me is checked, store email in localStorage
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      navigate('/system/dashboard');
    } catch (err) {
      setLoginAttempts(prev => prev + 1);
      setError(err.message || 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email if it exists
  useState(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Use either local error state or auth error from hook
  const displayError = error || authError;
  // Use either local loading state or auth loading from hook
  const isLoading = loading || authLoading;

  // Show rate limiting warning after 3 failed attempts
  const showRateLimitWarning = loginAttempts >= 3;

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            width: '100%', 
            borderRadius: 2,
            background: theme.palette.mode === 'dark' 
              ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[900]})`
              : `linear-gradient(145deg, #ffffff, ${theme.palette.grey[50]})`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                bgcolor: theme.palette.primary.main,
                borderRadius: '50%',
                p: 1.5,
                mb: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: theme.shadows[3],
              }}
            >
              <LockOutlinedIcon fontSize="medium" sx={{ color: '#fff' }} />
            </Box>
            <Typography component="h1" variant="h4" align="center" gutterBottom fontWeight="bold">
              GRC System
            </Typography>
            <Typography component="h2" variant="subtitle1" align="center" color="textSecondary">
              Please sign in to continue
            </Typography>
          </Box>
          
          {displayError && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 1,
                '& .MuiAlert-icon': {
                  alignItems: 'center',
                },
              }}
            >
              {displayError}
            </Alert>
          )}
          
          {showRateLimitWarning && !displayError && (
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 3,
                borderRadius: 1,
              }}
            >
              Multiple failed login attempts detected. After 5 failed attempts, your account may be temporarily locked.
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus={!formData.email}
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              sx={{ 
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                }
              }}
              InputProps={{
                sx: { pl: 1.5, pr: 1.5 }
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              sx={{ 
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                }
              }}
              InputProps={{
                sx: { pl: 1.5, pr: 1.5 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2, mt: 0.5 }}>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)} 
                      color="primary" 
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Remember me
                    </Typography>
                  }
                />
              </Grid>
              <Grid item>
                <Link 
                  to="/forgot-password" 
                  style={{ 
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                  }}
                >
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ 
                mt: 1.5, 
                mb: 3, 
                py: 1.5,
                fontSize: '1rem',
                borderRadius: 1.5,
                boxShadow: theme.shadows[4],
                background: theme.palette.mode === 'dark' 
                  ? `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                  : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                '&:hover': {
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
            
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Need help?
              </Typography>
            </Divider>
            
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  to="/contact-support"
                  sx={{ 
                    borderRadius: 1.5,
                    py: 1,
                  }}
                >
                  Contact Support
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  component={Link}
                  to="/documentation"
                  sx={{ 
                    borderRadius: 1.5,
                    py: 1,
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  Documentation
                </Button>
              </Grid>
            </Grid>
            
            {/* Developer access replaced with a more secure approach */}
            {process.env.NODE_ENV === 'development' && (
              <Box 
                sx={{
                  mt: 4,
                  p: 2,
                  bgcolor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.03)',
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" color="textSecondary" align="center" display="block">
                  For testing in development environment only
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;