import React from 'react';
import { Box, Typography } from '@mui/material';

// Fixed footer so it's always visible at the bottom of the viewport.
// The app container adds bottom padding so content is not hidden behind it.
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        py: 1.25,
        borderTop: '1px solid rgba(255,255,255,0.04)',
        textAlign: 'center',
        bgcolor: 'background.paper',
        boxShadow: '0 -1px 8px rgba(0,0,0,0.48)',
        zIndex: 1300
      }}
    >
      <Typography variant="caption" color="text.secondary">© {year} ROHIL KOHLI. All rights reserved.</Typography>
    </Box>
  );
}
