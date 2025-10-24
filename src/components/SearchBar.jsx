import React, { useContext, useCallback, memo } from 'react';
import { AssetContext } from '../context/AssetContext';
import { TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const placeholderMap = {
  'Serial Number': 'Search Serial Number',
  'Asset Code': 'Search Asset Code',
  'Asset make': 'Search Asset make'
};

function SearchBar() {
  const { search, setSearch, searchCriteria, setSearchCriteria } = useContext(AssetContext);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, [setSearch]);

  const handleCriteriaChange = useCallback((e) => {
    setSearchCriteria(e.target.value);
  }, [setSearchCriteria]);

  const handleClearSearch = useCallback(() => {
    setSearch('');
  }, [setSearch]);

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 1, 
      alignItems: 'center',
      flexDirection: { xs: 'column', sm: 'row' },
      width: '100%',
      maxWidth: { xs: '100%', sm: 'auto' },
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
      p: 2,
      borderRadius: 3,
      border: '1px solid rgba(79, 172, 254, 0.3)',
    }}>
      <Box component="span" sx={{ 
        color: 'text.primary', 
        mr: { xs: 0, sm: 1 },
        fontSize: { xs: '0.875rem', sm: '1rem' },
        textAlign: 'center',
        fontWeight: 600
      }}>Select Search Criteria</Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
      <FormControl size="small" sx={{ 
        minWidth: { xs: '100%', sm: 160 }, 
        width: { xs: '100%', sm: 'auto' },
        '& .MuiOutlinedInput-root': {
          background: 'rgba(255, 255, 255, 0.05)',
        }
      }}>
        <InputLabel>Criteria</InputLabel>
        <Select value={searchCriteria} label="Criteria" onChange={handleCriteriaChange}>
          <MenuItem value="Serial Number">Serial Number</MenuItem>
          <MenuItem value="Asset Code">Asset Code</MenuItem>
          <MenuItem value="Asset make">Asset make</MenuItem>
        </Select>
      </FormControl>

      <TextField
        variant="outlined"
        size="small"
        placeholder={placeholderMap[searchCriteria] || 'Search'}
        value={search}
        onChange={handleSearchChange}
        sx={{ 
          minWidth: { xs: '100%', sm: 320 }, 
          width: { xs: '100%', sm: 'auto' },
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
            },
            '&.Mui-focused': {
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 0 0 3px rgba(79, 172, 254, 0.2)',
            }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClearSearch} aria-label="clear search">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      </Box>
    </Box>
  );
}

export default memo(SearchBar);