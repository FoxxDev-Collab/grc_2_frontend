import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  CardActionArea,
  Chip,
} from '@mui/material';
import { clientApi } from '../../services';

const GRCDashboard = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const clientData = await clientApi.getClients();
        setClients(clientData);
        setError('');
      } catch (err) {
        setError(err.message);
        console.error('Error loading clients:', err);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  const handleClientClick = (clientId) => {
    navigate(`/client/${clientId}/dashboard`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Greeting Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to GRC System
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>
      </Paper>

      {/* Client List */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Available Clients
      </Typography>
      <Grid container spacing={3}>
        {clients.map((client) => (
          <Grid item xs={12} sm={6} md={4} key={client.id}>
            <Card>
              <CardActionArea onClick={() => handleClientClick(client.id)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {client.name}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {client.industry}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      size="small"
                      label={client.status?.toUpperCase()}
                      color={getStatusColor(client.status)}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Compliance: {client.complianceScore}%
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default GRCDashboard;