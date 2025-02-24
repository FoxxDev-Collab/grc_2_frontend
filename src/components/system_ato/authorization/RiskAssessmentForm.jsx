import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const RiskAssessmentForm = ({ assessmentResults, onPromoteToPOAM }) => {
  const [nonCompliantItems, setNonCompliantItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [poamDetails, setPOAMDetails] = useState({
    mitigationPlan: '',
    targetDate: '',
    riskLevel: 'MEDIUM',
    responsibleParty: '',
    status: 'OPEN'
  });

  useEffect(() => {
    if (assessmentResults) {
      const nonCompliant = assessmentResults.filter(
        (item) => item.status === 'Non-Compliant'
      );
      setNonCompliantItems(nonCompliant);
    }
  }, [assessmentResults]);

  const handlePromoteToPOAM = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedItem(null);
    setPOAMDetails({
      mitigationPlan: '',
      targetDate: '',
      riskLevel: 'MEDIUM',
      responsibleParty: '',
      status: 'OPEN'
    });
  };

  const handlePOAMSubmit = () => {
    const poamItem = {
      ...selectedItem,
      ...poamDetails,
      dateCreated: new Date().toISOString(),
      type: 'POAM',
    };
    onPromoteToPOAM(poamItem);
    handleDialogClose();
  };

  const getRiskLevelColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Risk Assessment
      </Typography>
      
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Non-Compliant Controls
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Control ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Finding</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nonCompliantItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.controlId}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.finding}</TableCell>
                  <TableCell>
                    <Chip
                      icon={<WarningIcon />}
                      label={item.riskLevel}
                      color={getRiskLevelColor(item.riskLevel)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handlePromoteToPOAM(item)}
                    >
                      Promote to POA&M
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Create POA&M Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Control: {selectedItem?.controlId} - {selectedItem?.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Mitigation Plan"
                value={poamDetails.mitigationPlan}
                onChange={(e) => setPOAMDetails({ ...poamDetails, mitigationPlan: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Target Completion Date"
                InputLabelProps={{ shrink: true }}
                value={poamDetails.targetDate}
                onChange={(e) => setPOAMDetails({ ...poamDetails, targetDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Risk Level</InputLabel>
                <Select
                  value={poamDetails.riskLevel}
                  label="Risk Level"
                  onChange={(e) => setPOAMDetails({ ...poamDetails, riskLevel: e.target.value })}
                >
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Responsible Party"
                value={poamDetails.responsibleParty}
                onChange={(e) => setPOAMDetails({ ...poamDetails, responsibleParty: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button 
            onClick={handlePOAMSubmit}
            variant="contained"
            disabled={!poamDetails.mitigationPlan || !poamDetails.targetDate || !poamDetails.responsibleParty}
          >
            Create POA&M
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

RiskAssessmentForm.propTypes = {
  assessmentResults: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      controlId: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      finding: PropTypes.string.isRequired,
      riskLevel: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ),
  onPromoteToPOAM: PropTypes.func.isRequired,
};

export default RiskAssessmentForm;