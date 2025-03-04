/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  CloudUpload as UploadIcon,
  GetApp as DownloadIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useCompanyStructure } from '../../components/company_structure';

const CompanyDocumentsPage = () => {
  const { clientId } = useParams();
  const {
    documents,
    loading,
    error,
    uploadDocument,
    downloadDocument,
  } = useCompanyStructure(clientId);

  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  // Handle category change
  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setCategory(newCategory);
      filterDocuments(newCategory, searchQuery);
    }
  };

  // Handle search
  const handleSearch = () => {
    filterDocuments(category, searchQuery);
  };

  // Handle search input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter documents based on category and search query
  const filterDocuments = (cat, query) => {
    let filtered = [...documents];
    
    // Filter by category
    if (cat && cat !== 'all') {
      filtered = filtered.filter(doc => doc.category === cat);
    }
    
    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(lowerQuery) || 
        doc.description?.toLowerCase().includes(lowerQuery) ||
        doc.category?.toLowerCase().includes(lowerQuery)
      );
    }
    
    setFilteredDocuments(filtered);
  };

  // Handle file upload
  const handleUploadDocument = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadDocument(file);
    }
  };

  // Initialize filtered documents when documents change
  useState(() => {
    if (documents) {
      setFilteredDocuments(documents);
    }
  }, [documents]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Document Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          component="label"
        >
          Upload Document
          <input
            type="file"
            hidden
            onChange={handleUploadDocument}
          />
        </Button>
      </Paper>

      {/* Document Categories */}
      <Paper sx={{ p: 1, mb: 3 }}>
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={handleCategoryChange}
          aria-label="document category"
          sx={{ display: 'flex', flexWrap: 'wrap' }}
        >
          <ToggleButton value="all" aria-label="all documents" sx={{ borderRadius: '15px', m: 0.5 }}>
            All Documents
          </ToggleButton>
          <ToggleButton value="policy" aria-label="policies" sx={{ borderRadius: '15px', m: 0.5 }}>
            Policies
          </ToggleButton>
          <ToggleButton value="procedure" aria-label="procedures" sx={{ borderRadius: '15px', m: 0.5 }}>
            Procedures
          </ToggleButton>
          <ToggleButton value="template" aria-label="templates" sx={{ borderRadius: '15px', m: 0.5 }}>
            Templates
          </ToggleButton>
          <ToggleButton value="evidence" aria-label="evidence" sx={{ borderRadius: '15px', m: 0.5 }}>
            Evidence
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Search documents..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchInputChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mr: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
        >
          Search
        </Button>
      </Paper>

      {/* Document Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell>Document Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Last Modified</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents && documents.length > 0 ? (
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={doc.category || 'Uncategorized'} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{new Date(doc.lastModified).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={doc.status || 'Active'} 
                        size="small" 
                        color={getStatusColor(doc.status || 'active')}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => downloadDocument(doc.id)}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No documents found. Upload a document to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default CompanyDocumentsPage;