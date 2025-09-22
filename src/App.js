import './App.css';
import React, { useState, useEffect, createContext } from 'react';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
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
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  SportsEsports,
  Search,
  CalendarToday,
} from '@mui/icons-material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DailySummary from './components/DailySummary';
import RankingTable from './components/RankingTable';
import PlayerStats from './components/PlayerStats';
import HoverTranslation from './utils/HoverTranslation';
import VisitorCounter from "./visitorCounter";
import { convertToTraditionalMongolian } from './utils/dateConversion';
import dailyStats from './data/daily_stats.json';

// Create a theme context
export const ThemeContext = createContext();

function App() {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const [data, setData] = useState(null);
  const [searchPlayer, setSearchPlayer] = useState('');
  const [dateMenuAnchor, setDateMenuAnchor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('All Time');
  const [showDailySummary, setShowDailySummary] = useState(true);
  const [language, setLanguage] = useState('modern');
  const handleLanguageChange = (_, newLang) => {
    if (newLang !== null) setLanguage(newLang);
  };

  const labels = {
    searchPlaceholder: {
      modern: 'Тоглогчийн нэрээр хайх...',
      traditional: 'ᠲᠣᠭᠯᠣᠭᠴᠢᠶᠨ ᠨᠡᠷᠡᠡᠷ ᠬᠠᠶᠬ'
    },
    allTime: {
      modern: 'Бүх цаг үе',
      traditional: 'ᠪᠦᠬ ᠼᠠᠭ ᠦᠧ'
    }
  };

  useEffect(() => {
    setData(dailyStats);
  }, []);

  useEffect(() => {
    if (searchPlayer.trim() !== '') {
      setShowDailySummary(false);
    } else {
      setShowDailySummary(true);
    }
  }, [searchPlayer]);

  useEffect(() => {
    if (language === 'traditional' && window.innerWidth < 768) {
      alert("Зөвлөмж: Монгол бичиг хувилбар нь утас хэвтээ байхад илүү сайн харагдана. Ер нь компьютер дээр хамаагүй дээр дээ.");
    }
  }, [language]);

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
        main: '#d32f2f',
      },
      secondary: {
        main: '#1976d2',
      },
      customRank: {
        gold: '#D4AF37',
        silver: '#C0C0C0',
        bronze: '#CD7F32'
      }
    },
    typography: {
      fontFamily: [
        '"Mongolian Baiti"',
        'Roboto',
        '"Noto Sans Mongolian"',
        'sans-serif',
      ].join(','),
    },
  });

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleDailySummary = () => setShowDailySummary(!showDailySummary);

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

  const renderLeaves = () => {
    return [...Array(40)].map((_, i) => {
      const left = Math.random() * 100;
      const fallDuration = 16 + Math.random() * 16;
      const delay = Math.random() * 5;
      const size = 20 + Math.random() * 20;

      return (
        <div
          key={i}
          className="leaf"
          style={{
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundImage: `url(${process.env.PUBLIC_URL}/leaves/leaf${(i % 3) + 1}.png)`,
            animation: `fallAndSwing ${fallDuration}s linear ${delay}s infinite`
          }}
        />
      );
    });
  };

  const handleOpenDateMenu = (event) => {
    setDateMenuAnchor(event.currentTarget);
  };

  const handleCloseDateMenu = () => {
    setDateMenuAnchor(null);
  };

  const VerticalButton = styled(Button)(({ theme }) => ({
    '& .MuiButton-endIcon': {
      marginLeft: 0,
      marginRight: '-4px',
    },
  }));

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {/* TRADITIONAL MODE LAYOUT */}
        {language === 'traditional' ? (
          <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* 🧭 Sidebar */}
            <AppBar
              position="static"
              elevation={2}
              sx={{
                flexDirection: 'column',
                alignItems: 'stretch',
                width: { xs: '72px', sm: '64px' }, // mobile wider
                height: '100vh',
                p: 1,
              }}
            >
              <Toolbar
                sx={{
                  position: 'relative',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 2,
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  zIndex: 1,
                }}
              >
                <Box
                  className="leaf-container"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    zIndex: 0,
                  }}
                >
                  {renderLeaves()}
                </Box>
                <SportsEsports />
                <HoverTranslation
                  traditionalText="ᠲᠤᠯᠠᠬ ᠤᠤ ?"
                  cyrillicText="Тулах уу?"
                  language={language}
                  variant="h6"
                  lang="mn-Mong"
                />
                <VisitorCounter language={language} />
                <ToggleButtonGroup
                  value={language}
                  exclusive
                  onChange={handleLanguageChange}
                  orientation="vertical"
                  size="small"
                >
                  <ToggleButton
                    value="modern"
                    sx={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      color: 'white', // force white text
                      '&.Mui-selected': {
                        color: 'white', // keep white when selected
                      },
                      '&:hover': {
                        color: 'white', // keep white on hover
                      }
                    }}
                  >
                    Монгол
                  </ToggleButton>
                  <ToggleButton
                    value="traditional"
                    sx={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      color: 'white', // force white text
                      '&.Mui-selected': {
                        color: 'white', // keep white when selected
                      },
                      '&:hover': {
                        color: 'white', // keep white on hover
                      }
                    }}
                  >
                    ᠮᠣᠩᠭᠣᠯ
                  </ToggleButton>
                </ToggleButtonGroup>
                <IconButton color="inherit" onClick={toggleDarkMode}>
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Toolbar>
            </AppBar>

            {/* 🔍 Vertical Search Bar */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                height: '100vh', // full viewport height
                width: '64px', // more width on mobile
                p: 1,
                gap: 2,
                overflow: 'hidden',
                position: 'relative',
                boxSizing: 'border-box',
                backgroundColor: 'background.paper',
                flexShrink: 0,
              }}
            >
              <TextField
                placeholder={labels.searchPlaceholder.traditional}
                type="search"
                value={searchPlayer}
                onChange={e => setSearchPlayer(e.target.value)}
                size="small"
                title="Тоглогчийн нэрээр хайх..."
                sx={{
                  flexGrow: 1,
                  height: '100%',
                  '& .MuiInputBase-root': {
                    alignItems: 'flex-start',
                    height: '100%',
                  },
                  '& .MuiInputBase-input': {
                    writingMode: 'vertical-rl',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    height: '100%',
                    textAlign: 'start',
                    lineHeight: '1.8em',
                    paddingTop: { xs: '32px', sm: '40px' },
                    fontFamily: '"Mongolian Baiti", "Noto Sans Mongolian", sans-serif',
                    textOrientation: searchPlayer ? 'upright' : 'mixed',
                    overflow: 'auto',
                    fontSize: { xs: '12px', sm: '14px', md: '16px' }, // smaller on mobile
                  },
                  '& .MuiInputBase-input::placeholder': {
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    opacity: 0.7,
                  },
                }}
              />
              <Search
                sx={{
                  position: 'absolute',
                  top: { xs: 8, sm: 12 },
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: { xs: 18, sm: 20 },
                  color: 'white',
                  pointerEvents: 'none',
                }}
              />
            </Box>

            {/* 📅 Top Controls + Content */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Top Controls Row */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  p: 1,
                  flexWrap: { xs: 'wrap', sm: 'nowrap' }
                }}
              >
                <IconButton
                  onClick={toggleDailySummary}
                  sx={{ color: showDailySummary ? 'primary.main' : 'text.secondary' }}
                  title={showDailySummary ? 'Өдрийн хураангуйг хаах' : 'Өдрийн хураангуйг нээх'}
                >
                  <CalendarToday />
                </IconButton>

                <VerticalButton
                  onClick={handleOpenDateMenu}
                  endIcon={<KeyboardArrowRightIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    fontFamily: '"Mongolian Baiti", "Noto Sans Mongolian", sans-serif',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    lineHeight: '1.8em',
                    textAlign: 'center',
                    padding: '4px',
                    minHeight: 'auto',
                    minWidth: '32px',
                    maxWidth: '64px',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    boxSizing: 'border-box',
                    color: 'text.primary',
                  }}
                  title={
                    selectedDate === 'All Time'
                      ? labels.allTime.modern
                      : labels.byDate?.[selectedDate]?.modern || selectedDate
                  }
                >
                  {selectedDate === 'All Time'
                    ? labels.allTime.traditional
                    : convertToTraditionalMongolian(selectedDate)}
                </VerticalButton>

                <Menu
                  anchorEl={dateMenuAnchor}
                  open={Boolean(dateMenuAnchor)}
                  onClose={handleCloseDateMenu}
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  PaperProps={{
                    sx: {
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      fontFamily: '"Mongolian Baiti", "Noto Sans Mongolian", sans-serif',
                      maxHeight: { xs: '60vh', sm: 300 },
                      overflowY: 'auto',
                      width: '100%',
                      minWidth: '48px',
                      boxSizing: 'border-box',
                    },
                  }}
                >
                  <MenuItem
                    title={labels.allTime.modern}
                    onClick={() => {
                      setSelectedDate('All Time');
                      handleCloseDateMenu();
                    }}
                  >
                    {labels.allTime.traditional}
                  </MenuItem>
                  {allDates.map(date => (
                    <MenuItem
                      key={date}
                      title={date} // shows Gregorian date on hover
                      onClick={() => {
                        setSelectedDate(date);
                        handleCloseDateMenu();
                      }}
                    >
                      {convertToTraditionalMongolian(date)}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {/* Main Content */}
              <Container maxWidth="xl" sx={{ py: 2, flexGrow: 1, height: '100vh', overflow: 'hidden' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'column' },
                    gap: 2,
                    flexWrap: 'nowrap',
                    overflowY: 'auto', // vertical scroll only here
                    height: '100%',
                    pr: 1, // optional: space for scrollbar
                  }}
                >
                  {showDailySummary && (
                    <Box
                      sx={{
                        width: language === 'traditional' ? '100%' : { xs: '100%', md: '20%' },
                        flexShrink: 0,
                      }}
                    >
                      <DailySummary summary={data.daily_summary} language={language} />
                    </Box>
                  )}
                  <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '300px' } }}>
                    <RankingTable
                      ranking={data.ranking}
                      searchPlayer={searchPlayer}
                      selectedDate={selectedDate}
                      language={language}
                    />
                  </Box>
                  <Box sx={{ flexGrow: 2, minWidth: { xs: '100%', md: '500px' } }}>
                    <PlayerStats
                      stats={data.player_stats}
                      searchPlayer={searchPlayer}
                      selectedDate={selectedDate}
                      language={language}
                    />
                  </Box>
                </Box>
              </Container>
            </Box>
          </Box>
        ) : (
          /* MODERN MODE LAYOUT */
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static" elevation={2}>           
              <Toolbar>
                <Box
                  className="leaf-container"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    zIndex: 0,
                  }}
                >
                  {renderLeaves()}
                </Box>
                <SportsEsports sx={{ mr: 2 }} />
                <HoverTranslation
                  traditionalText="ᠲᠤᠯᠠᠬ ᠤᠤ ?"
                  cyrillicText="Тулах уу?"
                  language={language}
                  variant="h6"
                  lang="mn"
                  sx={{ flexGrow: 1 }}
                />
                <VisitorCounter language={language} />
                <ToggleButtonGroup
                  value={language}
                  exclusive
                  onChange={handleLanguageChange}
                  orientation="horizontal"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <ToggleButton
                    value="modern"
                    sx={{
                      color: 'white', // force white text
                      '&.Mui-selected': {
                        color: 'white', // keep white when selected
                      },
                      '&:hover': {
                        color: 'white', // keep white on hover
                      },
                    }}
                  >
                    Монгол
                  </ToggleButton>
                  <ToggleButton
                    value="traditional"
                    sx={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      color: 'white', // force white text
                      '&.Mui-selected': {
                        color: 'white', // keep white when selected
                      },
                      '&:hover': {
                        color: 'white', // keep white on hover
                      },
                    }}
                  >
                    ᠮᠣᠩᠭᠣᠯ
                  </ToggleButton>

                </ToggleButtonGroup>
                <IconButton color="inherit" onClick={toggleDarkMode}>
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 2 }}>
              <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  fullWidth
                  placeholder={labels.searchPlaceholder.modern}
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
                  SelectProps={{ native: true }}
                  size="small"
                  sx={{ display: 'flex', flexGrow: 1 }}
                >
                  <option value="All Time">{labels.allTime.modern}</option>
                  {allDates.map(date => (
                    <option key={date} value={date}>
                      {date}
                    </option>
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

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 2,
                  flexWrap: 'nowrap',
                  overflowX: 'auto'
                }}
              >
                {showDailySummary && (
                  <Box sx={{ width: { xs: '100%', md: '20%' }, flexShrink: 0 }}>
                    <DailySummary summary={data.daily_summary} language={language}/>
                  </Box>
                )}
                <Box sx={{ width: { xs: '100%', md: '30%' }, minWidth: { xs: '100%', md: '300px' }, flexShrink: 0 }}>
                  <RankingTable ranking={data.ranking} searchPlayer={searchPlayer} selectedDate={selectedDate} language={language} />
                </Box>
                <Box sx={{ width: { xs: '100%', md: '50%' }, minWidth: { xs: '100%', md: '500px' }, flexShrink: 0 }}>
                  <PlayerStats stats={data.player_stats} searchPlayer={searchPlayer} selectedDate={selectedDate} language={language} />
                </Box>
              </Box>
            </Container>
          </Box>
        )}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
