/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  CircularProgress,
  Breadcrumbs,
  Link,
  LinearProgress,
  Tab,
  Tabs
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  FilterList as FilterListIcon,
  DownloadForOffline as DownloadIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import nistCatalogData from '../../../nist/nist_sp-800-53_rev5_catalog.json'; // This will be your converted JSON file

const NISTGuidePage = () => {
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState([]);
  const [filteredControls, setFilteredControls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    family: '',
    priority: '',
    impact: ''
  });
  const [bookmarkedControls, setBookmarkedControls] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedControl, setExpandedControl] = useState(null);

  // Unique values for filter dropdowns
  const [families, setFamilies] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [impacts, setImpacts] = useState([]);

  // Function to extract all controls from the catalog structure
  const extractControls = (catalogData) => {
    if (!catalogData || !catalogData.catalog || !catalogData.catalog.groups) {
      return [];
    }

    // Flatten all controls from all groups
    const allControls = [];
    catalogData.catalog.groups.forEach(group => {
      if (group.controls && Array.isArray(group.controls)) {
        // Add family information to each control
        const controlsWithFamily = group.controls.map(control => ({
          ...control,
          family: group.title || 'Unknown',
          // Add any other properties you need for display
          description: control.parts?.find(part => part.name === 'guidance')?.prose || 'No description available',
          // You might need to adjust these based on the actual structure
          priority: '1', // Default priority if not available
          impact: 'Moderate', // Default impact if not available
        }));
        allControls.push(...controlsWithFamily);
      }
    });
    
    return allControls;
  };

  useEffect(() => {
    // Simulating loading from an API or file
    setTimeout(() => {
      const extractedControls = extractControls(nistCatalogData);
      setCatalog(extractedControls);
      setFilteredControls(extractedControls);
      
      // Extract unique values for filters
      const uniqueFamilies = [...new Set(extractedControls.map(item => item.family))];
      const uniquePriorities = [...new Set(extractedControls.map(item => item.priority).filter(Boolean))];
      const uniqueImpacts = [...new Set(extractedControls.map(item => item.impact).filter(Boolean))];
      
      setFamilies(uniqueFamilies);
      setPriorities(uniquePriorities);
      setImpacts(uniqueImpacts);
      
      // Load bookmarks from local storage
      const savedBookmarks = localStorage.getItem('nistBookmarks');
      if (savedBookmarks) {
        setBookmarkedControls(JSON.parse(savedBookmarks));
      }
      
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filters and search when criteria change
  useEffect(() => {
    let results = catalog;
    
    // Apply search
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      results = results.filter(control => 
        control.id.toLowerCase().includes(lowercaseQuery) ||
        control.title.toLowerCase().includes(lowercaseQuery) ||
        (control.description && control.description.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    // Apply filters
    if (activeFilters.family) {
      results = results.filter(control => control.family === activeFilters.family);
    }
    if (activeFilters.priority) {
      results = results.filter(control => control.priority === activeFilters.priority);
    }
    if (activeFilters.impact) {
      results = results.filter(control => control.impact === activeFilters.impact);
    }
    
    setFilteredControls(results);
  }, [catalog, searchQuery, activeFilters]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setActiveFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setActiveFilters({
      family: '',
      priority: '',
      impact: ''
    });
    setSearchQuery('');
  };

  const toggleBookmark = (controlId) => {
    let updatedBookmarks;
    if (bookmarkedControls.includes(controlId)) {
      updatedBookmarks = bookmarkedControls.filter(id => id !== controlId);
    } else {
      updatedBookmarks = [...bookmarkedControls, controlId];
    }
    setBookmarkedControls(updatedBookmarks);
    localStorage.setItem('nistBookmarks', JSON.stringify(updatedBookmarks));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAccordionChange = (controlId) => (event, isExpanded) => {
    setExpandedControl(isExpanded ? controlId : null);
  };

  // Get only bookmarked controls for the bookmarks tab
  const bookmarkedControlsList = catalog.filter(control => 
    bookmarkedControls.includes(control.id)
  );
  
  // This will handle exporting the bookmarked controls as a PDF (would need implementation)
  const exportBookmarkedControls = () => {
    console.log('Export functionality to be implemented');
    // Typically you'd use a library like jsPDF or react-pdf here
  };

  const renderControlCard = (control) => {
    const isBookmarked = bookmarkedControls.includes(control.id);
    
    return (
      <Accordion 
        key={control.id}
        expanded={expandedControl === control.id}
        onChange={handleAccordionChange(control.id)}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {control.id}: {control.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                <Chip 
                  size="small" 
                  label={control.family} 
                  color="primary" 
                  variant="outlined" 
                />
                {control.priority && (
                  <Chip 
                    size="small" 
                    label={`P${control.priority}`} 
                    color="secondary" 
                  />
                )}
                {control.impact && (
                  <Chip 
                    size="small" 
                    label={control.impact} 
                    color="info" 
                  />
                )}
              </Box>
            </Box>
            <Tooltip title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}>
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(control.id);
                }}
                size="small"
              >
                {isBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            {control.description}
          </Typography>
          
          {control.implementation && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>
                Implementation:
              </Typography>
              <Typography variant="body2" paragraph>
                {control.implementation}
              </Typography>
            </>
          )}
          
          {control.assessment && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>
                Assessment:
              </Typography>
              <Typography variant="body2" paragraph>
                {control.assessment}
              </Typography>
            </>
          )}
          
          {control.relatedControls && control.relatedControls.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>
                Related Controls:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {control.relatedControls.map(relatedId => (
                  <Chip 
                    key={relatedId}
                    size="small" 
                    label={relatedId} 
                    onClick={() => {
                      // Find and expand the related control
                      const relatedControl = catalog.find(c => c.id === relatedId);
                      if (relatedControl) {
                        setExpandedControl(relatedId);
                      }
                    }}
                    clickable
                  />
                ))}
              </Box>
            </>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <Link color="inherit" href="/system/dashboard">
          Dashboard
        </Link>
        <Typography color="text.primary">NIST 800-53 Catalog</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          NIST 800-53 Rev.5 Control Catalog
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse the complete catalog of security and privacy controls defined in NIST Special Publication 800-53 Revision 5. 
          Use the search and filters to find specific controls, or bookmark controls to create your own reference guide.
        </Typography>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All Controls" />
          <Tab 
            label={`Bookmarked Controls (${bookmarkedControls.length})`} 
            disabled={bookmarkedControls.length === 0} 
          />
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
          <Typography sx={{ mt: 2, textAlign: 'center' }} color="text.secondary">
            Loading NIST 800-53 controls...
          </Typography>
        </Box>
      ) : (
        <>
          {activeTab === 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search by ID, title, or description..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Family</InputLabel>
                      <Select
                        name="family"
                        value={activeFilters.family}
                        onChange={handleFilterChange}
                        label="Family"
                      >
                        <MenuItem value="">All</MenuItem>
                        {families.map(family => (
                          <MenuItem key={family} value={family}>{family}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                      <InputLabel>Priority</InputLabel>
                      <Select
                        name="priority"
                        value={activeFilters.priority}
                        onChange={handleFilterChange}
                        label="Priority"
                      >
                        <MenuItem value="">All</MenuItem>
                        {priorities.map(priority => (
                          <MenuItem key={priority} value={priority}>P{priority}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                      <InputLabel>Impact</InputLabel>
                      <Select
                        name="impact"
                        value={activeFilters.impact}
                        onChange={handleFilterChange}
                        label="Impact"
                      >
                        <MenuItem value="">All</MenuItem>
                        {impacts.map(impact => (
                          <MenuItem key={impact} value={impact}>{impact}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button 
                      variant="outlined" 
                      startIcon={<FilterListIcon />} 
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredControls.length} of {catalog.length} controls
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {filteredControls.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                  No controls match your search criteria. Try adjusting your filters.
                </Typography>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {filteredControls.map(control => renderControlCard(control))}
                </Box>
              )}
            </Paper>
          )}

          {activeTab === 1 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Your Bookmarked Controls
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={exportBookmarkedControls}
                >
                  Export as PDF
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {bookmarkedControlsList.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                  You haven&apos;t bookmarked any controls yet. Browse the catalog and click the bookmark icon to add controls.
                </Typography>
              ) : (
                <Box>
                  {bookmarkedControlsList.map(control => renderControlCard(control))}
                </Box>
              )}
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default NISTGuidePage;