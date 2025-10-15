import React, { useMemo, useState, useEffect } from 'react';
import { AssetProvider } from './context/AssetContext';
import UploadForm from './components/UploadForm';
import FilterBar from './components/FilterBar';
import SearchBar from './components/SearchBar';
import AssetTable from './components/AssetTable';
import Footer from './components/Footer';
import DownloadButton from './components/DownloadButton';
import { Container, Typography, Box, Paper, createTheme, ThemeProvider, Button, TextField, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useContext } from 'react';
import { AssetContext } from './context/AssetContext';
/* sample-ui.css removed during cleanup; styles consolidated in styles/main.css */

function makeTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#90caf9' : '#1565c0' },
      secondary: { main: mode === 'dark' ? '#b0bec5' : '#6c757d' },
      background: { default: mode === 'dark' ? '#0b0b0d' : '#f6f9fc', paper: mode === 'dark' ? '#161616' : '#fff' },
      success: { main: '#66bb6a' }
    },
    typography: { fontFamily: 'Inter, Roboto, Arial' }
  });
}

function App() {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('pav_theme_mode') || 'dark'; } catch { return 'dark'; }
  });

  useEffect(() => { try { localStorage.setItem('pav_theme_mode', mode); } catch {} }, [mode]);
  // Toggle a global class to help CSS variable themes (main.css) react to light mode
  useEffect(() => {
    try {
      const root = document.documentElement;
      if (mode === 'light') root.classList.add('theme-light'); else root.classList.remove('theme-light');
    } catch (e) {}
  }, [mode]);

  const theme = useMemo(() => makeTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <AssetProvider>
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2 } }}>
          {/* add extra bottom padding equal to footer height + safe spacing to avoid overlap */}
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, pb: 10, bgcolor: 'background.paper', backdropFilter: 'blur(6px)', borderRadius: 2 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
              Physical Asset Verification
            </Typography>

            {/* Top buttons need access to context; define as child so useContext can be used safely */}
            <TopButtons mode={mode} setMode={setMode} />

            {/* uniform vertical spacing between TopButtons -> SearchBar -> FilterBar */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, px: { xs: 0, sm: 2 } }}> 
              <SearchBar />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <FilterBar />
            </Box>

            <AssetTable />
            <Footer />
          </Paper>
        </Container>
      </AssetProvider>
    </ThemeProvider>
  );
}

function TopButtons({ mode, setMode }) {
  const { saveChanges, engineerName, setEngineerName, defaultPavDate, setDefaultPavDate } = useContext(AssetContext);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, gap: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 1, sm: 2, md: 3 }, 
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <UploadForm />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => saveChanges()}
          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
        >
          Save Changes
        </Button>
        <DownloadButton />
        <IconButton sx={{ ml: 1 }} color="inherit" onClick={() => { setMode(m => m === 'dark' ? 'light' : 'dark'); window.location.reload(); }} aria-label="toggle theme">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mt: 1, 
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        width: '100%',
        justifyContent: 'center'
      }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
          <Box component="span" sx={{ 
            color: 'text.secondary', 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            textAlign: { xs: 'center', sm: 'left' },
            minWidth: { xs: 'auto', sm: 'auto' }
          }}>Engineer Name</Box>
          <TextField size="small" value={engineerName || ''} onChange={e => setEngineerName(e.target.value)} sx={{ minWidth: { xs: '100%', sm: 220 }, width: { xs: '100%', sm: 'auto' } }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
          <Box component="span" sx={{ 
            color: 'text.secondary', 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            textAlign: { xs: 'center', sm: 'left' },
            minWidth: { xs: 'auto', sm: 'auto' }
          }}>PAV Date</Box>
          <TextField size="small" type="date" value={defaultPavDate} onChange={e => setDefaultPavDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ minWidth: { xs: '100%', sm: 160 }, width: { xs: '100%', sm: 'auto' } }} />
        </Box>
      </Box>
    </Box>
  );
}

export default App;