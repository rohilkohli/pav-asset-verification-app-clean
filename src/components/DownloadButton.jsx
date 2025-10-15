import React, { useContext } from 'react';
import { AssetContext } from '../context/AssetContext';
import * as XLSX from 'xlsx';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

function DownloadButton() {
  const { assets } = useContext(AssetContext);

  const handleDownload = () => {
    if (!assets.length) return;
    const ws = XLSX.utils.json_to_sheet(assets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PAV Sheet');
    XLSX.writeFile(wb, 'updated_assets.xlsx');
  };

  return (
    <Button
      variant="contained"
      color="success"
      startIcon={<DownloadIcon />}
      size="small"
      sx={{ minWidth: 170, textTransform: 'none' }}
      onClick={handleDownload}
      disabled={!assets.length}
    >
      Download Updated Sheet
    </Button>
  );
}

export default DownloadButton;