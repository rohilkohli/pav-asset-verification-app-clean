import React, { useContext, useState, useMemo, useEffect } from 'react';
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

function AssetTable() {
  const ctx = useContext(AssetContext);
  const { assets, setAssets, filters: ctxFilters = {}, search, setFilters, searchCriteria, defaultPavDate, suppressAutoDisplay, setSuppressAutoDisplay, engineerName } = ctx;

  // Fallback local filters if context does not expose setFilters
  const [localFilters, setLocalFilters] = useState(ctxFilters || {});
  const effectiveFilters = setFilters ? (ctxFilters || {}) : localFilters;

  // Helper to update filters via context (if present) or local state
  const updateFilters = (patch) => {
    if (setFilters) {
      setFilters({ ...(ctxFilters || {}), ...patch });
    } else {
      setLocalFilters(prev => ({ ...(prev || {}), ...patch }));
    }
  };

  const [sortBy, setSortBy] = useState('Asset Code');
  const [sortDir, setSortDir] = useState('asc');

  // Track errors for required fields
  const [errors, setErrors] = useState({});

  // derive select options from data; Make depends on selected Asset Type
  const assetTypes = useMemo(() => Array.from(new Set(assets.map(a => a['Asset Type']).filter(Boolean))), [assets]);
  const pavStatuses = useMemo(() => Array.from(new Set(assets.map(a => a['PAV Status']).filter(Boolean))), [assets]);
  const makes = useMemo(() => {
    const list = assets
      .filter(a => !effectiveFilters.assetType || a['Asset Type'] === effectiveFilters.assetType)
      .map(a => a['Make'])
      .filter(Boolean);
    return Array.from(new Set(list));
  }, [assets, effectiveFilters.assetType]);

  // Ensure localFilters sync if context filters change (only relevant when using local fallback)
  useEffect(() => {
    if (!setFilters) {
      setLocalFilters(ctxFilters || {});
    }
  }, [ctxFilters, setFilters]);

  // Helper to safely lowercase strings
  function safeLower(val) {
    return typeof val === 'string' ? val.toLowerCase() : '';
  }

  // Filtering logic (memoized)
  const filtered = useMemo(() => {
    if (!assets || !assets.length) return [];
    const s = search ? String(search).toLowerCase() : '';
    return assets.filter(asset => {
      if (effectiveFilters.assetType && asset['Asset Type'] !== effectiveFilters.assetType) return false;
      if (effectiveFilters.make && asset['Make'] !== effectiveFilters.make) return false;
      if (effectiveFilters.pavStatus && asset['PAV Status'] !== effectiveFilters.pavStatus) return false;
      if (!s) return true;
      if (searchCriteria === 'Serial Number') return safeLower(asset['Serial Number']).includes(s);
      if (searchCriteria === 'Asset Code') return safeLower(asset['Asset Code']).includes(s);
      if (searchCriteria === 'Asset make' || searchCriteria === 'Make') return safeLower(asset['Make']).includes(s);
      // fallback
      return (
        safeLower(asset['Serial Number']).includes(s) ||
        safeLower(asset['Model']).includes(s) ||
        safeLower(asset['Make']).includes(s) ||
        safeLower(asset['Asset Code']).includes(s)
      );
    });
  }, [assets, effectiveFilters.assetType, effectiveFilters.make, effectiveFilters.pavStatus, search, searchCriteria]);

  // If suppressAutoDisplay is active and there are no filters/search applied, opt to show empty placeholder
  const noActiveFilters = !search && !(effectiveFilters.assetType || effectiveFilters.make || effectiveFilters.pavStatus);
  const shouldSuppress = suppressAutoDisplay && noActiveFilters;

  // Sorting (memoized)
  const displayed = useMemo(() => {
    const copy = (filtered || []).slice();
    copy.sort((a, b) => {
      const A = (a[sortBy] || '').toString().toLowerCase();
      const B = (b[sortBy] || '').toString().toLowerCase();
      if (A < B) return sortDir === 'asc' ? -1 : 1;
      if (A > B) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sortBy, sortDir]);

  // Calculate counts by PAV Status from filtered results
  const pavStatusCounts = useMemo(() => {
    const counts = {};
    filtered.forEach(asset => {
      const status = asset['PAV Status'] || 'Unknown';
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [filtered]);

  // Handler for dropdown and text changes
  const handleChange = (idx, field, value) => {
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
  };

  // Handler for changing Asset Type / Make / PAV Status (updates filters with dependency)
  const handleFilterChange = (field, value) => {
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
  };

  // Handler for text field changes (comments, disposal ticket, branch code)
  const handleTextChange = (idx, field, value) => {
    handleChange(idx, field, value);
  };

  // Editing modal state
  const [editingIdx, setEditingIdx] = useState(null);

  const openEdit = (asset) => {
    // find original index in assets array using stable _pav_id when available
    const id = asset && (asset['_pav_id'] || asset['Asset Code'] || asset['Serial Number']);
    const originalIndex = assets.findIndex(a => (a['_pav_id'] || a['Asset Code'] || a['Serial Number']) === id);
    if (originalIndex >= 0) setEditingIdx(originalIndex);
  };

  const closeEdit = () => setEditingIdx(null);

  return (
    <>
  <Paper sx={{ 
    p: { xs: 1.5, sm: 2 }, 
    mb: 2, 
    display: 'flex', 
    gap: { xs: 1, sm: 1.5 }, 
    alignItems: 'center', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  }}>
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
        {/* Filters section with label */}
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', width: { xs: '100%', sm: 'auto' } }}>
  <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 140 }, maxWidth: { xs: '100%', sm: 'none' } }}>
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

  <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 }, maxWidth: { xs: '100%', sm: 'none' } }}>
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

  <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 }, maxWidth: { xs: '100%', sm: 'none' } }}>
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
  <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 140 }, maxWidth: { xs: '100%', sm: 'none' } }}>
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
  <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 }, maxWidth: { xs: '100%', sm: 'none' } }}>
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
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Counts:
          </Typography>
          {Object.entries(pavStatusCounts).map(([status, count]) => (
            <Chip 
              key={status}
              label={`${status}: ${count}`}
              size="small"
              color={(status || '').toLowerCase() === 'available' ? 'success' : 'default'}
              sx={{ fontWeight: 500 }}
            />
          ))}
        </Box>
      </Paper>

      {shouldSuppress ? (
        <Paper sx={{ p: 3, textAlign: 'center', width: '100%', maxWidth: 640, mx: 'auto' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>Upload successful — no filters/search active. Apply a search or filters to reduce the result set, or show all items.</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => { try { if (setSuppressAutoDisplay) setSuppressAutoDisplay(false); } catch (e) {} }} size="medium">Show all</Button>
          </Box>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(300px, 1fr))' }, gap: 2 }}>
          {displayed.map((asset, idx) => (
            <Card
              key={asset['_pav_id'] || asset['Asset Code'] || asset['Serial Number'] || idx}
            variant="outlined"
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid var(--card-border)',
              borderRadius: 2,
              transition: 'transform 150ms ease, box-shadow 150ms ease',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{asset['Asset Type']}</Typography>
                  <Typography variant="h6">{asset['Asset Code']}</Typography>
                </Box>
                <Chip label={asset['PAV Status'] || 'Unknown'} color={(asset['PAV Status'] || '').toLowerCase() === 'available' ? 'success' : 'default'} size="small" />
              </Box>

              <Typography variant="body2">Make: <strong>{asset['Make']}</strong></Typography>
              <Typography variant="body2">Model: {asset['Model']}</Typography>
              <Typography variant="body2">S/N: {asset['Serial Number']}</Typography>
              <Typography variant="body2">PAV Date: <strong>{(() => {
                const existingDate = asset['PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)'];
                const hasExistingDate = existingDate && existingDate.trim() !== '';
                // Show existing date if present, otherwise show default date only if newly verified
                if (hasExistingDate) return existingDate;
                if (asset['_pav_edited'] === true && defaultPavDate && asset['PAV Status'] === 'Available') return defaultPavDate;
                return '';
              })()}</strong></Typography>
              <Typography variant="body2">Availability: {asset['Asset Availability Remarks']}</Typography>
              <Typography variant="body2">Branch Code: {asset['New Branch Code']}</Typography>
              <Typography variant="body2">Disposal Ticket: {asset['Disposal Ticket']}</Typography>
              {asset['Comment'] ? <Typography variant="body2">Comment: {asset['Comment']}</Typography> : null}
              {(asset['Engineer Name'] || (asset['_pav_edited'] === true && engineerName)) ? <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Verified by: {asset['Engineer Name'] || engineerName}</Typography> : null}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => openEdit(asset)}>Edit</Button>
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