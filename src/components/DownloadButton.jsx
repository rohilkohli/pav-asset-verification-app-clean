import React, { useContext } from 'react';
import { AssetContext } from '../context/AssetContext';
import * as XLSX from 'xlsx';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

function DownloadButton() {
  const { assets, engineerName, defaultPavDate } = useContext(AssetContext);

  const handleDownload = () => {
    if (!assets.length) return;
    
    // Generate filename from Engineer Name and PAV Date
    const name = (engineerName || 'Engineer').trim().replace(/\s+/g, '_');
    const date = (defaultPavDate || '').replace(/-/g, '_');
    const filename = `${name}_${date}.xlsx`;
    
    const ws = XLSX.utils.json_to_sheet(assets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PAV Sheet');
    XLSX.writeFile(wb, filename);
  };

  return (
    <Button
      variant="contained"
      color="success"
      startIcon={<DownloadIcon />}
      size="small"
      sx={{ minWidth: { xs: 140, sm: 170 }, textTransform: 'none', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
      onClick={handleDownload}
      disabled={!assets.length}
    >
      Download Updated Sheet
    </Button>
  );
}

export default DownloadButton;