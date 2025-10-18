import React from 'react';
import { Box, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

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
        py: 1.5,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(22, 22, 22, 0.95) 0%, rgba(22, 22, 22, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
        zIndex: 1300
      }}
    >
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          fontSize: '0.875rem'
        }}
      >
        © {year} ROHIL KOHLI. Made with 
        <FavoriteIcon sx={{ 
          fontSize: '0.875rem', 
          color: '#f093fb',
          animation: 'pulse-glow 2s infinite'
        }} /> 
        All rights reserved.
      </Typography>
    </Box>
  );
}
