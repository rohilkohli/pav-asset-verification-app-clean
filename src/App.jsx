import React, { useMemo, useState, useEffect, useCallback } from 'react';
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

// Move theme creation outside component for better performance
function makeTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: { 
        main: mode === 'dark' ? '#667eea' : '#5a67d8',
        light: mode === 'dark' ? '#8796ff' : '#7f9cf5',
        dark: mode === 'dark' ? '#5a67d8' : '#4c51bf',
      },
      secondary: { 
        main: mode === 'dark' ? '#f093fb' : '#ed64a6',
        light: mode === 'dark' ? '#ffa8ff' : '#f687b3',
        dark: mode === 'dark' ? '#c661ce' : '#d53f8c',
      },
      background: { 
        default: 'transparent', 
        paper: mode === 'dark' ? 'rgba(22, 22, 22, 0.8)' : 'rgba(255, 255, 255, 0.9)' 
      },
      success: { 
        main: '#43e97b',
        light: '#6fffb0',
        dark: '#38f9d7' 
      },
      info: {
        main: '#4facfe',
        light: '#79c9ff',
        dark: '#00f2fe'
      },
      warning: {
        main: '#fa709a',
        light: '#fee140',
      },
      text: {
        primary: mode === 'dark' ? '#e6eef8' : '#2d3748',
        secondary: mode === 'dark' ? '#a0aec0' : '#718096',
      }
    },
    typography: { 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif',
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      }
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0 2px 4px rgba(0,0,0,0.1)',
      '0 4px 8px rgba(0,0,0,0.12)',
      '0 8px 16px rgba(0,0,0,0.14)',
      '0 12px 24px rgba(0,0,0,0.16)',
      '0 16px 32px rgba(0,0,0,0.18)',
      '0 20px 40px rgba(0,0,0,0.20)',
      '0 24px 48px rgba(0,0,0,0.22)',
      '0 2px 4px rgba(0,0,0,0.1)',
      '0 4px 8px rgba(0,0,0,0.12)',
      '0 8px 16px rgba(0,0,0,0.14)',
      '0 12px 24px rgba(0,0,0,0.16)',
      '0 16px 32px rgba(0,0,0,0.18)',
      '0 20px 40px rgba(0,0,0,0.20)',
      '0 24px 48px rgba(0,0,0,0.22)',
      '0 28px 56px rgba(0,0,0,0.24)',
      '0 32px 64px rgba(0,0,0,0.26)',
      '0 36px 72px rgba(0,0,0,0.28)',
      '0 40px 80px rgba(0,0,0,0.30)',
      '0 44px 88px rgba(0,0,0,0.32)',
      '0 48px 96px rgba(0,0,0,0.34)',
      '0 52px 104px rgba(0,0,0,0.36)',
      '0 56px 112px rgba(0,0,0,0.38)',
      '0 60px 120px rgba(0,0,0,0.40)',
      '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 24px',
            fontSize: '0.95rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }
          },
          contained: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            }
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: mode === 'dark' ? 'rgba(22, 22, 22, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
            transform: 'translateZ(0)',
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              '&.Mui-focused': {
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
              }
            }
          }
        }
      }
    }
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
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2 }, position: 'relative', zIndex: 1 }}>
          {/* add extra bottom padding equal to footer height + safe spacing to avoid overlap */}
          <Paper 
            elevation={24} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              pb: 10, 
              bgcolor: 'background.paper', 
              borderRadius: 4,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              }
            }}
          >
            <Box sx={{ 
              textAlign: 'center', 
              mb: 3,
              position: 'relative'
            }}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  mb: 1
                }}
              >
                Physical Asset Verification
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 500
                }}
              >
                Manage and verify your assets with ease
              </Typography>
            </Box>

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
  
  const handleToggleTheme = useCallback(() => {
    setMode(m => m === 'dark' ? 'light' : 'dark');
    window.location.reload();
  }, [setMode]);

  const handleEngineerNameChange = useCallback((e) => {
    setEngineerName(e.target.value);
  }, [setEngineerName]);

  const handlePavDateChange = useCallback((e) => {
    setDefaultPavDate(e.target.value);
  }, [setDefaultPavDate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, gap: 2 }}>
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
          sx={{ 
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
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
        <DownloadButton />
        <IconButton 
          sx={{ 
            ml: 1,
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)' 
              : 'linear-gradient(135deg, #5e35b1 0%, #311b92 100%)',
            color: '#fff',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'rotate(180deg) scale(1.1)',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.5)',
            }
          }} 
          color="inherit" 
          onClick={handleToggleTheme} 
          aria-label="toggle theme"
        >
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
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          width: { xs: '100%', sm: 'auto' },
          background: engineerName ? 'rgba(67, 233, 123, 0.1)' : 'rgba(245, 87, 108, 0.1)',
          padding: { xs: 2, sm: 1.5 },
          borderRadius: 2,
          border: `1px solid ${engineerName ? 'rgba(67, 233, 123, 0.3)' : 'rgba(245, 87, 108, 0.3)'}`,
          transition: 'all 0.3s ease',
        }}>
          <Box component="span" sx={{ 
            color: 'text.primary', 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            textAlign: { xs: 'center', sm: 'left' },
            fontWeight: 600,
            minWidth: { xs: 'auto', sm: 'auto' }
          }}>Engineer Name *</Box>
          <TextField 
            size="small" 
            value={engineerName || ''} 
            onChange={handleEngineerNameChange} 
            required 
            error={!engineerName}
            helperText={!engineerName ? 'Required field' : ''}
            sx={{ 
              minWidth: { xs: '100%', sm: 220 }, 
              width: { xs: '100%', sm: 'auto' },
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
              }
            }} 
          />
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          width: { xs: '100%', sm: 'auto' },
          background: 'rgba(79, 172, 254, 0.1)',
          padding: { xs: 2, sm: 1.5 },
          borderRadius: 2,
          border: '1px solid rgba(79, 172, 254, 0.3)',
        }}>
          <Box component="span" sx={{ 
            color: 'text.primary', 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            textAlign: { xs: 'center', sm: 'left' },
            fontWeight: 600,
            minWidth: { xs: 'auto', sm: 'auto' }
          }}>PAV Date</Box>
          <TextField 
            size="small" 
            type="date" 
            value={defaultPavDate} 
            onChange={handlePavDateChange} 
            InputLabelProps={{ shrink: true }} 
            sx={{ 
              minWidth: { xs: '100%', sm: 160 }, 
              width: { xs: '100%', sm: 'auto' },
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
              }
            }} 
          />
        </Box>
      </Box>
    </Box>
  );
}

export default App;