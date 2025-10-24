import React, { useContext, useState, useMemo, useEffect, useCallback, memo } from 'react';
import { AssetContext } from '../context/AssetContext';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, TextField, FormControl, InputLabel, FormHelperText,
  Box, Card, CardContent, CardActions, Typography, Button, Chip
} from '@mui/material';
import EditModal from './EditModal';
import './AssetTable.css'; // Add custom styles if desired

const assetStatusOptions = ["In use", "Not in use", "Not found"];
const pavStatusOptions = ["Available", "Not Available"];
const availabilityRemarksOptions = [
  "Available in same branch",
  "Available in different branch",
  "Asset picked up by Disposal Vendor",
  "Other"
];

// Helper to safely lowercase strings - moved outside component for better performance
function safeLower(val) {
  return typeof val === 'string' ? val.toLowerCase() : '';
}

function AssetTable() {
  const ctx = useContext(AssetContext);
  const { assets, setAssets, filters: ctxFilters = {}, search, setFilters, searchCriteria, defaultPavDate, suppressAutoDisplay, setSuppressAutoDisplay, engineerName } = ctx;

  // Fallback local filters if context does not expose setFilters
  const [localFilters, setLocalFilters] = useState(ctxFilters || {});
  const effectiveFilters = setFilters ? (ctxFilters || {}) : localFilters;

  // Helper to update filters via context (if present) or local state - memoized
  const updateFilters = useCallback((patch) => {
    if (setFilters) {
      setFilters({ ...(ctxFilters || {}), ...patch });
    } else {
      setLocalFilters(prev => ({ ...(prev || {}), ...patch }));
    }
  }, [setFilters, ctxFilters]);

  const [sortBy, setSortBy] = useState('Asset Code');
  const [sortDir, setSortDir] = useState('asc');

  // Track errors for required fields
  const [errors, setErrors] = useState({});

  // derive select options from data; Make depends on selected Asset Type
  // Optimize by caching these computations
  const assetTypes = useMemo(() => {
    const types = new Set();
    for (let i = 0; i < assets.length; i++) {
      const type = assets[i]['Asset Type'];
      if (type) types.add(type);
    }
    return Array.from(types);
  }, [assets]);

  const pavStatuses = useMemo(() => {
    const statuses = new Set();
    for (let i = 0; i < assets.length; i++) {
      const status = assets[i]['PAV Status'];
      if (status) statuses.add(status);
    }
    return Array.from(statuses);
  }, [assets]);

  const makes = useMemo(() => {
    const makeSet = new Set();
    const filterType = effectiveFilters.assetType;
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      if (!filterType || asset['Asset Type'] === filterType) {
        const make = asset['Make'];
        if (make) makeSet.add(make);
      }
    }
    return Array.from(makeSet);
  }, [assets, effectiveFilters.assetType]);

  // Ensure localFilters sync if context filters change (only relevant when using local fallback)
  useEffect(() => {
    if (!setFilters) {
      setLocalFilters(ctxFilters || {});
    }
  }, [ctxFilters, setFilters]);

  // Filtering logic (memoized and optimized)
  const filtered = useMemo(() => {
    if (!assets || !assets.length) return [];
    const s = search ? String(search).toLowerCase() : '';
    const { assetType, make, pavStatus } = effectiveFilters;
    
    const result = [];
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      
      // Apply filters first (most selective)
      if (assetType && asset['Asset Type'] !== assetType) continue;
      if (make && asset['Make'] !== make) continue;
      if (pavStatus && asset['PAV Status'] !== pavStatus) continue;
      
      // Apply search if present
      if (s) {
        let matches = false;
        if (searchCriteria === 'Serial Number') {
          matches = safeLower(asset['Serial Number']).includes(s);
        } else if (searchCriteria === 'Asset Code') {
          matches = safeLower(asset['Asset Code']).includes(s);
        } else if (searchCriteria === 'Asset make' || searchCriteria === 'Make') {
          matches = safeLower(asset['Make']).includes(s);
        } else {
          // fallback to multi-field search
          matches = (
            safeLower(asset['Serial Number']).includes(s) ||
            safeLower(asset['Model']).includes(s) ||
            safeLower(asset['Make']).includes(s) ||
            safeLower(asset['Asset Code']).includes(s)
          );
        }
        if (!matches) continue;
      }
      
      result.push(asset);
    }
    return result;
  }, [assets, effectiveFilters, search, searchCriteria]);

  // If suppressAutoDisplay is active and there are no filters/search applied, opt to show empty placeholder
  const noActiveFilters = !search && !(effectiveFilters.assetType || effectiveFilters.make || effectiveFilters.pavStatus);
  const shouldSuppress = suppressAutoDisplay && noActiveFilters;

  // Sorting (memoized and optimized)
  const displayed = useMemo(() => {
    if (!filtered || filtered.length === 0) return [];
    const copy = filtered.slice();
    const direction = sortDir === 'asc' ? 1 : -1;
    
    copy.sort((a, b) => {
      const A = (a[sortBy] || '').toString().toLowerCase();
      const B = (b[sortBy] || '').toString().toLowerCase();
      return A < B ? -direction : A > B ? direction : 0;
    });
    return copy;
  }, [filtered, sortBy, sortDir]);

  // Calculate counts by PAV Status from filtered results - optimized
  const pavStatusCounts = useMemo(() => {
    const counts = {};
    for (let i = 0; i < filtered.length; i++) {
      const status = filtered[i]['PAV Status'] || 'Unknown';
      counts[status] = (counts[status] || 0) + 1;
    }
    return counts;
  }, [filtered]);

  // Handler for dropdown and text changes - memoized
  const handleChange = useCallback((idx, field, value) => {
    const updated = [...assets];
    updated[idx][field] = value;

    // Conditional logic for required fields
    let err = {};
    // Asset Availability Remarks logic
    const remarks = field === 'Asset Availability Remarks' ? value : updated[idx]['Asset Availability Remarks'];
    if (remarks === "Other") {
      if (!updated[idx]['Comment'] || updated[idx]['Comment'].trim() === "") {
        err['Comment'] = "Comment required";
      } else {
        err['Comment'] = "";
      }
      updated[idx]['Disposal Ticket'] = "N/A";
      updated[idx]['New Branch Code'] = "N/A";
    } else if (remarks === "Asset picked up by Disposal Vendor") {
      if (!updated[idx]['Disposal Ticket'] || updated[idx]['Disposal Ticket'].trim() === "") {
        err['Disposal Ticket'] = "Disposal Ticket required";
      } else {
        err['Disposal Ticket'] = "";
      }
      updated[idx]['New Branch Code'] = "N/A";
      updated[idx]['Comment'] = "";
    } else if (remarks === "Available in different branch") {
      if (!updated[idx]['New Branch Code'] || updated[idx]['New Branch Code'].trim() === "") {
        err['New Branch Code'] = "New Branch Code required";
      } else {
        err['New Branch Code'] = "";
      }
      updated[idx]['Disposal Ticket'] = "N/A";
      updated[idx]['Comment'] = "";
    } else {
      updated[idx]['Disposal Ticket'] = "N/A";
      updated[idx]['New Branch Code'] = "N/A";
      updated[idx]['Comment'] = "";
      err = {};
    }

    setAssets(updated);
    setErrors(e => ({ ...e, [idx]: err }));
  }, [assets, setAssets]);

  // Handler for changing Asset Type / Make / PAV Status (updates filters with dependency) - memoized
  const handleFilterChange = useCallback((field, value) => {
    // If Asset Type changed, and selected Make is incompatible, clear Make
    if (field === 'assetType') {
      // compute makes available for the new asset type
      const availableMakes = Array.from(new Set(
        assets.filter(a => !value || a['Asset Type'] === value).map(a => a['Make']).filter(Boolean)
      ));
      const currentMake = effectiveFilters.make;
      const makeShouldBeCleared = currentMake && !availableMakes.includes(currentMake);
      if (makeShouldBeCleared) {
        updateFilters({ assetType: value, make: '' });
        return;
      }
    }
    updateFilters({ [field]: value });
  }, [assets, effectiveFilters.make, updateFilters]);

  // Handler for text field changes (comments, disposal ticket, branch code) - memoized
  const handleTextChange = useCallback((idx, field, value) => {
    handleChange(idx, field, value);
  }, [handleChange]);

  // Editing modal state
  const [editingIdx, setEditingIdx] = useState(null);

  const openEdit = useCallback((asset) => {
    // find original index in assets array using stable _pav_id when available
    const id = asset && (asset['_pav_id'] || asset['Asset Code'] || asset['Serial Number']);
    const originalIndex = assets.findIndex(a => (a['_pav_id'] || a['Asset Code'] || a['Serial Number']) === id);
    if (originalIndex >= 0) setEditingIdx(originalIndex);
  }, [assets]);

  const closeEdit = useCallback(() => setEditingIdx(null), []);

  return (
    <>
  <Paper sx={{ 
    p: { xs: 1.5, sm: 2 }, 
    mb: 2, 
    display: 'flex', 
    gap: { xs: 1, sm: 1.5 }, 
    alignItems: 'center', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    borderRadius: 3,
  }}>
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
        {/* Filters section with label */}
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', width: { xs: '100%', sm: 'auto' } }}>
  <FormControl size="small" sx={{ 
    minWidth: { xs: '100%', sm: 140 }, 
    maxWidth: { xs: '100%', sm: 'none' },
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255, 255, 255, 0.05)',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.08)',
      }
    }
  }}>
          <InputLabel>Asset Type</InputLabel>
          <Select
            value={effectiveFilters.assetType || ''}
            label="Asset Type"
            onChange={e => handleFilterChange('assetType', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {assetTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>

  <FormControl size="small" sx={{ 
    minWidth: { xs: '100%', sm: 120 }, 
    maxWidth: { xs: '100%', sm: 'none' },
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255, 255, 255, 0.05)',
    }
  }}>
          <InputLabel>Make</InputLabel>
          <Select
            value={effectiveFilters.make || ''}
            label="Make"
            onChange={e => handleFilterChange('make', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {makes.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </Select>
        </FormControl>

  <FormControl size="small" sx={{ 
    minWidth: { xs: '100%', sm: 120 }, 
    maxWidth: { xs: '100%', sm: 'none' },
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255, 255, 255, 0.05)',
    }
  }}>
          <InputLabel>PAV Status</InputLabel>
          <Select
            value={effectiveFilters.pavStatus || ''}
            label="PAV Status"
            onChange={e => handleFilterChange('pavStatus', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {pavStatuses.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </Select>
        </FormControl>
        </Box>

        {/* Sort section with label */}
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', width: { xs: '100%', sm: 'auto' } }}>
          <Box component="span" sx={{ 
            color: 'text.secondary', 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            display: { xs: 'none', sm: 'block' }
          }}>Sort By</Box>
  <FormControl size="small" sx={{ 
    minWidth: { xs: '100%', sm: 140 }, 
    maxWidth: { xs: '100%', sm: 'none' },
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255, 255, 255, 0.05)',
    }
  }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} label="Sort By" onChange={e => setSortBy(e.target.value)}>
            <MenuItem value="Asset Code">Asset Code</MenuItem>
            <MenuItem value="Make">Make</MenuItem>
            <MenuItem value="Model">Model</MenuItem>
            <MenuItem value="Serial Number">Serial Number</MenuItem>
            <MenuItem value="Asset Type">Asset Type</MenuItem>
          </Select>
        </FormControl>
          <Box component="span" sx={{ 
            color: 'text.secondary', 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            display: { xs: 'none', sm: 'block' }
          }}>Direction</Box>
  <FormControl size="small" sx={{ 
    minWidth: { xs: '100%', sm: 120 }, 
    maxWidth: { xs: '100%', sm: 'none' },
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255, 255, 255, 0.05)',
    }
  }}>
          <InputLabel>Direction</InputLabel>
          <Select value={sortDir} label="Direction" onChange={e => setSortDir(e.target.value)}>
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
        </Box>
        </Box>

        {/* PAV Status Counter on the right */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center', 
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', md: 'flex-end' },
          width: { xs: '100%', md: 'auto' },
          mt: { xs: 1, md: 0 }
        }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Status:
          </Typography>
          {Object.entries(pavStatusCounts).map(([status, count]) => (
            <Chip 
              key={status}
              label={`${status}: ${count}`}
              size="small"
              color={(status || '').toLowerCase() === 'available' ? 'success' : 'default'}
              sx={{ 
                fontWeight: 600,
                background: (status || '').toLowerCase() === 'available' 
                  ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                  : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: '#000',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            />
          ))}
        </Box>
      </Paper>

      {shouldSuppress ? (
        <Paper sx={{ 
          p: 3, 
          textAlign: 'center', 
          width: '100%', 
          maxWidth: 640, 
          mx: 'auto',
          background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
          border: '1px solid rgba(79, 172, 254, 0.3)',
          borderRadius: 3,
        }}>
          <Typography variant="body1" color="text.primary" sx={{ mb: 2, fontWeight: 500 }}>
            Upload successful — no filters/search active. Apply a search or filters to reduce the result set, or show all items.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              onClick={() => { try { if (setSuppressAutoDisplay) setSuppressAutoDisplay(false); } catch (e) {} }} 
              size="medium"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                }
              }}
            >
              Show all
            </Button>
          </Box>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(320px, 1fr))' }, gap: 3 }}>
          {displayed.map((asset, idx) => (
            <Card
              key={asset['_pav_id'] || asset['Asset Code'] || asset['Serial Number'] || idx}
            variant="outlined"
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: 3,
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
              willChange: 'transform',
              transform: 'translateZ(0)',
              '&:hover': { 
                transform: 'translateY(-4px) translateZ(0)', 
                boxShadow: '0 8px 24px 0 rgba(31, 38, 135, 0.3)',
                border: '1px solid rgba(102, 126, 234, 0.5)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: (asset['PAV Status'] || '').toLowerCase() === 'available'
                  ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
                  : 'linear-gradient(90deg, #fa709a 0%, #fee140 100%)',
              }
            }}
          >
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ 
                    color: 'text.secondary', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}>
                    {asset['Asset Type']}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mt: 0.5
                  }}>
                    {asset['Asset Code']}
                  </Typography>
                </Box>
                <Chip 
                  label={asset['PAV Status'] || 'Unknown'} 
                  size="small"
                  sx={{
                    background: (asset['PAV Status'] || '').toLowerCase() === 'available' 
                      ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                      : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    color: '#000',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                />
              </Box>

              <Box sx={{ 
                display: 'grid', 
                gap: 1,
                '& > *': {
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  pb: 0.5
                }
              }}>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Make:</span>
                  <strong>{asset['Make']}</strong>
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Model:</span>
                  <span>{asset['Model']}</span>
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>S/N:</span>
                  <span>{asset['Serial Number']}</span>
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>PAV Date:</span>
                  <strong>{(() => {
                    const existingDate = asset['PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)'];
                    const hasExistingDate = existingDate && existingDate.trim() !== '';
                    if (hasExistingDate) return existingDate;
                    if (asset['_pav_edited'] === true && defaultPavDate && asset['PAV Status'] === 'Available') return defaultPavDate;
                    return '—';
                  })()}</strong>
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Availability:</span>
                  <span style={{ fontSize: '0.75rem' }}>{asset['Asset Availability Remarks'] || '—'}</span>
                </Typography>
                {asset['New Branch Code'] && asset['New Branch Code'] !== 'N/A' && (
                  <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Branch:</span>
                    <span>{asset['New Branch Code']}</span>
                  </Typography>
                )}
                {asset['Disposal Ticket'] && asset['Disposal Ticket'] !== 'N/A' && (
                  <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Disposal:</span>
                    <span>{asset['Disposal Ticket']}</span>
                  </Typography>
                )}
                {asset['Comment'] && (
                  <Typography variant="body2" sx={{ pt: 1 }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.75rem' }}>Comment:</span>
                    <br />
                    <span style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>{asset['Comment']}</span>
                  </Typography>
                )}
              </Box>

              {(asset['Engineer Name'] || (asset['_pav_edited'] === true && engineerName)) && (
                <Typography variant="caption" sx={{ 
                  mt: 2, 
                  display: 'block',
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  fontSize: '0.7rem'
                }}>
                  ✓ Verified by: {asset['Engineer Name'] || engineerName}
                </Typography>
              )}
            </CardContent>
            <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
              <Button 
                size="small" 
                onClick={() => openEdit(asset)}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  width: '100%',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  }
                }}
              >
                Edit Details
              </Button>
            </CardActions>
          </Card>
          ))}
        </Box>
      )}

      {editingIdx !== null && (
        <EditModal asset={assets[editingIdx]} idx={editingIdx} onClose={closeEdit} />
      )}
    </>
  );
}

export default AssetTable;