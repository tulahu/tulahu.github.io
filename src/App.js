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
import { Brightness4, Brightness7, SportsEsports, Search, CalendarToday } from '@mui/icons-material';
import DailySummary from './components/DailySummary';
import RankingTable from './components/RankingTable';
import PlayerStats from './components/PlayerStats';
import VisitorCounter from "./visitorCounter";

// Create a theme context
export const ThemeContext = createContext();

function App() {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const [data, setData] = useState(null);
  const [searchPlayer, setSearchPlayer] = useState('');
  const [selectedDate, setSelectedDate] = useState('All Time');
  const [showDailySummary, setShowDailySummary] = useState(true);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/daily_stats.json`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Fetch error:', err));
  }, []);

  // Auto-hide DailySummary when search text is present
  useEffect(() => {
    if (searchPlayer.trim() !== '') {
      setShowDailySummary(false);
    } else {
      setShowDailySummary(true);
    }
  }, [searchPlayer]);

  // Get unique dates from both ranking and player stats
  const getAllDates = () => {
    if (!data) return [];
    
    const rankingDates = data.ranking.map(entry => entry.date);
    const statsDates = data.player_stats.map(entry => entry.date);
    const allDates = [...new Set([...rankingDates, ...statsDates])];
    
    return allDates.sort((a, b) => new Date(b) - new Date(a));
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#d32f2f', // Fight red
      },
      secondary: {
        main: '#1976d2', // Steel blue
      },
      customRank: {
        gold: '#D4AF37',
        silver: '#C0C0C0',
        bronze: '#CD7F32'
      }
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

  const toggleDailySummary = () => {
    setShowDailySummary(!showDailySummary);
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

  const allDates = getAllDates();

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
            <VisitorCounter />
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              fullWidth
              placeholder="Тоглогчийн нэрээр хайх..."
              type="search"
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
              sx={{ minWidth: '200px', flexGrow: 1 }}
            />
            
            <TextField
              select
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              SelectProps={{
                native: true,
              }}
              size="small"
              sx={{ display: 'flex', flexGrow: 1 }}
            >
              <option value="All Time">Бүх цаг үе</option>
              {allDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </TextField>
            
            <IconButton 
              onClick={toggleDailySummary}
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                color: showDailySummary ? 'primary.main' : 'text.secondary'
              }}
              title={showDailySummary ? 'Өдрийн хураангуйг хаах' : 'Өдрийн хураангуйг нээх'}
            >
              <CalendarToday />
            </IconButton>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 2, 
            flexWrap: 'nowrap', 
            overflowX: 'auto' 
          }}>
            {showDailySummary && (
              <Box sx={{ width: { xs: '100%', md: '20%' }, minWidth: { xs: '100%', md: '200px' }, flexShrink: 0 }}>
                <DailySummary summary={data.daily_summary} />
              </Box>
            )}
            <Box sx={{ width: { xs: '100%', md: showDailySummary ? '30%' : '40%' }, minWidth: { xs: '100%', md: '300px' }, flexShrink: 0 }}>
              <RankingTable ranking={data.ranking} searchPlayer={searchPlayer} selectedDate={selectedDate} />
            </Box>
            <Box sx={{ width: { xs: '100%', md: showDailySummary ? '50%' : '60%' }, minWidth: { xs: '100%', md: '500px' }, flexShrink: 0 }}>
              <PlayerStats stats={data.player_stats} searchPlayer={searchPlayer} selectedDate={selectedDate} />
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;