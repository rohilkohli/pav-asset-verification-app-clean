import React, { useContext, useState, useCallback, memo } from 'react';
import { AssetContext } from '../context/AssetContext';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, FormControl, InputLabel, Box, FormHelperText, Typography, useTheme
} from '@mui/material';

const assetStatusOptions = ["In use", "Not in use", "Not found"];
const pavStatusOptions = ["Available", "Not Available"];
const availabilityOptions = [
  "Available in same branch",
  "Available in different branch",
  "Asset picked up by Disposal Vendor",
  "Other"
];

// Helper to parse possible Excel serials / Date objects / strings into an ISO yyyy-mm-dd string
// Moved outside component for performance
function toIsoDateString(src) {
  if (src == null || src === '') return '';
  // Excel numeric serial
  if (typeof src === 'number' && !isNaN(src)) {
    const ms = Math.round((src - 25569) * 86400 * 1000);
    const dt = new Date(ms);
    if (!isNaN(dt.getTime())) {
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    return '';
  }
  // Date object
  if (Object.prototype.toString.call(src) === '[object Date]') {
    if (!isNaN(src.getTime())) {
      const yyyy = src.getFullYear();
      const mm = String(src.getMonth() + 1).padStart(2, '0');
      const dd = String(src.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    return '';
  }
  // String: try to parse
  const dt = new Date(src);
  if (!isNaN(dt.getTime())) {
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  // fallback
  return '';
}

function EditModal({ asset, idx, onClose }) {
  const { assets, setAssets } = useContext(AssetContext);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // initial values (preserve empty PAV dates as empty, convert valid dates to yyyy-mm-dd)
  const initialDate = toIsoDateString(asset['PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)']);

  const [form, setForm] = useState({
    assetStatus: asset['Asset status'] || "",
    pavStatus: asset['PAV Status'] || "",
    pavDate: initialDate,
    remarks: asset['Asset Availability Remarks'] || "",
    branchCode: asset['New Branch Code'] || "",
    disposalTicket: asset['Disposal Ticket'] || ""
  });

  // state for confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Validation states
  const [errors, setErrors] = useState({});

  // Conditional logic
  const isDisposalMandatory = form.remarks === "Asset picked up by Disposal Vendor";
  const isBranchCodeMandatory = form.remarks === "Available in different branch";

  // Handle Save (open confirmation) - memoized
  const handleSave = useCallback(() => {
    let newErrors = {};
    if (isDisposalMandatory && !form.disposalTicket.trim()) {
      newErrors.disposalTicket = "Disposal Ticket is required.";
    }
    if (isBranchCodeMandatory && !form.branchCode.trim()) {
      newErrors.branchCode = "New Branch Code is required.";
    }
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setConfirmOpen(true);
  }, [form, isDisposalMandatory, isBranchCodeMandatory]);

  const confirmSave = useCallback(() => {
    const updated = [...assets];
    updated[idx]['Asset status'] = form.assetStatus;
    updated[idx]['PAV Status'] = form.pavStatus;
    // Store the ISO yyyy-mm-dd value so it's consistently handled by UploadForm/EditModal
    updated[idx]['PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)'] = form.pavDate;
    updated[idx]['Asset Availability Remarks'] = form.remarks;
    updated[idx]['New Branch Code'] = isBranchCodeMandatory ? form.branchCode : "N/A";
    updated[idx]['Disposal Ticket'] = isDisposalMandatory ? form.disposalTicket : "N/A";
    // Mark this asset as edited by engineer so PAV Date and Engineer Name will be applied on save
    updated[idx]['_pav_edited'] = true;
    setAssets(updated);
    setConfirmOpen(false);
    onClose();
  }, [assets, idx, form, isDisposalMandatory, isBranchCodeMandatory, setAssets, onClose]);

  const handleCloseConfirm = useCallback(() => setConfirmOpen(false), []);

  // UI
  return (
    <Dialog 
      open={true}
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      disablePortal={false}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 100,
      }}
      PaperProps={{ 
        sx: { 
          m: { xs: 2, sm: 3 },
          background: isDark 
            ? 'linear-gradient(135deg, rgba(22, 22, 22, 0.95) 0%, rgba(22, 22, 22, 0.98) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: 3,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        } 
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 700,
        fontSize: '1.5rem'
      }}>
        Edit Asset Details
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: { xs: '100%', sm: 300 }, pt: 1 }}>
          <FormControl fullWidth sx={{
            '& .MuiOutlinedInput-root': {
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            }
          }}>
            <InputLabel>Asset Status</InputLabel>
            <Select
              label="Asset Status"
              value={form.assetStatus}
              MenuProps={{ sx: { zIndex: (theme) => theme.zIndex.modal + 400 } }}
              onChange={e => setForm(f => ({ ...f, assetStatus: e.target.value }))}
            >
              {assetStatusOptions.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{
            '& .MuiOutlinedInput-root': {
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            }
          }}>
            <InputLabel>PAV Status</InputLabel>
            <Select
              label="PAV Status"
              value={form.pavStatus}
              MenuProps={{ sx: { zIndex: (theme) => theme.zIndex.modal + 400 } }}
              onChange={e => setForm(f => ({ ...f, pavStatus: e.target.value }))}
            >
              {pavStatusOptions.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="PAV Date of visit"
            type="date"
            value={form.pavDate}
            onChange={e => setForm(f => ({ ...f, pavDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              }
            }}
          />
          <FormControl fullWidth error={!!errors.remarks} sx={{
            '& .MuiOutlinedInput-root': {
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            }
          }}>
            <InputLabel>Asset Availability Remarks</InputLabel>
            <Select
              label="Asset Availability Remarks"
              value={form.remarks}
              MenuProps={{ sx: { zIndex: (theme) => theme.zIndex.modal + 400 } }}
              onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
            >
              {availabilityOptions.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
            {!!errors.remarks && <FormHelperText>{errors.remarks}</FormHelperText>}
          </FormControl>
          <TextField
            label="New Branch Code"
            value={form.branchCode}
            onChange={e => setForm(f => ({ ...f, branchCode: e.target.value }))}
            fullWidth
            required={isBranchCodeMandatory}
            error={!!errors.branchCode}
            helperText={isBranchCodeMandatory ? "Branch Code required for 'Available in different branch'" : ""}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              }
            }}
          />
          <TextField
            label="Disposal Ticket"
                    value={form.disposalTicket}
                    onChange={e => {
                      // Accept only digits; limit up to 7 digits and store with RITM prefix
                      const raw = String(e.target.value).replace(/\D/g, '').slice(0, 7);
                      const withPrefix = raw ? `RITM${raw}` : '';
                      setForm(f => ({ ...f, disposalTicket: withPrefix }));
                    }}
            fullWidth
            required={isDisposalMandatory}
            error={!!errors.disposalTicket}
                    helperText={isDisposalMandatory ? "Enter digits only (stored as RITMxxxxxxx)" : ""}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          sx={{
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: '#000',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)',
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: '#000',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
            }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
      {/* Confirmation dialog */}
      <Dialog 
        open={confirmOpen} 
        onClose={handleCloseConfirm}
        disablePortal={false}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 200,
        }}
        PaperProps={{ 
          sx: { 
            m: { xs: 2, sm: 3 },
            background: isDark 
              ? 'linear-gradient(135deg, rgba(22, 22, 22, 0.95) 0%, rgba(22, 22, 22, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 3,
          } 
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Save</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to save these changes?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleCloseConfirm}
            sx={{
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: '#000',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmSave} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: '#000',
              fontWeight: 600,
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

export default memo(EditModal);