import React, { useContext } from 'react';
import { AssetContext } from '../context/AssetContext';
import { TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

function SearchBar() {
  const { search, setSearch, searchCriteria, setSearchCriteria } = useContext(AssetContext);

  const placeholderMap = {
    'Serial Number': 'Search Serial Number',
    'Asset Code': 'Search Asset Code',
    'Asset make': 'Search Asset make'
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>Select Search Criteria</Box>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Criteria</InputLabel>
        <Select value={searchCriteria} label="Criteria" onChange={e => setSearchCriteria(e.target.value)}>
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
        onChange={e => setSearch(e.target.value)}
        sx={{ minWidth: 320 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearch('')} aria-label="clear search">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
}

export default SearchBar;