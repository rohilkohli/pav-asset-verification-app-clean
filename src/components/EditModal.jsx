import React, { useContext, useState } from 'react';
import { AssetContext } from '../context/AssetContext';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, FormControl, InputLabel, Box, FormHelperText
} from '@mui/material';

const assetStatusOptions = ["In use", "Not in use", "Not found"];
const pavStatusOptions = ["Available", "Not Available"];
const availabilityOptions = [
  "Available in same branch",
  "Available in different branch",
  "Asset picked up by Disposal Vendor",
  "Other"
];

function EditModal({ asset, idx, onClose }) {
  const { assets, setAssets } = useContext(AssetContext);

  // helper: format today as yyyy-mm-dd
  const todayIso = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();

  // Helper to parse possible Excel serials / Date objects / strings into an ISO yyyy-mm-dd string
  function toIsoDateString(src) {
    if (src == null || src === '') return todayIso;
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
      return todayIso;
    }
    // Date object
    if (Object.prototype.toString.call(src) === '[object Date]') {
      if (!isNaN(src.getTime())) {
        const yyyy = src.getFullYear();
        const mm = String(src.getMonth() + 1).padStart(2, '0');
        const dd = String(src.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }
      return todayIso;
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
    return todayIso;
  }

  // initial values (default date to today if missing or invalid)
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

  // Handle Save (open confirmation)
  const handleSave = () => {
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
  };

  const confirmSave = () => {
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
  };

  // UI
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { m: { xs: 2, sm: 3 } } }}>
      <DialogTitle>Edit Asset</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: { xs: '100%', sm: 300 }, pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Asset Status</InputLabel>
            <Select
              label="Asset Status"
              value={form.assetStatus}
              onChange={e => setForm(f => ({ ...f, assetStatus: e.target.value }))}
            >
              {assetStatusOptions.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>PAV Status</InputLabel>
            <Select
              label="PAV Status"
              value={form.pavStatus}
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
          />
          <FormControl fullWidth error={!!errors.remarks}>
            <InputLabel>Asset Availability Remarks</InputLabel>
            <Select
              label="Asset Availability Remarks"
              value={form.remarks}
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
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
      </DialogActions>
      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { m: { xs: 2, sm: 3 } } }}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>Are you sure you want to save these changes?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={confirmSave} color="primary" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

export default EditModal;