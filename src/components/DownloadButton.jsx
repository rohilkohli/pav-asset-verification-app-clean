import React, { useContext, useCallback } from 'react';
import { AssetContext } from '../context/AssetContext';
import * as XLSX from 'xlsx';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

function DownloadButton() {
  const { assets, engineerName, defaultPavDate } = useContext(AssetContext);

  const handleDownload = useCallback(() => {
    if (!assets.length) return;
    
    // Generate filename from Engineer Name and PAV Date
    const name = (engineerName || 'Engineer').trim().replace(/\s+/g, '_');
    const date = (defaultPavDate || '').replace(/-/g, '_');
    const filename = `${name}_${date}.xlsx`;
    
    const ws = XLSX.utils.json_to_sheet(assets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PAV Sheet');
    XLSX.writeFile(wb, filename);
  }, [assets, engineerName, defaultPavDate]);

  return (
    <Button
      variant="contained"
      startIcon={<DownloadIcon />}
      size="small"
      sx={{ 
        minWidth: { xs: 140, sm: 170 }, 
        textTransform: 'none', 
        fontSize: { xs: '0.8rem', sm: '0.875rem' },
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: '#fff',
        fontWeight: 600,
        '&:hover': {
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
        },
        '&:disabled': {
          background: 'rgba(255, 255, 255, 0.12)',
          color: 'rgba(255, 255, 255, 0.3)',
        }
      }}
      onClick={handleDownload}
      disabled={!assets.length || !engineerName || !engineerName.trim()}
    >
      Download Updated Sheet
    </Button>
  );
}

export default DownloadButton;