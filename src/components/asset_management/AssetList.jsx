import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { AssetType, AssetStatus } from '../../services';

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString();
};

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case AssetStatus.ACTIVE:
      return 'success';
    case AssetStatus.MAINTENANCE:
      return 'warning';
    case AssetStatus.INACTIVE:
      return 'default';
    case AssetStatus.DISPOSED:
      return 'error';
    case AssetStatus.LOST:
    case AssetStatus.STOLEN:
      return 'error';
    default:
      return 'default';
  }
};

// Helper function to get asset type display name
const getAssetTypeDisplayName = (type) => {
  const typeKey = Object.entries(AssetType).find(([, value]) => value === type)?.[0];
  return typeKey ? typeKey.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : type;
};

const AssetList = ({ 
  assets, 
  onEdit, 
  onDelete, 
  onSearch,
  loading 
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Calculate if any assets are nearing end of life or support
  const currentDate = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

  const assetsNearingEndOfLife = assets.filter(asset => {
    if (!asset.endOfLife) return false;
    const eolDate = new Date(asset.endOfLife);
    return eolDate > currentDate && eolDate <= threeMonthsFromNow;
  }).length;

  const assetsNearingEndOfSupport = assets.filter(asset => {
    if (!asset.endOfSupport) return false;
    const eosDate = new Date(asset.endOfSupport);
    return eosDate > currentDate && eosDate <= threeMonthsFromNow;
  }).length;

  return (
    <Box>
      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6">Total Assets</Typography>
          <Typography variant="h4">{assets.length}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6">Active Assets</Typography>
          <Typography variant="h4">
            {assets.filter(asset => asset.status === AssetStatus.ACTIVE).length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, bgcolor: assetsNearingEndOfLife > 0 ? 'warning.light' : 'inherit' }}>
          <Typography variant="h6">Nearing End of Life</Typography>
          <Typography variant="h4">{assetsNearingEndOfLife}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, bgcolor: assetsNearingEndOfSupport > 0 ? 'warning.light' : 'inherit' }}>
          <Typography variant="h6">Nearing End of Support</Typography>
          <Typography variant="h4">{assetsNearingEndOfSupport}</Typography>
        </Paper>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          sx={{ mr: 2, flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSearch}
                  disabled={loading}
                >
                  Search
                </Button>
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title="Filter options">
          <IconButton>
            <FilterIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Assets Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Purchase Date</TableCell>
              <TableCell>End of Life</TableCell>
              <TableCell>End of Support</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No assets found. Add your first asset to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              assets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>{getAssetTypeDisplayName(asset.type)}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.model}</TableCell>
                    <TableCell>{asset.serialNumber}</TableCell>
                    <TableCell>{asset.location || '-'}</TableCell>
                    <TableCell>{formatDate(asset.purchaseDate)}</TableCell>
                    <TableCell>
                      {asset.endOfLife && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {formatDate(asset.endOfLife)}
                          {new Date(asset.endOfLife) <= threeMonthsFromNow && 
                           new Date(asset.endOfLife) >= currentDate && (
                            <Chip 
                              size="small" 
                              label="Soon" 
                              color="warning" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                          {new Date(asset.endOfLife) < currentDate && (
                            <Chip 
                              size="small" 
                              label="Expired" 
                              color="error" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {asset.endOfSupport && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {formatDate(asset.endOfSupport)}
                          {new Date(asset.endOfSupport) <= threeMonthsFromNow && 
                           new Date(asset.endOfSupport) >= currentDate && (
                            <Chip 
                              size="small" 
                              label="Soon" 
                              color="warning" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                          {new Date(asset.endOfSupport) < currentDate && (
                            <Chip 
                              size="small" 
                              label="Expired" 
                              color="error" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={asset.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())} 
                        color={getStatusColor(asset.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Asset">
                        <IconButton size="small" onClick={() => onEdit(asset)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Asset">
                        <IconButton size="small" onClick={() => onDelete(asset.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={assets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

AssetList.propTypes = {
  assets: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

AssetList.defaultProps = {
  assets: [],
  loading: false
};

export default AssetList;