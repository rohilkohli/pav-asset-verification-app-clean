import React, { useContext } from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import { AssetContext } from '../context/AssetContext';
import { Button } from '@mui/material';

function UploadForm() {
  const { setAssets, setSuppressAutoDisplay } = useContext(AssetContext);

  const isoToday = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();

  // Convert an Excel serial (number) or other value to a JS Date
  function toJsDateFromPossibleExcel(src) {
    if (src == null || src === '') return null;
    // Excel often gives numeric serials (days since 1899-12-31). Convert these.
    if (typeof src === 'number' && !isNaN(src)) {
      // Excel -> JS: (excelSerial - 25569) days from 1970-01-01
      // Multiply by 86400*1000 to get milliseconds
      const ms = Math.round((src - 25569) * 86400 * 1000);
      const dt = new Date(ms);
      if (!isNaN(dt.getTime())) return dt;
      return null;
    }
    // If it's already a Date object
    if (Object.prototype.toString.call(src) === '[object Date]') {
      if (!isNaN(src.getTime())) return src;
      return null;
    }
    // Otherwise try JS Date parsing for strings (handles ISO and many common formats)
    const dt = new Date(src);
    if (!isNaN(dt.getTime())) return dt;
    return null;
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const raw = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      // Normalize rows: ensure required keys exist and normalize PAV date to yyyy-mm-dd
      const normalized = raw.map(row => {
        const r = { ...row };
        // Ensure exact keys exist (app may rely on these literal strings)
        const keys = [
          'Asset Code', 'Serial Number', 'Make', 'Model', 'Asset Type', 'Asset status',
          'PAV Status', 'PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)', 'Asset Availability Remarks',
          'New Branch Code', 'Disposal Ticket', 'Comment'
        ];
        keys.forEach(k => { if (!(k in r)) r[k] = ''; });

        // Normalize PAV date into yyyy-mm-dd. Handle Excel numeric serials, Date objects and strings.
        const src = r['PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)'];
        const dt = toJsDateFromPossibleExcel(src);
        if (dt) {
          const yyyy = dt.getFullYear();
          const mm = String(dt.getMonth() + 1).padStart(2, '0');
          const dd = String(dt.getDate()).padStart(2, '0');
          r['PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)'] = `${yyyy}-${mm}-${dd}`;
        } else {
          // If missing or invalid, keep it empty. PAV date should only be populated when verification is done by engineer.
          r['PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)'] = '';
        }

        // Defaults for fields used by UI/validation
        if (!r['Disposal Ticket']) r['Disposal Ticket'] = 'N/A';
        if (!r['New Branch Code']) r['New Branch Code'] = 'N/A';
        if (!r['Comment']) r['Comment'] = '';

        // Ensure a stable id for each asset to use as React keys.
        // Prefer Asset Code, then Serial Number; otherwise generate a timestamped id.
        if (!r['_pav_id']) {
          if (r['Asset Code']) r['_pav_id'] = String(r['Asset Code']);
          else if (r['Serial Number']) r['_pav_id'] = String(r['Serial Number']);
          else r['_pav_id'] = `uploaded-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
        }

        return r;
      });

      // set assets but suppress automatic full display — user may want to filter/search first
      setAssets(normalized);
      try { if (setSuppressAutoDisplay) setSuppressAutoDisplay(true); } catch (e) {}
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Button
      variant="contained"
      component="label"
      startIcon={<UploadFileIcon />}
      color="primary"
      size="small"
      sx={{ minWidth: { xs: 140, sm: 170 }, textTransform: 'none', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
    >
      Upload Excel/CSV
      <input type="file" accept=".csv, .xlsx" hidden onChange={handleFileUpload} />
    </Button>
  );
}

export default UploadForm;