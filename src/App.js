import React, { useState, useEffect, createContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Box,
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Brightness4, Brightness7, SportsEsports, Search } from '@mui/icons-material';
import DailySummary from './components/DailySummary';
import RankingTable from './components/RankingTable';
import PlayerStats from './components/PlayerStats';

// Create a theme context
export const ThemeContext = createContext();

function App() {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const [data, setData] = useState(null);
  const [searchPlayer, setSearchPlayer] = useState('');

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/daily_stats.json`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
    },
    typography: {
      fontFamily: [
        'Roboto',
        '"Noto Sans Mongolian"',
        'sans-serif',
      ].join(','),
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!data) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Уншиж байна...
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <SportsEsports sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Тулах уу?
            </Typography>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Тоглогчийн нэрээр хайх..."
              value={searchPlayer}
              onChange={e => setSearchPlayer(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap', overflowX: 'auto' }}>
            <Box sx={{ width: '20%', minWidth: '200px', flexShrink: 0 }}>
              <DailySummary summary={data.daily_summary} />
            </Box>
            <Box sx={{ width: '30%', minWidth: '300px', flexShrink: 0 }}>
              <RankingTable ranking={data.ranking} searchPlayer={searchPlayer} />
            </Box>
            <Box sx={{ width: '50%', minWidth: '500px', flexShrink: 0 }}>
              <PlayerStats stats={data.player_stats} searchPlayer={searchPlayer} />
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;