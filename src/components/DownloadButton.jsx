import React, { useContext, useCallback, memo } from 'react';
import { AssetContext } from '../context/AssetContext';
import * as XLSX from 'xlsx';
import { Button, useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

function DownloadButton() {
  const { assets, engineerName, defaultPavDate } = useContext(AssetContext);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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
        background: isDark 
          ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
          : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        color: '#fff',
        fontWeight: 600,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        '&:hover': {
          background: isDark
            ? 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)'
            : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
        },
        '&:disabled': {
          background: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
          color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
        }
      }}
      onClick={handleDownload}
      disabled={!assets.length || !engineerName || !engineerName.trim()}
    >
      Download Updated Sheet
    </Button>
  );
}

export default memo(DownloadButton);